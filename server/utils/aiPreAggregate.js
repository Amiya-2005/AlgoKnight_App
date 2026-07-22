// Pre-aggregation helpers for the AI Analyzer.
// The LLM should never have to re-derive trends from raw arrays - we compute
// the numbers here (cheap + deterministic) and let the LLM's job be purely
// diagnosis/narrative on top of these pre-computed stats.

const DAY_MS = 24 * 60 * 60 * 1000;

export function computeRatingTrend(contests = []) {
    if (!contests || contests.length === 0) {
        return {
            startRating: 0,
            currentRating: 0,
            peakRating: 0,
            ratingChange_last5contests: 0,
            ratingChange_last30days: 0,
            contestCount: 0,
            trend: "no-data"
        };
    }

    const sorted = [...contests].sort((a, b) => new Date(a.date) - new Date(b.date));

    const startRating = sorted[0].rating;
    const currentRating = sorted[sorted.length - 1].rating;
    const peakRating = Math.max(...sorted.map(c => c.rating));

    const last5 = sorted.slice(-5);
    const ratingChange_last5contests = last5.length > 1
        ? last5[last5.length - 1].rating - last5[0].rating
        : 0;

    const cutoff = Date.now() - 30 * DAY_MS;
    const last30 = sorted.filter(c => new Date(c.date).getTime() >= cutoff);
    const ratingChange_last30days = last30.length > 1
        ? last30[last30.length - 1].rating - last30[0].rating
        : 0;

    let trend = "plateauing";
    if (ratingChange_last5contests > 50) trend = "improving";
    else if (ratingChange_last5contests < -50) trend = "declining";

    return {
        startRating,
        currentRating,
        peakRating,
        ratingChange_last5contests,
        ratingChange_last30days,
        contestCount: sorted.length,
        trend
    };
}

export function computeHeatmapStats(heatmap = []) {
    if (!heatmap || heatmap.length === 0) {
        return {
            activeDaysLast30: 0,
            currentStreak: 0,
            longestGapDays: 0,
            avgSubsPerActiveDay: 0,
            mostActiveDayOfWeek: "n/a"
        };
    }

    const sorted = [...heatmap].sort((a, b) => new Date(a.date) - new Date(b.date));

    const cutoff = Date.now() - 30 * DAY_MS;
    const activeDaysLast30 = sorted.filter(d => d.subs > 0 && new Date(d.date).getTime() >= cutoff).length;

    // Current streak: consecutive active days counting back from the most recent entry
    let currentStreak = 0;
    for (let i = sorted.length - 1; i >= 0; i--) {
        if (sorted[i].subs > 0) currentStreak++;
        else break;
    }

    // Longest gap (in days) between two consecutive active-day entries
    let longestGapDays = 0;
    let lastActiveDate = null;
    sorted.forEach(d => {
        if (d.subs > 0) {
            const cur = new Date(d.date);
            if (lastActiveDate) {
                const gap = Math.round((cur - lastActiveDate) / DAY_MS);
                longestGapDays = Math.max(longestGapDays, gap);
            }
            lastActiveDate = cur;
        }
    });

    const activeDays = sorted.filter(d => d.subs > 0);
    const totalSubs = activeDays.reduce((s, d) => s + d.subs, 0);
    const avgSubsPerActiveDay = activeDays.length ? +(totalSubs / activeDays.length).toFixed(2) : 0;

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayCounts = new Array(7).fill(0);
    activeDays.forEach(d => { dayCounts[new Date(d.date).getDay()] += d.subs; });
    const maxIdx = dayCounts.indexOf(Math.max(...dayCounts));
    const mostActiveDayOfWeek = activeDays.length ? dayNames[maxIdx] : "n/a";

    return { activeDaysLast30, currentStreak, longestGapDays, avgSubsPerActiveDay, mostActiveDayOfWeek };
}
