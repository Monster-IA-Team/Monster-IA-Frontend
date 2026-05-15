import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, type Route } from "react-router";
import { authAPI } from "../../services/auth";
import { ProtectedRoute } from "../../contexts/AuthContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Activating Account" },
    { name: "description", content: "Activating your account" },
  ];
}

function ActivatePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Activating account...");

  useEffect(() => {
    const activateAccount = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("No activation token found");
        setTimeout(() => navigate("/login"), 3000);
        return;
      }

      try {
        const response = await authAPI.activate(token);

        if (!response.is_success) {
          throw new Error(response.message || "Activation failed");
        }

        setStatus("success");
        setMessage("Account activated! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } catch (err) {
        setStatus("error");
        const errorMessage = err instanceof Error ? err.message : "Activation failed";
        setMessage(errorMessage);
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    activateAccount();
  }, [searchParams, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
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
      <div className="text-center">
        <h1 className="text-4xl text-lime-500 font-bold mb-4">
          {status === "loading" && "⏳"}
          {status === "success" && "✓"}
          {status === "error" && "✗"}
        </h1>
        <p
          className={`text-xl font-mono ${
            status === "error" ? "text-red-400" : "text-lime-500"
          }`}
        >
          {message}
        </p>
      </div>
    </div>
  );
}

export default function Activate() {
  return (
      <ProtectedRoute requireGuest={true}>
        <ActivatePage />
      </ProtectedRoute>
  );
}