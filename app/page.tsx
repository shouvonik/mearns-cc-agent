"use client";

import { useState, useEffect, useCallback } from "react";
import MatchCard from "@/components/MatchCard";
import type { PlayHQGame } from "@/lib/playhq";

type FilterStatus = "all" | "upcoming" | "won" | "lost";

export default function HomePage() {
  const [games, setGames] = useState<PlayHQGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("all");

  const loadGames = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/playhq/matches");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to load matches");
      }
      const data: { games: PlayHQGame[] } = await res.json();
      setGames(data.games);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  // Sort: upcoming first (soonest first), then completed newest-first
  const sortedGames = [...games].sort((a, b) => {
    if (a.status === "upcoming" && b.status !== "upcoming") return -1;
    if (a.status !== "upcoming" && b.status === "upcoming") return 1;
    if (a.status === "upcoming") return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
  });

  const filteredGames = sortedGames.filter((g) => {
    if (filter === "upcoming") return g.status === "upcoming";
    if (filter === "all") return g.status !== "upcoming";
    const desc = (g.resultDescription ?? "").toLowerCase();
    const mearns = "mearns cricket club";
    if (filter === "won")
      return (
        g.status === "completed" &&
        desc.includes(mearns) &&
        (desc.includes("won") || desc.includes("win"))
      );
    if (filter === "lost")
      return (
        g.status === "completed" &&
        (!desc.includes(mearns) ||
          (!desc.includes("won") && !desc.includes("win")))
      );
    return true;
  });

  return (
    <div className="flex flex-col min-h-dvh">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4">
        <div className="max-w-lg mx-auto py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">MC</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-base leading-tight">
                Mearns CC
              </h1>
              <p className="text-slate-400 text-xs">Match Summary Publisher</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 pb-8">
        <div className="max-w-lg mx-auto">
          {/* Filter tabs */}
          {!loading && !error && games.length > 0 && (
            <div className="flex gap-2 py-4">
              {(["upcoming", "all", "won", "lost"] as FilterStatus[]).map((f) => {
                const labels: Record<FilterStatus, string> = {
                  upcoming: "Upcoming",
                  all: "Results",
                  won: "Wins",
                  lost: "Losses",
                };
                const activeColor = f === "upcoming" ? "bg-blue-600 text-white" : "bg-green-600 text-white";
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                      filter === f
                        ? activeColor
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {labels[f]}
                  </button>
                );
              })}
              <span className="ml-auto text-xs text-slate-500 self-center">
                {filteredGames.length} match{filteredGames.length !== 1 ? "es" : ""}
              </span>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-400 text-sm">Loading matches…</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="py-12 text-center">
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-4">
                <p className="text-red-400 text-sm font-medium mb-1">
                  Failed to load matches
                </p>
                <p className="text-red-400/70 text-xs">{error}</p>
              </div>
              <button
                onClick={loadGames}
                className="text-sm text-green-400 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filteredGames.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-slate-400 text-sm">No matches found.</p>
            </div>
          )}

          {/* Match list */}
          {!loading && !error && filteredGames.length > 0 && (
            <div className="space-y-3 pb-4">
              {filteredGames.map((game) => (
                <MatchCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
