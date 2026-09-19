import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Home, ChevronRight, Loader, Trophy } from "lucide-react";
import { useLeaderboardStore } from "../store/useLeaderboardStore";
import { useAuthStore } from "../store/useAuthStore";

const Leaderboard = () => {
    const navigate = useNavigate();
    const { leaderboard, isLeaderboardLoading, fetchLeaderboard } = useLeaderboardStore();
    const { authUser } = useAuthStore();

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-200 w-full">
            <div className="container mx-auto p-4 pt-6">
                <div className="flex items-center gap-1 pb-2">
                    <Home
                        onClick={() => navigate("/")}
                        className="cursor-pointer w-4 h-4"
                    />
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-sm">Leaderboard</span>
                </div>

                <div className="card bg-base-100 shadow-xl p-4 border-success/20 border-1 mt-4">
                    <h1 className="text-2xl font-bold flex items-center gap-2 pb-4 pl-2">
                        <Trophy className="w-6 h-6 text-warning" />
                        Leaderboard
                    </h1>

                    {isLeaderboardLoading ? (
                        <div className="flex items-center justify-center gap-3 py-16">
                            <Loader className="w-6 h-6 animate-spin" />
                            <span>Loading leaderboard...</span>
                        </div>
                    ) : leaderboard.length === 0 ? (
                        <div className="py-16 text-center opacity-70">
                            No solved problems yet. Be the first on the board!
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>User</th>
                                        <th className="text-right">Problems Solved</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard.map((entry) => {
                                        const isCurrentUser = authUser?.id === entry.userId;
                                        return (
                                            <tr
                                                key={entry.userId}
                                                className={isCurrentUser ? "bg-primary/10 font-semibold" : ""}
                                            >
                                                <td>#{entry.rank}</td>
                                                <td>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden">
                                                            <img
                                                                src={entry.image || "https://avatar.iran.liara.run/public"}
                                                                alt={`${entry.name} avatar`}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        </div>
                                                        <span>
                                                            {entry.name}
                                                            {isCurrentUser && (
                                                                <span className="badge badge-primary badge-sm ml-2">You</span>
                                                            )}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="text-right">{entry.solvedCount}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
