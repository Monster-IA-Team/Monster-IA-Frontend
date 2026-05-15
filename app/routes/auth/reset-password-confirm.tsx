import { useState, type FormEvent } from "react";
import { Link, useNavigate, type Route } from "react-router";
import { authAPI } from "../../services/auth";
import { ProtectedRoute } from "../../contexts/AuthContext";


export function meta({}: Route.MetaArgs) {
    return [
        { title: "Reset Password" },
        { name: "description", content: "Enter token and set new password" },
    ];
}

function ResetPasswordConfirmPage() {
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const validatePassword = (pass: string): string | null => {
        if (pass.length < 8) {
            return "Password must be at least 8 characters long";
        }
        if (!/[A-Z]/.test(pass)) {
            return "Password must contain at least one uppercase letter";
        }
        if (!/\d/.test(pass)) {
            return "Password must contain at least one digit";
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) {
            return "Password must contain at least one special character";
        }
        return null;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!token.trim()) {
            setError("Please provide a reset token");
            return;
        }

        const validationError = validatePassword(password);
        if (validationError) {
            setError(validationError);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await authAPI.confirmResetPassword({
                token,
                password,
                confirm_password: confirmPassword
            });

            if (!response.is_success) {
                throw new Error(response.message || "Failed to reset password");
            }

            setSuccess(true);
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to reset password";
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
            <div className="absolute top-6 right-6 flex gap-4">
                <button className="w-10 h-10 border-2 border-lime-500 rounded-lg flex items-center justify-center text-lime-500 hover:bg-lime-500 hover:text-black transition-colors text-lg font-bold">?</button>
                <button className="w-10 h-10 border-2 border-lime-500 rounded-lg flex items-center justify-center text-lime-500 hover:bg-lime-500 hover:text-black transition-colors text-lg font-bold">i</button>
            </div>

            <div className="absolute top-6 left-6">
                <Link
                    to="/"
                    className="w-10 h-10 border-2 border-lime-500 rounded-lg flex items-center justify-center text-lime-500 hover:bg-lime-500 hover:text-black transition-colors text-lg font-bold"
                >
                    ⌂
                </Link>
            </div>

            <div className="w-full max-w-sm">
                <h1 className="text-3xl text-white text-center mb-8" style={{ fontStyle: "italic" }}>
                    Reset Password
                </h1>

                <p className="text-lime-500 text-center mb-8">
                    Enter the token you received and your new password
                </p>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {error && (
                        <div className="border-2 border-red-500 bg-red-900/20 p-3 rounded-lg">
                            <p className="text-red-400 text-sm font-mono">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="border-2 border-lime-500 bg-lime-900/20 p-3 rounded-lg">
                            <p className="text-lime-400 text-sm font-mono">Password reset successfully! Redirecting...</p>
                        </div>
                    )}

                    <input
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Reset Token"
                        required
                        className="w-full px-4 py-3 bg-transparent border-2 border-lime-500 text-white placeholder-lime-500/50 focus:outline-none focus:bg-lime-500/10 transition-colors rounded-lg text-center font-mono"
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New Password"
                        required
                        className="w-full px-4 py-3 bg-transparent border-2 border-lime-500 text-white placeholder-lime-500/50 focus:outline-none focus:bg-lime-500/10 transition-colors rounded-lg"
                    />

                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm New Password"
                        required
                        className="w-full px-4 py-3 bg-transparent border-2 border-lime-500 text-white placeholder-lime-500/50 focus:outline-none focus:bg-lime-500/10 transition-colors rounded-lg"
                    />

                    <div className="flex gap-4 justify-center pt-6">
                        <button
                            type="submit"
                            disabled={loading || success}
                            className="px-8 py-3 border-2 border-lime-500 text-lime-500 font-bold rounded-lg hover:bg-lime-500 hover:text-black transition-colors disabled:opacity-50"
                        >
                            {loading ? "..." : "Reset Password"}
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

export default function ResetPasswordConfirm() {
    return (
        <ProtectedRoute requireGuest={true}>
            <ResetPasswordConfirmPage />
        </ProtectedRoute>
    );
}