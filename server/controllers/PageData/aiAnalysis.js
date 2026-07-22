import { User } from "../../models/User.js";
import { Profile } from "../../models/Profile.js";
import { generateAnalysis } from "../../services/llmService.js";
import { computeRatingTrend, computeHeatmapStats } from "../../utils/aiPreAggregate.js";

const CACHE_MS = 24 * 60 * 60 * 1000; // AI report is cached for 24h unless a refresh is requested
const WEAK_TOPIC_MAX = 8;
const TAGS_PER_TOPIC_MAX = 6;
const PLATFORMS = ['codeforces', 'codechef', 'leetcode'];

function sanitizeAnalysis(raw, availableTagSet) {
    if (!raw || typeof raw !== 'object') throw new Error("Malformed LLM response");

    // Map each tag case-insensitively back onto its exact DB casing, and drop any
    // tag the LLM invented/reworded that doesn't actually exist in the problem bank -
    // otherwise the smartsheet pipeline can't find matching problems for it.
    const weakTopics = (Array.isArray(raw.weakTopics) ? raw.weakTopics : [])
        .filter(w => w && typeof w.topic === 'string' && w.topic.trim())
        .map(w => {
            const tags = (Array.isArray(w.tags) ? w.tags : [])
                .filter(t => t && typeof t.tag === 'string' && t.tag.trim())
                .map(t => {
                    const realTag = availableTagSet.get(t.tag.trim().toLowerCase());
                    return realTag ? {
                        tag: realTag,
                        weight: Math.min(10, Math.max(1, Math.round(Number(t.weight)) || 1)),
                    } : null;
                })
                .filter(Boolean)
                .sort((a, b) => b.weight - a.weight)
                .slice(0, TAGS_PER_TOPIC_MAX);

            return tags.length > 0 ? {
                topic: w.topic.trim().slice(0, 100),
                reason: typeof w.reason === 'string' ? w.reason.slice(0, 300) : "",
                tags,
                _maxWeight: Math.max(...tags.map(t => t.weight)), // sort key only, stripped before saving
            } : null;
        })
        .filter(Boolean)
        .sort((a, b) => b._maxWeight - a._maxWeight)
        .slice(0, WEAK_TOPIC_MAX)
        .map(({ _maxWeight, ...rest }) => rest);

    const ratingAnalysis = {};
    PLATFORMS.forEach(p => {
        const r = raw.ratingAnalysis?.[p];
        ratingAnalysis[p] = {
            trend: typeof r?.trend === 'string' ? r.trend : 'no-data',
            note: typeof r?.note === 'string' ? r.note.slice(0, 300) : ""
        };
    });

    return {
        summary: typeof raw.summary === 'string' ? raw.summary.slice(0, 800) : "",
        strengths: (Array.isArray(raw.strengths) ? raw.strengths : []).filter(s => typeof s === 'string').slice(0, 8),
        weakTopics,
        ratingAnalysis,
        consistencyAnalysis: {
            note: typeof raw.consistencyAnalysis?.note === 'string' ? raw.consistencyAnalysis.note.slice(0, 400) : "",
            recommendation: typeof raw.consistencyAnalysis?.recommendation === 'string' ? raw.consistencyAnalysis.recommendation.slice(0, 400) : ""
        },
        keyPoints: (Array.isArray(raw.keyPoints) ? raw.keyPoints : []).filter(k => typeof k === 'string').slice(0, 10),
    };
}

export default async function getAIAnalysis(req, res) {
    const { user } = req;
    const forceRefresh = req.query.refresh === 'true';

    console.log("AI analysis requested. Refresh :", forceRefresh);

    if (!user || !user.profileId) {
        console.log("User not found (AI analysis requested)");
        return res.status(400).json({
            aiAnalysis: null,
            success: false,
            message: "Login required."
        });
    }

    try {
        const coder = await User.findOne({ email: user.email });
        if (!coder) {
            return res.status(400).json({
                aiAnalysis: null,
                success: false,
                message: "User not found."
            });
        }

        const cached = coder.aiAnalysis;
        const isFresh = cached?.lastUpdated && (new Date(cached.lastUpdated)).getTime() > Date.now() - CACHE_MS;

        if (isFresh && !forceRefresh) {
            console.log("Serving cached AI analysis, valid till :", (new Date((new Date(cached.lastUpdated)).getTime() + CACHE_MS)).toLocaleString());
            return res.status(200).json({
                aiAnalysis: cached,
                success: true,
                cached: true,
                message: "AI analysis served from cache."
            });
        }

        const profile = await Profile.findById(user.profileId);
        if (!profile) {
            return res.status(200).json({
                aiAnalysis: cached || null,
                success: false,
                message: "Profile not found; connect your handles first."
            });
        }

        // Same underlying data the dashboard uses, just pre-aggregated so the LLM
        // reasons over dense summary stats instead of re-deriving them from raw arrays.
        const payload = {};
        const availableTagSet = new Map(); // lowercase -> real DB casing, so weakTopics.tag always matches an actual Problem.tags entry
        PLATFORMS.forEach(p => {
            const tags = (profile[p].categories || []).map(c => c.tag).filter(Boolean);
            tags.forEach(t => availableTagSet.set(t.toLowerCase(), t));

            payload[p] = {
                categories: profile[p].categories,
                availableTags: tags, // the ONLY tag strings the LLM is allowed to use for weakTopics on this platform
                solved: profile[p].solved,
                total: profile[p].total,
                ratingStats: computeRatingTrend(profile[p].contests),
                heatmapStats: computeHeatmapStats(profile[p].heatmap),
            };
        });

        let analysis;
        try {
            const raw = await generateAnalysis(payload);
            analysis = sanitizeAnalysis(raw, availableTagSet);

            if ((raw.weakTopics?.length || 0) > 0 && analysis.weakTopics.length === 0) {
                console.warn(
                    "All LLM weakTopics were rejected - none of the returned tags matched a real DB tag.",
                    "LLM returned:", raw.weakTopics?.map(w => ({ topic: w.topic, tags: w.tags?.map(t => t.tag) })),
                    "| Known tags:", [...availableTagSet.values()]
                );
            }
        } catch (llmError) {
            console.error("LLM analysis failed :", llmError);

            if (cached?.lastUpdated) {
                return res.status(200).json({
                    aiAnalysis: cached,
                    success: true,
                    cached: true,
                    message: "Could not refresh analysis right now; showing last saved report."
                });
            }

            return res.status(502).json({
                aiAnalysis: null,
                success: false,
                message: "AI analysis is temporarily unavailable. Please try again later."
            });
        }

        analysis.lastUpdated = new Date();
        coder.aiAnalysis = analysis;
        // Invalidate the cached smartsheet so the next visit rebuilds immediately
        // from the fresh weights, instead of waiting out the smartsheet's own TTL.
        coder.smartsheet.lastUpdated = new Date(0);
        await coder.save();

        console.log("AI analysis generated and cached successfully.");

        return res.status(200).json({
            aiAnalysis: analysis,
            success: true,
            cached: false,
            message: "AI analysis generated successfully."
        });
    }
    catch (error) {
        console.log("Could not build AI analysis");
        console.error(error);
        return res.status(500).json({
            aiAnalysis: null,
            success: false,
            message: "Server error."
        });
    }
}
