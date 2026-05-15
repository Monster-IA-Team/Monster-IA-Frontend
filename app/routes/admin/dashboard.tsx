import { Link } from "react-router";

export function meta() {
    return [
        { title: "Admin Panel - Dashboard" },
        { name: "description", content: "System Administration Overview" },
    ];
}

export default function AdminDashboardPage() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
            {/* User Management */}
            <div className="border-2 border-red-500/30 bg-black/40 rounded-lg p-6">
                <h2 className="text-red-500 font-bold uppercase mb-4 tracking-widest border-b border-red-500/20 pb-2">
                    USER CONTROL
                </h2>
                <div className="space-y-4">
                    <Link
                        to="users"
                        className="block w-full px-6 py-4 border-2 border-red-500 text-red-500 font-bold rounded-lg hover:bg-red-500 hover:text-black transition-colors text-center"
                    >
                        MANAGE SYSTEM USERS
                    </Link>
                </div>
                <p className="text-gray-500 text-xs mt-4 font-mono">
                    Access user logs, modify roles, block/unblock accounts.
                </p>
            </div>

            <div className="border-2 border-red-500/30 bg-black/40 rounded-lg p-6">
                <h2 className="text-red-500 font-bold uppercase mb-4 tracking-widest border-b border-red-500/20 pb-2">
                    ⚙️ SYSTEM & ADMINS
                </h2>
                <div className="space-y-4">
                    <button className="w-full px-6 py-4 border-2 border-red-500/30 text-red-500/50 font-bold rounded-lg cursor-not-allowed">
                        MANAGE ADMIN ACCOUNTS (Coming Soon)
                    </button>
                    <button className="w-full px-6 py-4 border-2 border-red-500/30 text-red-500/50 font-bold rounded-lg cursor-not-allowed">
                        VIEW ERROR LOGS (Coming Soon)
                    </button>
                </div>
            </div>

            <div className="md:col-span-2 flex justify-center pt-8">
                <Link
                    to="/dashboard"
                    className="px-8 py-3 border border-lime-500 text-lime-500 text-sm font-mono rounded hover:bg-lime-500 hover:text-black transition-colors"
                >
                    RETURN TO STANDARD USER DASHBOARD
                </Link>
            </div>
        </div>
    );
}