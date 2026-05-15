import { useState, useEffect } from "react";
import { Link, useParams, useNavigate, type Route } from "react-router";
import { plannerAPI } from "../../services/planner";
import type { PlannerDetailRes } from "../../services/types";
import {ProtectedRoute} from "~/contexts/AuthContext";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Planner Details" },
        { name: "description", content: "Detailed view of your calculated schedule" },
    ];
}

function PlannerDetailsPage() {
    const { plannerId } = useParams();
    const navigate = useNavigate();

    const [planner, setPlanner] = useState<PlannerDetailRes | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!plannerId) return;
            setLoading(true);
            try {
                const response = await plannerAPI.getPlannerDetails(plannerId);
                if (response.is_success) {
                    // response.data jest typu PlannerDetailRes, więc teraz wszystko się zgadza
                    setPlanner(response.data);
                } else {
                    throw new Error(response.message || "Failed to load planner details");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [plannerId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] text-lime-500 font-mono text-xl">
                CALCULATING_HUD...
            </div>
        );
    }

    return (
        <div
            className="min-h-screen flex flex-col items-center py-12 px-4 relative overflow-x-hidden"
            style={{
                backgroundColor: "#1a1a1a",
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,.03) 2px, rgba(255,255,255,.03) 4px)`,
            }}
        >
            <div className="absolute top-6 right-6 flex gap-4">
                <button className="w-10 h-10 border-2 border-lime-500 rounded-lg flex items-center justify-center text-lime-500 hover:bg-lime-500 hover:text-black transition-colors text-lg font-bold">?</button>
                <button className="w-10 h-10 border-2 border-lime-500 rounded-lg flex items-center justify-center text-lime-500 hover:bg-lime-500 hover:text-black transition-colors text-lg font-bold">i</button>
            </div>

            <div className="absolute top-6 left-6">
                <Link to="/" className="w-10 h-10 border-2 border-lime-500 rounded-lg flex items-center justify-center text-lime-500 hover:bg-lime-500 hover:text-black transition-colors text-lg font-bold">⌂</Link>
            </div>

            <div className="w-full max-w-4xl space-y-8">
                <header className="text-center">
                    <h1 className="text-4xl text-white mb-2 italic">Planner Details</h1>
                    <p className="text-lime-500 font-mono text-sm opacity-70">ID: {plannerId}</p>
                </header>

                {error ? (
                    <div className="border-2 border-red-500 bg-red-900/20 p-6 rounded-lg text-center">
                        <p className="text-red-400 font-mono">{error}</p>
                        <button onClick={() => navigate("/history")} className="mt-4 text-lime-500 underline">Back to History</button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Core Settings Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: "Wake Time", value: planner?.wake_time, icon: "☼" },
                                { label: "Sleep Time", value: planner?.sleep_time, icon: "☾" },
                                { label: "Desired Goal", value: `${planner?.desired_count} units`, icon: "⚡" },
                            ].map((stat, i) => (
                                <div key={i} className="border-2 border-lime-500/30 p-6 rounded-lg bg-black/20 text-center">
                                    <span className="text-3xl text-lime-500 block mb-2">{stat.icon}</span>
                                    <p className="text-lime-500/60 uppercase text-xs font-bold tracking-widest">{stat.label}</p>
                                    <p className="text-2xl text-white font-mono mt-1">{String(stat.value)}</p>
                                </div>
                            ))}
                        </div>

                        <section className="border-2 border-lime-500/30 rounded-lg overflow-hidden bg-black/20">
                            <div className="bg-lime-500/10 p-4 border-b-2 border-lime-500/30">
                                <h2 className="text-lime-500 font-bold uppercase tracking-wider flex items-center gap-2">
                                    <span>☰</span> Fixed Constraints (Tasks)
                                </h2>
                            </div>
                            <div className="p-0">
                                <table className="w-full text-left font-mono text-sm">
                                    <thead>
                                    <tr className="border-b border-lime-500/20 text-lime-500/50">
                                        <th className="p-4">Title</th>
                                        <th className="p-4">Start</th>
                                        <th className="p-4">End</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {planner?.tasks.map((task) => (
                                        <tr key={task.id} className="border-b border-lime-500/10 text-white hover:bg-lime-500/5">
                                            <td className="p-4">{task.title || "Unnamed Task"}</td>
                                            <td className="p-4">{String(task.start_time)}</td>
                                            <td className="p-4">{String(task.end_time)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-lime-500 font-bold uppercase mb-4">Calculated Drink Sessions</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {planner?.planner?.drink_sessions?.map((session: any, idx: number) => (
                                    <div key={idx} className="border-2 border-lime-500 p-4 rounded-lg flex justify-between items-center bg-lime-500/5">
                                        <div>
                                            <p className="text-xs text-lime-500/50">SESSION #{idx + 1}</p>
                                            <p className="text-white font-mono text-lg">{session.time}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lime-500 font-bold">{session.amount || "1 unit"}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="flex justify-center pt-8">
                            <Link to="/history" className="px-8 py-3 border-2 border-lime-500 text-lime-500 font-bold rounded-lg hover:bg-lime-500 hover:text-black transition-colors">
                                Back to History
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PlanerDetails() {
    return (
        <ProtectedRoute requireAuth={true} >
            <PlannerDetailsPage />
        </ProtectedRoute>
    )
}