"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import MatchCard from "@/components/MatchCard";
import AppHeader from "@/components/AppHeader";
import type { PlayHQGame } from "@/lib/playhq";
import { getMearnsResult } from "@/lib/playhq";

type FilterStatus = "upcoming" | "all" | "won" | "lost";

const STATUS_LABELS: Record<FilterStatus, string> = {
  upcoming: "Upcoming",
  all: "Results",
  won: "Wins",
  lost: "Losses",
};

export default function HomePage() {
  const [games, setGames] = useState<PlayHQGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("upcoming");
  const [competitionFilter, setCompetitionFilter] = useState<string>("all");

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

  useEffect(() => { loadGames(); }, [loadGames]);

  // Sort: upcoming soonest-first, completed newest-first
  const sortedGames = useMemo(() => [...games].sort((a, b) => {
    if (a.status === "upcoming" && b.status !== "upcoming") return -1;
    if (a.status !== "upcoming" && b.status === "upcoming") return 1;
    if (a.status === "upcoming")
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
  }), [games]);

  // Step 1: filter by status tab
  const statusFiltered = useMemo(() => sortedGames.filter((g) => {
    if (filter === "upcoming") return g.status === "upcoming";
    if (filter === "all") return g.status === "completed";
    const result = getMearnsResult(g);
    if (filter === "won") return result === "won";
    if (filter === "lost") return result === "lost";
    return false;
  }), [sortedGames, filter]);

  // Step 2: derive available competitions from the status-filtered set
  const availableCompetitions = useMemo(() => {
    const names = statusFiltered
      .map((g) => g.grade?.name)
      .filter((n): n is string => Boolean(n));
    return Array.from(new Set(names)).sort();
  }, [statusFiltered]);

  // Reset competition filter when switching status tabs (or if it's no longer available)
  useEffect(() => {
    if (competitionFilter !== "all" && !availableCompetitions.includes(competitionFilter)) {
      setCompetitionFilter("all");
    }
  }, [availableCompetitions, competitionFilter]);

  // Step 3: filter by competition
  const filteredGames = useMemo(() => {
    if (competitionFilter === "all") return statusFiltered;
    return statusFiltered.filter((g) => g.grade?.name === competitionFilter);
  }, [statusFiltered, competitionFilter]);

  const handleStatusChange = (f: FilterStatus) => {
    setFilter(f);
    setCompetitionFilter("all");
  };

  return (
    <div className="flex flex-col min-h-dvh">
      <AppHeader title="Mearns CC" subtitle="Club Assistant" />

      <main className="flex-1 px-4 pb-8">
        <div className="max-w-lg mx-auto">

          {!loading && !error && games.length > 0 && (
            <div className="pt-4 space-y-3">
              {/* Status tabs */}
              <div className="flex gap-2 items-center">
                {(["upcoming", "all", "won", "lost"] as FilterStatus[]).map((f) => {
                  return (
                    <button
                      key={f}
                      onClick={() => handleStatusChange(f)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                        filter === f
                          ? "bg-yellow-400 text-[#080f2e]"
                          : "bg-[#111d50] text-[#8fa8d8] hover:text-white border border-[#1e2f70]"
                      }`}
                    >
                      {STATUS_LABELS[f]}
                    </button>
                  );
                })}
                <span className="ml-auto text-xs text-slate-500 flex-shrink-0">
                  {filteredGames.length} match{filteredGames.length !== 1 ? "es" : ""}
                </span>
              </div>

              {/* Competition chips — only shown when multiple competitions exist */}
              {availableCompetitions.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
                  <button
                    onClick={() => setCompetitionFilter("all")}
                    className={`flex-shrink-0 px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
                      competitionFilter === "all"
                        ? "bg-yellow-400 text-[#080f2e] border-yellow-400"
                        : "bg-[#111d50] text-[#8fa8d8] border-[#1e2f70] hover:text-white"
                    }`}
                  >
                    All competitions
                  </button>
                  {availableCompetitions.map((name) => (
                    <button
                      key={name}
                      onClick={() => setCompetitionFilter(name)}
                      className={`flex-shrink-0 px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
                        competitionFilter === name
                          ? "bg-yellow-400 text-[#080f2e] border-yellow-400"
                          : "bg-[#111d50] text-[#8fa8d8] border-[#1e2f70] hover:text-white"
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
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
                <p className="text-red-400 text-sm font-medium mb-1">Failed to load matches</p>
                <p className="text-red-400/70 text-xs">{error}</p>
              </div>
              <button onClick={loadGames} className="text-sm text-green-400 underline">
                Try again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filteredGames.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-slate-400 text-sm">No matches found.</p>
              {competitionFilter !== "all" && (
                <button
                  onClick={() => setCompetitionFilter("all")}
                  className="mt-2 text-xs text-green-400 underline"
                >
                  Clear competition filter
                </button>
              )}
            </div>
          )}

          {/* Match list */}
          {!loading && !error && filteredGames.length > 0 && (
            <div className="space-y-3 pt-3 pb-4">
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
