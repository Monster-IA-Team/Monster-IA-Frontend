import { useState, type FormEvent } from "react";
import { Link, type Route } from "react-router";
import { authAPI } from "../api/auth";
import { ProtectedRoute } from "../context/AuthContext";
import type { RegisterRequest } from "../api/types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Register" },
    { name: "description", content: "Create a new account" },
  ];
}

function RegisterPage() {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: "",
    username: "",
    password: "",
    confirm_password: "",
    is_prefers_sugar_free: false,
    is_prefers_sweet: false,
    is_prefers_sour: false,
    is_prefers_moderate: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field?: keyof RegisterRequest
  ) => {
    const fieldName = field || e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.register(formData);

      if (!response.is_success) {
        throw new Error(response.message || "Registration failed");
      }

      setSuccess(true);
      setTimeout(() => window.location.href = "/login", 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
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
          Create Account
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="border-2 border-red-500 bg-red-900/20 p-3 rounded-lg">
              <p className="text-red-400 text-sm font-mono">{error}</p>
            </div>
          )}

          {success && (
            <div className="border-2 border-lime-500 bg-lime-900/20 p-3 rounded-lg">
              <p className="text-lime-400 text-sm font-mono">Registration successful! Redirecting to login...</p>
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <input
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 bg-transparent border-2 border-lime-500 text-white placeholder-lime-500/50 focus:outline-none focus:bg-lime-500/10 transition-colors rounded-lg"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              name="username"
              type="text"
              required
              className="w-full px-4 py-3 bg-transparent border-2 border-lime-500 text-white placeholder-lime-500/50 focus:outline-none focus:bg-lime-500/10 transition-colors rounded-lg"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <input
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 bg-transparent border-2 border-lime-500 text-white placeholder-lime-500/50 focus:outline-none focus:bg-lime-500/10 transition-colors rounded-lg"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <input
              name="confirm_password"
              type="password"
              required
              className="w-full px-4 py-3 bg-transparent border-2 border-lime-500 text-white placeholder-lime-500/50 focus:outline-none focus:bg-lime-500/10 transition-colors rounded-lg"
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={handleChange}
            />
          </div>

          {/* Taste Preferences */}
          <div className="border-t-2 border-lime-500/30 pt-6">
            <p className="text-lime-500 text-sm font-bold mb-4">Taste Preferences</p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_prefers_sugar_free}
                  onChange={(e) => handleChange(e, "is_prefers_sugar_free")}
                  className="w-5 h-5 accent-lime-500 cursor-pointer"
                />
                <span className="text-lime-500 text-sm">Sugar Free</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_prefers_sweet}
                  onChange={(e) => handleChange(e, "is_prefers_sweet")}
                  className="w-5 h-5 accent-lime-500 cursor-pointer"
                />
                <span className="text-lime-500 text-sm">Sweet</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_prefers_sour}
                  onChange={(e) => handleChange(e, "is_prefers_sour")}
                  className="w-5 h-5 accent-lime-500 cursor-pointer"
                />
                <span className="text-lime-500 text-sm">Sour</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_prefers_moderate}
                  onChange={(e) => handleChange(e, "is_prefers_moderate")}
                  className="w-5 h-5 accent-lime-500 cursor-pointer"
                />
                <span className="text-lime-500 text-sm">Moderate</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-center pt-6">
            <button
              type="submit"
              disabled={loading || success}
              className="px-8 py-3 border-2 border-lime-500 text-lime-500 font-bold rounded-lg hover:bg-lime-500 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "..." : "Register"}
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

export default function Register() {
  return (
    <ProtectedRoute requireAuth={false}>
      <RegisterPage />
    </ProtectedRoute>
  );
}
