import { useState, useEffect } from "react";
import { Link, type Route } from "react-router";
import { monstersAPI } from "../services/monsters";
import { ProtectedRoute } from "../contexts/AuthContext";
import type { Monster } from "../services/types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Can Checker" },
    { name: "description", content: "Check Monster drinks you've tried" },
  ];
}

function CanCheckerPage() {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const loadMonsters = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await monstersAPI.list({
        page,
        size: 12,
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      if (!response.is_success) {
        throw new Error(response.message || "Failed to load monsters");
      }

      setMonsters(response.data.items);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load monsters";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMonsters();
  }, [page, sortBy, sortOrder]);

  const [localRatings, setLocalRatings] = useState<Record<string, number>>({});

  const handleMarkDrunk = async (monsterId: string, isDrunk: boolean) => {
    if (isDrunk) return;

    try {
      await monstersAPI.markDrunk(monsterId);
      await loadMonsters();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to mark as drunk";
      setError(message);
    }
  };

  const handleRate = async (monsterId: string, rating: number) => {
    const monster = monsters.find((m) => m.id === monsterId);
    if (!monster) return;

    try {
      await monstersAPI.interact({
        monster_id: monsterId,
        rating,
        is_drunk: monster.is_drunk_by_user,
      });
      await loadMonsters();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to rate";
      setError(message);
    }
  };

  return (
    <div
      className="min-h-screen px-4 py-8 relative overflow-hidden"
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

      {/* Corner info button */}
      <div className="absolute top-6 right-6">
        <button className="w-10 h-10 border-2 border-lime-500 rounded-lg flex items-center justify-center text-lime-500 hover:bg-lime-500 hover:text-black transition-colors text-lg font-bold">
          i
        </button>
      </div>

      <div className="max-w-7xl mx-auto mt-12">
        {/* Title */}
        <h1 className="text-4xl text-lime-500 text-center mb-8 font-bold">
          CAN CHECKER
        </h1>

        {/* Filters */}
        <div className="bg-black/40 border-2 border-lime-500/30 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-lime-500 text-sm mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2 bg-transparent border-2 border-lime-500 text-lime-500 rounded-lg focus:outline-none focus:bg-lime-500/10"
              >
                <option value="name">Name</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            <div>
              <label className="block text-lime-500 text-sm mb-2">Order</label>
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value as "asc" | "desc");
                  setPage(1);
                }}
                className="w-full px-4 py-2 bg-transparent border-2 border-lime-500 text-lime-500 rounded-lg focus:outline-none focus:bg-lime-500/10"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => loadMonsters()}
                className="w-full px-4 py-2 bg-lime-500 text-black font-bold rounded-lg hover:bg-lime-400 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="border-2 border-red-500 bg-red-900/20 p-4 rounded-lg mb-8">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-lime-500 text-lg">Loading monsters...</p>
          </div>
        )}

        {/* Monsters Grid */}
        {!loading && monsters.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {monsters.map((monster) => (
                <div
                  key={monster.id}
                  className="border-2 border-lime-500 rounded-lg p-4 hover:bg-lime-500/10 transition-colors"
                >
                  {/* Image */}
                  <div className="mb-4 aspect-square bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg overflow-hidden flex items-center justify-center">
                    {monster.image_url ? (
                      <img
                        src={monster.image_url}
                        alt={monster.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-center px-2">{monster.name}</span>
                    )}
                  </div>

                  {/* Info */}
                  <h3 className="text-lime-500 font-bold text-lg mb-2">
                    {monster.name}
                  </h3>

                  <p className="text-lime-500/70 text-sm mb-3 line-clamp-2">
                    {monster.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lime-500 text-sm">
                      ⭐ {monster.average_rating.toFixed(1)}
                    </span>
                  </div>

                  {/* User Rating */}
                  {monster.is_drunk_by_user && (
                    <div className="mb-4">
                      <label className="block text-lime-500 text-xs mb-2">Your Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRate(monster.id, star)}
                            className={`text-xl transition-colors ${
                              Math.round(monster.average_rating) >= star
                                ? "text-lime-500"
                                : "text-lime-500/30 hover:text-lime-500"
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {!monster.is_drunk_by_user && (
                    <div className="mb-4 text-lime-500/50 text-xs">
                      Mark as drunk to rate
                    </div>
                  )}

                  {/* Mark as drunk button */}
                  <button
                    onClick={() =>
                      handleMarkDrunk(monster.id, monster.is_drunk_by_user)
                    }
                    disabled={monster.is_drunk_by_user}
                    className={`w-full py-2 rounded-lg font-bold transition-colors ${
                      monster.is_drunk_by_user
                        ? "bg-lime-500 text-black cursor-default"
                        : "border-2 border-lime-500 text-lime-500 hover:bg-lime-500 hover:text-black"
                    }`}
                  >
                    {monster.is_drunk_by_user ? "✓ DRUNK" : "Mark Drunk"}
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mb-8">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-6 py-2 border-2 border-lime-500 text-lime-500 font-bold rounded-lg hover:bg-lime-500 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>

                <span className="text-lime-500 font-bold">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-6 py-2 border-2 border-lime-500 text-lime-500 font-bold rounded-lg hover:bg-lime-500 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}

        {/* No results */}
        {!loading && monsters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lime-500 text-lg">No monsters found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CanChecker() {
  return (
    <ProtectedRoute requireAuth={true}>
      <CanCheckerPage />
    </ProtectedRoute>
  );
}
