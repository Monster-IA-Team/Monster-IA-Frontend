import { useState, useEffect } from "react";
import { Link, type Route } from "react-router";
import { ProtectedRoute } from "../../contexts/AuthContext";
import { adminAPI } from "../../services/admin";
import type { UserRes, CreateAdminRequest } from "../../services/types";
import AddAdminModal from "~/components/AddAdminModal";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Admin Panel - Users" },
        { name: "description", content: "Manage system users" },
    ];
}

function AdminUsersListPage() {
    const [users, setUsers] = useState<UserRes[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await adminAPI.getUsers(page, 10);

            if (response.is_success) {
                setUsers(response.data.items);
                setTotalPages(response.data.total_pages);
            } else {
                throw new Error(response.message || "Failed to load users");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred while fetching users");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAdmin = async (formData: CreateAdminRequest) => {
        try {
            const response = await adminAPI.createAdmin(formData);
            if (response.is_success) {
                setIsModalOpen(false);
                fetchUsers();
            } else {
                alert(response.message || "Error creating admin");
            }
        } catch (err) {
            alert("Connection error. Please try again.");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleString('pl-PL', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center border-b-2 border-red-500/30 pb-4">
                <h2 className="text-red-500 font-bold uppercase flex items-center gap-2 tracking-widest">
                    SYSTEM USERS
                </h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-lime-500 text-black font-bold rounded-lg hover:bg-lime-400 transition-colors text-xs uppercase"
                >
                    + Add Admin
                </button>
            </div>

            <div className="absolute top-6 right-6 flex gap-4">
                <button className="w-10 h-10 border-2 border-lime-500 rounded-lg flex items-center justify-center text-lime-500 hover:bg-lime-500 hover:text-black transition-colors text-lg font-bold">?</button>
                <button className="w-10 h-10 border-2 border-lime-500 rounded-lg flex items-center justify-center text-lime-500 hover:bg-lime-500 hover:text-black transition-colors text-lg font-bold">i</button>
            </div>

            <div className="absolute top-6 left-6">
                <Link to="/" className="px-4 h-10 border-2 border-lime-500 rounded-lg flex items-center justify-center text-lime-500 hover:bg-lime-500 hover:text-black transition-colors text-sm font-bold">
                    HOME
                </Link>
            </div>

            <div className="w-full max-w-5xl space-y-8">
                <header className="text-center mb-10">
                    <h1 className="text-4xl text-white mb-2 italic">User Management</h1>
                    <p className="text-lime-500 font-mono text-sm opacity-70">Admin Control Panel</p>
                </header>

                {error && (
                    <div className="border-2 border-red-500 bg-red-900/20 p-4 rounded-lg text-center mb-6">
                        <p className="text-red-400 font-mono text-sm">{error}</p>
                    </div>
                )}
                {!loading && users.map((user) => (
                    <div key={user.id} className="border-2 border-lime-500/30 bg-black/40 p-5 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-lime-500 transition-colors">
                        {/* ... zawartość karty użytkownika ... */}
                    </div>
                ))}

                <div className="flex justify-between items-center border-b-2 border-lime-500/30 pb-4">
                    <h2 className="text-lime-500 font-bold uppercase flex items-center gap-2 tracking-widest">
                        SYSTEM USERS
                    </h2>
                    <div className="text-lime-500 text-xs font-mono uppercase">
                        Page {page} of {totalPages}
                    </div>
                </div>

                {loading && users.length === 0 ? (
                    <div className="text-center py-20 text-lime-500 font-mono text-xl animate-pulse">
                        ACCESSING_DATABASE...
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-lime-500/30 rounded-lg">
                        <p className="text-white/50 font-mono">No users found.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {users.map((user) => (
                            <div key={user.id} className="border-2 border-lime-500/30 bg-black/40 p-5 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-lime-500 transition-colors">

                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-3">
                                        <p className="text-white text-lg font-bold">{user.username}</p>
                                        {user.is_active ? (
                                            <span className="bg-lime-500/20 border border-lime-500 text-lime-400 px-2 py-0.5 rounded text-xs font-mono uppercase">Active</span>
                                        ) : (
                                            <span className="bg-red-500/20 border border-red-500 text-red-400 px-2 py-0.5 rounded text-xs font-mono uppercase">Blocked</span>
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:gap-6 text-sm text-gray-400 font-mono">
                                        <span>Email: {user.email}</span>
                                        <span className="text-xs opacity-50">ID: {user.id}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 text-xs font-mono mt-2">
                                        <span className="text-lime-500/70 uppercase">Roles:</span>
                                        {user.roles.map((role) => (
                                            <span key={role} className="bg-lime-500/10 text-lime-400 px-2 py-0.5 rounded uppercase border border-lime-500/30">
                                                {role}
                                            </span>
                                        ))}
                                        <span className="ml-auto text-lime-500/50 hidden lg:block">
                                            Created: {formatDate(user.created_at)}
                                        </span>
                                    </div>
                                </div>

                                {/* Przyciski akcji - Placeholdery */}
                                <div className="flex flex-wrap w-full md:w-auto gap-2">
                                    <button
                                        className="flex-1 md:flex-none px-4 py-2 border border-blue-500 text-blue-500 text-xs font-bold rounded hover:bg-blue-500 hover:text-white transition-colors"
                                    >
                                        EDIT
                                    </button>

                                    {user.is_active ? (
                                        <button
                                            className="flex-1 md:flex-none px-4 py-2 border border-red-500 text-red-500 text-xs font-bold rounded hover:bg-red-500 hover:text-white transition-colors"
                                        >
                                            BLOCK
                                        </button>
                                    ) : (
                                        <button
                                            className="flex-1 md:flex-none px-4 py-2 border border-lime-500 text-lime-500 text-xs font-bold rounded hover:bg-lime-500 hover:text-black transition-colors"
                                        >
                                            UNBLOCK
                                        </button>
                                    )}

                                    <button
                                        className="flex-1 md:flex-none px-4 py-2 border border-yellow-500 text-yellow-500 text-xs font-bold rounded hover:bg-yellow-500 hover:text-black transition-colors"
                                    >
                                        MANAGE ROLE
                                    </button>
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

            {/* Add Admin Modal */}
            <AddAdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleCreateAdmin}
            />
        </div>
    );
}

export default function AdminUsersList() {
    return (
        <ProtectedRoute requireAuth={true} allowedRoles={["admin"]}>
            <AdminUsersListPage />
        </ProtectedRoute>
    );
}