import { useState, type FormEvent } from "react";
import {Link, type Route, useNavigate} from "react-router";
import { authAPI } from "../../services/auth";
import { ProtectedRoute } from "../../contexts/AuthContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Forgot Password" },
    { name: "description", content: "Reset your password" },
  ];
}

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authAPI.resetPassword(email);

      if (!response.is_success) {
        throw new Error(response.message || "Failed to send reset email");
      }

      setSuccess(true);
      setTimeout(() => navigate("/set-new-password"), 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send reset email";
      setError(message);
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
      {/* Corner info buttons */}
      <div className="absolute top-6 right-6 flex gap-4">
        <button className="w-10 h-10 border-2 border-lime-500 rounded-lg flex items-center justify-center text-lime-500 hover:bg-lime-500 hover:text-black transition-colors text-lg font-bold">
          ?
        </button>
        <button className="w-10 h-10 border-2 border-lime-500 rounded-lg flex items-center justify-center text-lime-500 hover:bg-lime-500 hover:text-black transition-colors text-lg font-bold">
          i
        </button>
      </div>

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

      <div className="w-full max-w-sm">
        <h1 className="text-3xl text-white text-center mb-8" style={{ fontStyle: "italic" }}>
          Forgot Password
        </h1>

        <p className="text-lime-500 text-center mb-8">
          Enter your email to receive a password reset link
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="border-2 border-red-500 bg-red-900/20 p-3 rounded-lg">
              <p className="text-red-400 text-sm font-mono">{error}</p>
            </div>
          )}

          {success && (
            <div className="border-2 border-lime-500 bg-lime-900/20 p-3 rounded-lg">
              <p className="text-lime-400 text-sm font-mono">
                Reset link sent! Check your email for instructions.
              </p>
            </div>
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
            className="w-full px-4 py-3 bg-transparent border-2 border-lime-500 text-white placeholder-lime-500/50 focus:outline-none focus:bg-lime-500/10 transition-colors rounded-lg"
          />

          {/* Buttons */}
          <div className="flex gap-4 justify-center pt-6">
            <button
              type="submit"
              disabled={loading || success}
              className="px-8 py-3 border-2 border-lime-500 text-lime-500 font-bold rounded-lg hover:bg-lime-500 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "..." : "Send Reset Link"}
            </button>
            <Link
              to="/login"
              className="px-8 py-3 border-2 border-lime-500 text-lime-500 font-bold rounded-lg hover:bg-lime-500 hover:text-black transition-colors text-center"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ForgotPassword() {
  return (
      <ProtectedRoute requireGuest={true}>
        <ForgotPasswordPage />
      </ProtectedRoute>
  );
}
