import { useState, useEffect } from "react";
import { Link, type Route } from "react-router";
import { plannerAPI } from "../../services/planner";
import type { PlannerTableRes } from "../../services/types";
import {ProtectedRoute} from "~/contexts/AuthContext";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Planner History" },
        { name: "description", content: "View your previously calculated schedules" },
    ];
}

function PlannerHistoryPage() {
    const [planners, setPlanners] = useState<PlannerTableRes[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

    const fetchHistory = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await plannerAPI.getHistory({
                page,
                size: 10,
                sort_order: sortOrder
            });

            if (response.is_success) {
                setPlanners(response.data.items);
                setTotalPages(response.data.total_pages);
            } else {
                throw new Error(response.message || "Failed to load history");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred while fetching history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [page, sortOrder]);

    const handleDelete = async (plannerId: string) => {
        if (!window.confirm("Are you sure you want to delete this planner?")) return;

        try {
            await plannerAPI.deletePlanner(plannerId);
            fetchHistory();
        } catch (err) {
            alert("Failed to delete planner. Please try again.");
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('pl-PL', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center py-12 px-4 relative overflow-x-hidden"
            style={{
                backgroundColor: "#1a1a1a",
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,.03) 2px, rgba(255,255,255,.03) 4px)`,
            }}
        >
            {/* Corner info buttons */}
            <div className="absolute top-6 right-6 flex gap-4">
                <button className="w-10 h-10 border-2 border-lime-500 rounded-lg flex items-center justify-center text-lime-500 hover:bg-lime-500 hover:text-black transition-colors text-lg font-bold">?</button>
                <button className="w-10 h-10 border-2 border-lime-500 rounded-lg flex items-center justify-center text-lime-500 hover:bg-lime-500 hover:text-black transition-colors text-lg font-bold">i</button>
            </div>

            {/* Home button */}
            <div className="absolute top-6 left-6">
                <Link to="/" className="px-4 h-10 border-2 border-lime-500 rounded-lg flex items-center justify-center text-lime-500 hover:bg-lime-500 hover:text-black transition-colors text-sm font-bold">
                    HOME
                </Link>
            </div>

            <div className="w-full max-w-4xl space-y-8">
                <header className="text-center mb-10">
                    <h1 className="text-4xl text-white mb-2 italic">Schedule History</h1>
                    <p className="text-lime-500 font-mono text-sm opacity-70">Access your past calculation logs</p>
                </header>

                {error && (
                    <div className="border-2 border-red-500 bg-red-900/20 p-4 rounded-lg text-center mb-6">
                        <p className="text-red-400 font-mono text-sm">{error}</p>
                    </div>
                )}

                <div className="flex justify-between items-center border-b-2 border-lime-500/30 pb-4">
                    <h2 className="text-lime-500 font-bold uppercase flex items-center gap-2 tracking-widest">
                        LOG ARCHIVE
                    </h2>
                    <button
                        onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
                        className="px-4 py-2 border border-lime-500 text-lime-500 text-xs font-mono uppercase rounded hover:bg-lime-500 hover:text-black transition-colors"
                    >
                        Sort: {sortOrder === "desc" ? "Newest First" : "Oldest First"}
                    </button>
                </div>

                {loading && planners.length === 0 ? (
                    <div className="text-center py-20 text-lime-500 font-mono text-xl animate-pulse">
                        ACCESSING_DATABASE...
                    </div>
                ) : planners.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-lime-500/30 rounded-lg">
                        <p className="text-white/50 font-mono">No calculated schedules found.</p>
                        <Link to="/planer" className="mt-4 inline-block text-lime-500 underline text-sm">Create your first planner</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {planners.map((planner) => (
                            <div key={planner.id} className="border-2 border-lime-500/30 bg-black/40 p-5 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-lime-500 transition-colors">
                                <div className="space-y-2">
                                    <p className="text-lime-500 text-xs font-mono font-bold">
                                        CREATED: <span className="text-white">{formatDate(planner.created_at)}</span>
                                    </p>
                                    <div className="flex gap-4 text-sm text-gray-300 font-mono">
                                        <span>Wake: {String(planner.wake_time)}</span>
                                        <span>Sleep: {String(planner.sleep_time)}</span>
                                    </div>
                                    <div className="flex gap-4 text-xs font-mono mt-2">
                                        <span className="bg-lime-500/10 text-lime-400 px-2 py-1 rounded">Target: {planner.desired_count || "Auto"} units</span>
                                        <span className="bg-lime-500/10 text-lime-400 px-2 py-1 rounded">Sessions: {planner.sessions_count}</span>
                                    </div>
                                </div>
                                <div className="flex w-full sm:w-auto gap-3">
                                    <button
                                        onClick={() => handleDelete(planner.id)}
                                        className="flex-1 sm:flex-none px-4 py-2 border border-red-500 text-red-500 text-sm font-bold rounded hover:bg-red-500 hover:text-white transition-colors"
                                    >
                                        DEL
                                    </button>
                                    <Link
                                        to={`/planner/${planner.id}`}
                                        className="flex-1 sm:flex-none px-6 py-2 border-2 border-lime-500 text-lime-500 text-sm font-bold rounded text-center hover:bg-lime-500 hover:text-black transition-colors"
                                    >
                                        VIEW DETAILS
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                {!loading && totalPages > 1 && (
                    <div className="flex justify-center items-center gap-6 pt-8">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 border border-lime-500 text-lime-500 disabled:opacity-30 disabled:hover:bg-transparent rounded hover:bg-lime-500 hover:text-black transition-colors font-mono"
                        >
                            &lt; PREV
                        </button>
                        <span className="text-lime-500 font-mono text-sm">
                            PAGE {page} OF {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 border border-lime-500 text-lime-500 disabled:opacity-30 disabled:hover:bg-transparent rounded hover:bg-lime-500 hover:text-black transition-colors font-mono"
                        >
                            NEXT &gt;
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PlanerHistory() {
    return (
        <ProtectedRoute requireAuth={true}>
            <PlannerHistoryPage />
        </ProtectedRoute>
    )
}