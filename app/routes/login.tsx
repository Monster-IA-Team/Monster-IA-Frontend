import { useState, type FormEvent } from "react";
import { Link, useNavigate, type Route } from "react-router";
import { useAuth, ProtectedRoute } from "../contexts/AuthContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login" },
    { name: "description", content: "Login to your account" },
  ];
}

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, error } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/");
    } catch {
      // Error is handled by context
    } finally {
      setLoading(false);
    }
  };

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
      {/* Home button */}
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="w-10 h-10 border-2 border-lime-500 rounded-lg flex items-center justify-center text-lime-500 hover:bg-lime-500 hover:text-black transition-colors text-lg font-bold"
          title="Home"
        >
          ⌂
        </Link>
      </div>

      {/* Corner info buttons */}
      <div className="absolute top-6 right-6 flex gap-4">
        <button className="w-10 h-10 border-2 border-lime-500 rounded-lg flex items-center justify-center text-lime-500 hover:bg-lime-500 hover:text-black transition-colors text-lg font-bold">
          ?
        </button>
        <button className="w-10 h-10 border-2 border-lime-500 rounded-lg flex items-center justify-center text-lime-500 hover:bg-lime-500 hover:text-black transition-colors text-lg font-bold">
          i
        </button>
      </div>

      <div className="w-full max-w-sm">
        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="border-2 border-red-500 bg-red-900/20 p-3 rounded-lg">
              <p className="text-red-400 text-sm font-mono">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-3 bg-transparent border-2 border-lime-500 text-white placeholder-lime-500/50 focus:outline-none focus:bg-lime-500/10 transition-colors rounded-lg"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 bg-transparent border-2 border-lime-500 text-white placeholder-lime-500/50 focus:outline-none focus:bg-lime-500/10 transition-colors rounded-lg"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-center pt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-lime-500 text-black font-bold rounded-lg hover:bg-lime-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-lime-500"
            >
              {loading ? "..." : "Login"}
            </button>
            <Link
              to="/"
              className="px-8 py-3 border-2 border-lime-500 text-lime-500 font-bold rounded-lg hover:bg-lime-500 hover:text-black transition-colors text-center"
            >
              About
            </Link>
          </div>

          {/* Register section */}
          <div className="pt-8 border-t-2 border-lime-500/30 mt-8">
            <p className="text-lime-500 mb-4">Not logged in? Register here</p>
            <Link
              to="/register"
              className="w-full block px-8 py-3 border-2 border-lime-500 text-lime-500 font-bold rounded-lg hover:bg-lime-500 hover:text-black transition-colors text-center"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <ProtectedRoute requireAuth={false}>
      <LoginPage />
    </ProtectedRoute>
  );
}
