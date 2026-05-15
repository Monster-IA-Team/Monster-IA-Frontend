import { Link, type Route } from "react-router";
import { useAuth, ProtectedRoute } from "../../contexts/AuthContext";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "User Dashboard" },
        { name: "description", content: "Your personal Monster IA command center" },
    ];
}

function UserDashboardPage() {
    const { user, logout } = useAuth();

    return (
        <div
            className="min-h-screen flex flex-col items-center py-12 px-4 relative overflow-x-hidden"
            style={{
                backgroundColor: "#1a1a1a",
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,.03) 2px, rgba(255,255,255,.03) 4px)`,
            }}
        >
            {/* Top Bar */}
            <div className="absolute top-6 right-6 flex gap-4">
                <button
                    onClick={logout}
                    className="w-10 h-10 border-2 border-red-500 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors text-lg font-bold"
                    title="Logout"
                >
                    ⏻
                </button>
            </div>

            <div className="w-full max-w-4xl space-y-12 mt-10">
                <header className="text-center border-b-2 border-lime-500/30 pb-8">
                    <p className="text-lime-500/50 font-mono text-sm tracking-widest mb-2">SYSTEM STATUS: ONLINE</p>
                    <h1 className="text-4xl text-white italic">
                        Welcome, <span className="text-lime-500">{user?.username}</span>
                    </h1>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* AI & Cans Section */}
                    <div className="border-2 border-lime-500/30 bg-black/40 rounded-lg p-6">
                        <h2 className="text-lime-500 font-bold uppercase mb-4 tracking-widest border-b border-lime-500/20 pb-2">
                            ▤ CAN MANAGEMENT
                        </h2>
                        <div className="space-y-4">
                            <Link to="/can-checker" className="block w-full px-6 py-4 border-2 border-lime-500 text-lime-500 font-bold rounded-lg hover:bg-lime-500 hover:text-black transition-colors">
                                SCAN NEW CAN (AI Predict)
                            </Link>
                            <Link to="/list" className="block w-full px-6 py-4 border-2 border-lime-500/50 text-lime-500/80 font-bold rounded-lg hover:border-lime-500 hover:text-lime-500 transition-colors">
                                MY MONSTER COLLECTION
                            </Link>
                        </div>
                    </div>

                    {/* Planner Section */}
                    <div className="border-2 border-lime-500/30 bg-black/40 rounded-lg p-6">
                        <h2 className="text-lime-500 font-bold uppercase mb-4 tracking-widest border-b border-lime-500/20 pb-2">
                            ◷ SCHEDULE PLANNER
                        </h2>
                        <div className="space-y-4">
                            <Link to="/planer" className="block w-full px-6 py-4 border-2 border-lime-500 bg-lime-500 text-black font-bold rounded-lg hover:bg-lime-400 transition-colors">
                                GENERATE NEW SCHEDULE
                            </Link>
                            <Link to="/planners" className="block w-full px-6 py-4 border-2 border-lime-500/50 text-lime-500/80 font-bold rounded-lg hover:border-lime-500 hover:text-lime-500 transition-colors">
                                VIEW HISTORY LOGS
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function UserDashboard() {
    return (
        <ProtectedRoute requireAuth={true}>
            <UserDashboardPage />
        </ProtectedRoute>
    );
}