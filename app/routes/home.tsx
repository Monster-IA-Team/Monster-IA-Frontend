import { Link, Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export function meta() {
  return [
    { title: "Monster IA - Home" },
    { name: "description", content: "Identify, track, and plan your Monster Energy experience" },
  ];
}

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth();

  // Podczas ładowania sesji zapobiegamy mruganiu strony
  if (loading) {
    return <div className="min-h-screen bg-[#1a1a1a]"></div>;
  }

  if (isAuthenticated && user) {

    const isAdmin = user.roles.some(role => role.toLowerCase() === "admin");

    if (isAdmin) {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return (
      <div
          className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
          style={{
            backgroundColor: "#1a1a1a",
            backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 2px,
          rgba(255,255,255,.03) 2px,
          rgba(255,255,255,.03) 4px
        )`,
          }}
      >
        <div className="text-center max-w-3xl z-10 space-y-8">
          <div className="space-y-4">
            <p className="text-lime-500 font-mono text-sm tracking-[0.3em] uppercase">System Initialization</p>
            <h1 className="text-6xl md:text-8xl text-white font-bold italic tracking-tighter uppercase">
              Monster <span className="text-lime-500">IA</span>
            </h1>
            <p className="text-lime-500/70 text-lg md:text-xl font-mono max-w-2xl mx-auto pt-4">
              Ultimate command center. Track your cans, analyze flavors with AI, and generate perfect drinking schedules.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link
                to="/login"
                className="px-12 py-4 bg-lime-500 text-black font-bold text-lg rounded-lg hover:bg-lime-400 transition-colors uppercase tracking-wider shadow-[0_0_15px_rgba(190,242,100,0.4)]"
            >
              Access System
            </Link>
            <Link
                to="/register"
                className="px-12 py-4 border-2 border-lime-500 text-lime-500 font-bold text-lg rounded-lg hover:bg-lime-500/10 transition-colors uppercase tracking-wider"
            >
              Create Account
            </Link>
            <Link
                to="/quiz"
                className="px-12 py-4 border-2 border-lime-500 text-lime-500 font-bold text-lg rounded-lg hover:bg-lime-500/10 transition-colors uppercase tracking-wider"
            >
              Take Quiz
            </Link>
          </div>

          <div className="pt-12 text-lime-500/40 text-xs font-mono uppercase">
            Authorization Required • V 2.4 ONLINE
          </div>
        </div>
      </div>
  );
}