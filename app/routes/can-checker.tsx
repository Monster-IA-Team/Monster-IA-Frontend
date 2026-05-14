import { Link, type Route } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Can Checker" },
    { name: "description", content: "Coming Soon" },
  ];
}

export default function CanChecker() {
  return (
    <div
      className="min-h-screen px-4 py-8 relative overflow-hidden flex items-center justify-center"
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

      <div className="text-center">
        <h1 className="text-5xl text-lime-500 font-bold mb-4">
          CAN CHECKER
        </h1>
        <p className="text-lime-500 text-xl mb-8">
          Coming Soon...
        </p>
        <Link
          to="/"
          className="px-8 py-3 border-2 border-lime-500 text-lime-500 font-bold rounded-lg hover:bg-lime-500 hover:text-black transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
