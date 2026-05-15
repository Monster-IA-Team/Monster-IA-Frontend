import { Link, Outlet, useLocation } from "react-router";
import { useAuth, ProtectedRoute } from "../../contexts/AuthContext";

export default function AdminLayout() {
  const { logout } = useAuth();
  const location = useLocation();

  return (
      <ProtectedRoute requireAuth={true} allowedRoles={["admin"]}>
        <div
            className="min-h-screen flex flex-col items-center py-12 px-4 relative overflow-x-hidden"
            style={{
              backgroundColor: "#1a1a1a",
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,.03) 2px, rgba(255,255,255,.03) 4px)`,
            }}
        >
          <div className="absolute top-6 right-6 flex gap-4">
            <button
                onClick={logout}
                className="w-10 h-10 border-2 border-red-500 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors text-lg font-bold"
            >⏻</button>
          </div>

          <div className="absolute top-6 left-6">
            <Link to="/" className="px-4 h-10 border-2 border-red-500 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors text-sm font-bold">
              HOME
            </Link>
          </div>

          <div className="w-full max-w-5xl space-y-8 mt-10">
            <header className="text-center border-b-2 border-red-500/30 pb-6">
              <p className="text-red-500 font-mono text-sm tracking-widest mb-2 animate-pulse">WARNING: HIGH PRIVILEGE ACCESS</p>
              <h1 className="text-4xl text-white italic uppercase tracking-tighter">
                Admin <span className="text-red-500">Core</span>
              </h1>
            </header>

            {/* Menu nawigacyjne panelu (Zakładki) */}
            <nav className="flex justify-center gap-4 border-b border-red-500/20 pb-4">
              <Link
                  to="/admin"
                  className={`px-6 py-2 font-mono text-xs border ${location.pathname === "/admin" ? "bg-red-500 text-black border-red-500" : "text-red-500 border-red-500/50 hover:bg-red-500/10"}`}
              >DASHBOARD</Link>
              <Link
                  to="/admin/users"
                  className={`px-6 py-2 font-mono text-xs border ${location.pathname === "/admin/users" ? "bg-red-500 text-black border-red-500" : "text-red-500 border-red-500/50 hover:bg-red-500/10"}`}
              >USER_LIST</Link>
            </nav>

            <main className="mt-8">
              <Outlet />
            </main>
          </div>
        </div>
      </ProtectedRoute>
  );
}