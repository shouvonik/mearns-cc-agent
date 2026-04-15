"use client";

import { useState, useMemo, memo } from "react";
import { FIXTURES_2026, COMPETITION_GROUPS, type Fixture, type CompetitionGroup } from "@/lib/fixtures-2026";

type GameTypeFilter = "all" | "weekend" | "midweek";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function fmtDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00Z");
  return `${WEEKDAYS[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

const COMPETITION_COLORS: Record<string, string> = {
  "Premiership 2":    "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "Championship 2":   "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Championship 4":   "bg-sky-500/20 text-sky-300 border-sky-500/30",
  "Sunday League":    "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "CS Challenge Cup": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  "Midweek Div 1":    "bg-green-500/20 text-green-300 border-green-500/30",
  "Midweek Div 3":    "bg-teal-500/20 text-teal-300 border-teal-500/30",
  "Cup":              "bg-red-500/20 text-red-300 border-red-500/30",
  "Friendly":         "bg-slate-500/20 text-slate-300 border-slate-500/30",
};

const FixtureCard = memo(function FixtureCard({ fixture }: { fixture: Fixture }) {
  const color = COMPETITION_COLORS[fixture.competitionGroup] ?? "bg-slate-700 text-slate-300";
  const dateStr = fmtDate(fixture.date);

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
      {/* Date + competition badge */}
      <div className="flex items-start justify-between mb-2.5">
        <div>
          <p className="text-white font-semibold text-sm">{dateStr}</p>
          <p className="text-slate-500 text-xs mt-0.5">{fixture.day} · {fixture.startTime} · {fixture.overs} ov</p>
        </div>
        <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${color}`}>
          {fixture.competitionGroup === "Cup" ? fixture.competition : fixture.competitionGroup}
        </span>
      </div>

      {/* Match info */}
      <div className="flex items-center gap-2">
        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
          fixture.homeAway === "Home"
            ? "bg-green-600/30 text-green-400"
            : "bg-slate-700 text-slate-400"
        }`}>
          {fixture.homeAway}
        </span>
        <span className="text-white text-sm font-medium truncate">vs {fixture.opponent}</span>
      </div>

      <p className="text-slate-500 text-xs mt-1.5 truncate">{fixture.venue}</p>

      {fixture.remarks && (
        <p className="text-amber-400/80 text-xs mt-1.5 italic">{fixture.remarks}</p>
      )}
    </div>
  );
});

// Group fixtures by month
function groupByMonth(fixtures: Fixture[]): Map<string, Fixture[]> {
  const map = new Map<string, Fixture[]>();
  for (const f of fixtures) {
    const key = f.date.slice(0, 7); // YYYY-MM
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(f);
  }
  return map;
}

function monthLabel(key: string) {
  const [y, m] = key.split("-");
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("en-GB", {
    month: "long", year: "numeric",
  });
}

export default function SchedulePage() {
  const [gameType, setGameType] = useState<GameTypeFilter>("all");
  const [competition, setCompetition] = useState<CompetitionGroup | "all">("all");

  const filtered = useMemo(() => {
    return FIXTURES_2026.filter((f) => {
      if (gameType === "weekend" && !f.isWeekend) return false;
      if (gameType === "midweek" && f.isWeekend) return false;
      if (competition !== "all" && f.competitionGroup !== competition) return false;
      return true;
    });
  }, [gameType, competition]);

  // Only show competitions relevant to the current gameType selection
  const availableCompetitions = useMemo(() => {
    const inView = FIXTURES_2026.filter((f) => {
      if (gameType === "weekend" && !f.isWeekend) return false;
      if (gameType === "midweek" && f.isWeekend) return false;
      return true;
    });
    const groups = new Set(inView.map((f) => f.competitionGroup));
    return COMPETITION_GROUPS.filter((g) => groups.has(g));
  }, [gameType]);

  // Reset competition filter if it's no longer in the available list
  const effectiveCompetition = availableCompetitions.includes(competition as CompetitionGroup)
    ? competition
    : "all";

  const grouped = useMemo(() => groupByMonth(filtered), [filtered]);

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
              <h1 className="text-white font-bold text-base leading-tight">2026 Schedule</h1>
              <p className="text-slate-400 text-xs">{filtered.length} fixtures</p>
            </div>
          </div>

          {/* Game type filter */}
          <div className="flex gap-2 mt-3">
            {(["all", "weekend", "midweek"] as GameTypeFilter[]).map((t) => {
              const labels = { all: "All Games", weekend: "Weekend", midweek: "Midweek T20" };
              return (
                <button
                  key={t}
                  onClick={() => {
                    setGameType(t);
                    setCompetition("all");
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                    gameType === t
                      ? t === "midweek" ? "bg-amber-500 text-white" : "bg-green-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {labels[t]}
                </button>
              );
            })}
          </div>

          {/* Competition sub-filter */}
          {availableCompetitions.length > 1 && (
            <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setCompetition("all")}
                className={`flex-shrink-0 px-2.5 py-1 text-[10px] font-semibold rounded-full transition-colors ${
                  effectiveCompetition === "all"
                    ? "bg-slate-600 text-white"
                    : "bg-slate-800 text-slate-500 hover:text-slate-300"
                }`}
              >
                All
              </button>
              {availableCompetitions.map((c) => {
                const color = COMPETITION_COLORS[c] ?? "";
                const isActive = effectiveCompetition === c;
                return (
                  <button
                    key={c}
                    onClick={() => setCompetition(c)}
                    className={`flex-shrink-0 px-2.5 py-1 text-[10px] font-semibold rounded-full border transition-colors ${
                      isActive ? color : "border-slate-700 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* Fixture list grouped by month */}
      <main className="flex-1 px-4 pb-8">
        <div className="max-w-lg mx-auto pt-4">
          {filtered.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-12">No fixtures match this filter.</p>
          ) : (
            Array.from(grouped.entries()).map(([monthKey, monthFixtures]) => (
              <div key={monthKey} className="mb-6">
                <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">
                  {monthLabel(monthKey)}
                </h2>
                <div className="space-y-2.5">
                  {monthFixtures.map((f) => (
                    <FixtureCard key={f.id} fixture={f} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
