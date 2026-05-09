import type { Route } from "./+types/home";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "description", content: "Welcome to Monster IA" },
  ];
}

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
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
      {/* Logout button (top right) */}
      {isAuthenticated && (
        <div className="absolute top-6 right-6 flex gap-4">
          <button
            onClick={logout}
            className="w-10 h-10 border-2 border-lime-500 rounded-lg flex items-center justify-center text-lime-500 hover:bg-lime-500 hover:text-black transition-colors text-lg font-bold"
            title="Logout"
          >
            ⏻
          </button>
          <button className="w-10 h-10 border-2 border-lime-500 rounded-lg flex items-center justify-center text-lime-500 hover:bg-lime-500 hover:text-black transition-colors text-lg font-bold">
            i
          </button>
        </div>
      )}

      {/* Home button (top left) */}
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="w-10 h-10 border-2 border-lime-500 rounded-lg flex items-center justify-center text-lime-500 hover:bg-lime-500 hover:text-black transition-colors text-lg font-bold"
          title="Home"
        >
          ⌂
        </Link>
      </div>

      <div className="w-full max-w-2xl">
        {/* User info */}
        {isAuthenticated && (
          <div className="text-center mb-12">
            <p className="text-lime-500 text-lg">Welcome, <span className="font-bold">{user?.username}</span></p>
          </div>
        )}

        {/* Top Section - Can Checker & Taste Quiz */}
        <div className="mb-16">
          <div className="flex gap-6 justify-center flex-wrap">
            <Link
              to="/can-checker"
              className="px-12 py-6 border-2 border-lime-500 text-lime-500 font-bold text-lg rounded-lg hover:bg-lime-500 hover:text-black transition-colors"
            >
              CAN CHECKER
            </Link>
            <Link
              to="/taste-quiz"
              className="px-12 py-6 border-2 border-lime-500 text-lime-500 font-bold text-lg rounded-lg hover:bg-lime-500 hover:text-black transition-colors"
            >
              Taste Quiz
            </Link>
          </div>
        </div>

        {/* Middle Section - Login/Register or "For More" */}
        {!isAuthenticated && (
          <div className="mb-16 border-t-2 border-b-2 border-lime-500/30 py-12 text-center">
            <p className="text-lime-500 mb-6 text-lg">For more login</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/login"
                className="px-8 py-3 border-2 border-lime-500 text-lime-500 font-bold rounded-lg hover:bg-lime-500 hover:text-black transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-8 py-3 border-2 border-lime-500 text-lime-500 font-bold rounded-lg hover:bg-lime-500 hover:text-black transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        )}

        {isAuthenticated && (
          <div className="mb-16 border-t-2 border-b-2 border-lime-500/30 py-8"></div>
        )}

        {/* Bottom Section - Planer & Lista */}
        <div className="flex gap-6 justify-center flex-wrap">
          <Link
            to="/planer"
            className="px-12 py-6 border-2 border-lime-500 text-lime-500 font-bold text-lg rounded-lg hover:bg-lime-500 hover:text-black transition-colors"
          >
            PLANER
          </Link>
          <Link
            to="/lista"
            className="px-12 py-6 border-2 border-lime-500 text-lime-500 font-bold text-lg rounded-lg hover:bg-lime-500 hover:text-black transition-colors"
          >
            LISTA
          </Link>
        </div>
      </div>
    </div>
  );
}
