import { db } from "../libs/db.js";
import { apiError } from "../utils/api.error.js";
import { apiResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async-handler.js";

// Public leaderboard: rank users by number of problems solved.
// Solved count = number of ProblemSolved rows per user (already unique per
// (userId, problemId)). On-demand aggregation is fine at the current scale
// (~100-150 users). Only non-sensitive fields (name, image) are returned — no
// email or other PII.
export const getLeaderboard = asyncHandler(async (req, res) => {
    try {
        // Count solved problems per user.
        const grouped = await db.ProblemSolved.groupBy({
            by: ["userId"],
            _count: { _all: true },
        });

        // Fetch display info for the users that appear in the leaderboard.
        const userIds = grouped.map((row) => row.userId);
        const users = await db.User.findMany({
            where: { id: { in: userIds } },
            select: { id: true, name: true, image: true },
        });
        const userById = new Map(users.map((u) => [u.id, u]));

        // Build rows, sort by solved count desc (tie-break by name for stability).
        const rows = grouped
            .map((row) => {
                const user = userById.get(row.userId);
                return {
                    userId: row.userId,
                    name: user?.name ?? "Anonymous",
                    image: user?.image ?? null,
                    solvedCount: row._count._all,
                };
            })
            .sort((a, b) => {
                if (b.solvedCount !== a.solvedCount) return b.solvedCount - a.solvedCount;
                return (a.name || "").localeCompare(b.name || "");
            });

        // Assign dense-ish rank (users with equal solved counts share a rank).
        let lastCount = null;
        let lastRank = 0;
        const ranked = rows.map((row, index) => {
            const rank = row.solvedCount === lastCount ? lastRank : index + 1;
            lastCount = row.solvedCount;
            lastRank = rank;
            return { ...row, rank };
        });

        return res.status(200).json(
            new apiResponse(200, ranked, "Leaderboard fetched successfully")
        );
    } catch (error) {
        console.error("Leaderboard fetch failed", {
            name: error.name,
            message: error.message,
            code: error.code,
            statusCode: error.statusCode,
            stack: error.stack,
        });
        if (error instanceof apiError) {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false,
            });
        }

        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong while fetching the leaderboard",
        });
    }
});
