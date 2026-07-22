import mongoose from "mongoose";
import { User } from "../../models/User.js";
import { Problem } from "../../models/Problem.js";

const SHEET_SIZE = 20;
const MAX_WEIGHTED_TAGS = 10;     // cap distinct tags pulled from, so each still gets a meaningful share of the 20 slots
const CACHE_MS = 24 * 60 * 60 * 1000; // Rebuild at most once a day by default - manual rebuild bypasses this via ?refresh=true

export default async function (req, res) {
    const { user } = req;
    const { page = 1, limit = 20, refresh } = req.query;
    const forceRebuild = refresh === 'true';
    const start = (page - 1) * limit;           //page is 1-based but sheet array is 0-based
    const end = page * limit - 1;
    let totalPages;

    console.log("Page : ", page, "Limit : ", limit, "| Force rebuild :", forceRebuild);

    console.log("Smartsheet build requested");
    if (!user) {
        console.log("User not found (Smartsheet build requested)");

        return res.status(400).json({
            fullData: null,
            success: false,
            message: "Login required"
        })
    }
    try {
        const coder = await User.findOne({ email: user.email });

        let savedSheet = coder.smartsheet;
        let personalized;
        let lastUpdated;

        if (forceRebuild || (!savedSheet.lastUpdated) || (new Date(savedSheet.lastUpdated)).getTime() < Date.now() - CACHE_MS) {
            const flatTags = flattenWeakTopics(coder.aiAnalysis?.weakTopics || []);

            let data;
            if (flatTags.length > 0) {
                data = await buildWeightedSheet(coder, flatTags);
                personalized = true;
            }
            else {
                // Hard fallback - no AI analysis yet, so there are no weights to build from.
                console.log("No AI weak-topic weights available, falling back to global popularity sheet");
                data = await buildFallbackSheet(coder);
                personalized = false;
            }

            console.log("Sheet size : ", data.length, "| Personalized : ", personalized);
            console.log("Smartsheet built successfully, valid till : ", (new Date(Date.now() + CACHE_MS)).toLocaleString());

            totalPages = Math.ceil(data.length / limit);
            savedSheet = data.slice(start, end + 1);
            lastUpdated = new Date();

            coder.smartsheet = { sheet: data, personalized, lastUpdated };
            await coder.save();
        }
        else {
            totalPages = Math.ceil(savedSheet.sheet.length / limit);
            personalized = savedSheet.personalized;
            lastUpdated = savedSheet.lastUpdated;
            console.log("Saved sheet size : ", savedSheet.sheet.length);
            console.log("Used cached sheet, expires at : ", (new Date(new Date(savedSheet.lastUpdated).getTime() + CACHE_MS)).toLocaleString());
            savedSheet = savedSheet.sheet.slice(start, end + 1);
        }

        const problemIds = savedSheet.map(item => item.task);

        const problems = await Problem.find({ _id: { $in: problemIds } });

        const problemMap = new Map(problems.map(p => [p._id.toString(), p]));

        const enrichedSheet = savedSheet.map(item => ({
            task: problemMap.get(item.task.toString()), // replace id with full problem
            connectionsSolved: item.connectionsSolved,
            matchedTopic: item.matchedTopic || null,
            matchedTag: item.matchedTag || null,
        }));

        return res.status(200).json({
            smartSheet: enrichedSheet,
            personalized,
            totalPages,
            lastUpdated,
            success: true,
            message: "Smartsheet constructed successfully"
        })
    }
    catch (error) {
        console.log("Could not construct smartSheet : ", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// weakTopics is [{ topic, reason, tags: [{tag, weight}] }] - flatten into a single
// {tag, weight, topic} list for allocation/selection. If the same exact tag somehow
// appears under two topics, keep the higher-weighted occurrence.
function flattenWeakTopics(weakTopics) {
    const byTag = new Map();
    for (const w of weakTopics) {
        for (const t of (w.tags || [])) {
            const existing = byTag.get(t.tag);
            if (!existing || t.weight > existing.weight) {
                byTag.set(t.tag, { tag: t.tag, weight: t.weight, topic: w.topic });
            }
        }
    }
    return [...byTag.values()];
}

// Split SHEET_SIZE slots across the (capped) top weak tags, proportional to their weight.
// Every tag that makes the cut gets at least 1 slot; remainder gets distributed round-robin.
function allocateSlots(flatTags, totalSlots) {
    const topTags = [...flatTags]
        .sort((a, b) => b.weight - a.weight)
        .slice(0, MAX_WEIGHTED_TAGS);

    const weightSum = topTags.reduce((s, t) => s + t.weight, 0) || 1;

    const allocations = topTags.map(t => ({
        tag: t.tag,
        topic: t.topic,
        count: Math.max(1, Math.round((t.weight / weightSum) * totalSlots))
    }));

    let diff = totalSlots - allocations.reduce((s, a) => s + a.count, 0);
    let i = 0;
    while (diff !== 0 && allocations.length > 0 && i < 1000) {
        const idx = i % allocations.length;
        if (diff > 0) {
            allocations[idx].count++;
            diff--;
        } else if (allocations[idx].count > 1) {
            allocations[idx].count--;
            diff++;
        }
        i++;
    }

    return allocations;
}

function countConnectionsSolved(problem, friendSet) {
    return (problem.solvers || []).filter(s => friendSet.has(s.toString())).length;
}

// Builds the sheet entirely from the LLM-assigned tag weights - no network/friend
// aggregation involved in problem *selection* (friends only get used afterwards, purely
// as an informational "connections solved" count on each already-chosen problem).
async function buildWeightedSheet(coder, flatTags) {
    const friendSet = new Set(coder.friends.map(f => f.toString()));
    const excludeIds = new Set(
        coder.submissions.data
            .filter(s => s.status === 'AC')
            .map(s => s.task.toString())
    );

    const allocations = allocateSlots(flatTags, SHEET_SIZE);
    const selected = [];

    for (const { tag, topic, count } of allocations) {
        if (count <= 0) continue;

        const excludeObjIds = [...excludeIds].map(id => new mongoose.Types.ObjectId(id));
        const sampled = await Problem.aggregate([
            { $match: { tags: { $regex: new RegExp(`^${escapeRegex(tag)}$`, 'i') }, _id: { $nin: excludeObjIds } } },
            { $sample: { size: count } }
        ]);

        sampled.forEach(p => {
            excludeIds.add(p._id.toString());
            selected.push({ problem: p, matchedTopic: topic, matchedTag: tag });
        });

        console.log(`Tag "${tag}" (topic "${topic}", weight-allocated ${count}) -> matched ${sampled.length} problem(s)`);
    }

    // Weak-tag pools can run dry (not enough problems tagged yet) - backfill with
    // generally popular, unsolved problems so the sheet still reaches SHEET_SIZE.
    if (selected.length < SHEET_SIZE) {
        const deficit = SHEET_SIZE - selected.length;
        const excludeObjIds = [...excludeIds].map(id => new mongoose.Types.ObjectId(id));

        const backfill = await Problem.aggregate([
            { $match: { _id: { $nin: excludeObjIds } } },
            { $addFields: { solverCount: { $size: { $ifNull: ["$solvers", []] } } } },
            { $sort: { solverCount: -1 } },
            { $limit: deficit }
        ]);

        backfill.forEach(p => selected.push({ problem: p, matchedTopic: null, matchedTag: null }));
    }

    return selected.map(({ problem, matchedTopic, matchedTag }) => ({
        task: problem._id,
        connectionsSolved: countConnectionsSolved(problem, friendSet),
        matchedTopic,
        matchedTag,
    }));
}

// Hard fallback for when the coder has no AI analysis yet - purely global popularity,
// no personalization, so the page never breaks while the user hasn't generated a report.
async function buildFallbackSheet(coder) {
    const friendSet = new Set(coder.friends.map(f => f.toString()));
    const excludeObjIds = coder.submissions.data
        .filter(s => s.status === 'AC')
        .map(s => new mongoose.Types.ObjectId(s.task.toString()));

    const problems = await Problem.aggregate([
        { $match: { _id: { $nin: excludeObjIds } } },
        { $addFields: { solverCount: { $size: { $ifNull: ["$solvers", []] } } } },
        { $sort: { solverCount: -1 } },
        { $limit: SHEET_SIZE }
    ]);

    return problems.map(p => ({
        task: p._id,
        connectionsSolved: countConnectionsSolved(p, friendSet),
        matchedTopic: null,
        matchedTag: null,
    }));
}
