"use client";

import { useState, useMemo, useCallback } from "react";
import { PLAYERS, type Player } from "@/lib/players";
import { FIXTURES_2026, type Fixture } from "@/lib/fixtures-2026";

// ── Constants ──────────────────────────────────────────────────────────────

const ROLE_COLORS: Record<string, string> = {
  "Batter":      "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Bowler":      "bg-red-500/20 text-red-300 border-red-500/30",
  "All-rounder": "bg-green-500/20 text-green-300 border-green-500/30",
};

const LEVEL_LABELS: Record<number, string> = {
  1: "Elite",
  2: "Senior",
  3: "Dev",
  4: "Emerging",
};

// ── Helpers ────────────────────────────────────────────────────────────────

function formatFixtureLabel(f: Fixture): string {
  const d = new Date(f.date + "T12:00:00Z");
  const ds = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return `${ds} – vs ${f.opponent} (${f.homeAway}, ${f.competition})`;
}

function buildTeamSheetPost(
  xi: Player[],
  captainId: string,
  wkId: string,
  fixture: Fixture | null
): string {
  const header = fixture
    ? `📋 TEAM SHEET\n${formatFixtureLabel(fixture)}\n\n`
    : "📋 TEAM SHEET\n\n";

  const lines = xi.map((p, i) => {
    const tags: string[] = [];
    if (p.id === captainId) tags.push("(C)");
    if (p.id === wkId) tags.push("(WK)");
    const surname = p.name.split(" ").slice(1).join(" ");
    return `${i + 1}. ${p.preferredName} ${surname}${tags.length ? " " + tags.join(" ") : ""}`;
  });

  return header + lines.join("\n") + "\n\n🏏 Up the Mearns! #MearnsCC";
}

// ── PlayerChip ─────────────────────────────────────────────────────────────

function PlayerChip({
  player,
  available,
  inXI,
  onToggle,
}: {
  player: Player;
  available: boolean;
  inXI: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
        inXI
          ? "bg-green-600/20 border-green-500/50"
          : available
          ? "bg-slate-800 border-slate-700 active:border-green-600"
          : "bg-slate-900 border-slate-800 opacity-50"
      }`}
    >
      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
        inXI ? "bg-green-400" : available ? "bg-slate-400" : "bg-slate-700"
      }`} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-white text-sm font-medium truncate">{player.name}</span>
          {player.isWicketkeeper && (
            <span className="text-amber-400 text-[10px] font-bold flex-shrink-0">WK</span>
          )}
          {player.isCaptain && (
            <span className="text-yellow-300 text-[10px] font-bold flex-shrink-0">★C</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${ROLE_COLORS[player.role]}`}>
            {player.role}
          </span>
          <span className="text-slate-500 text-[10px]">
            Bat {player.battingRating} · Bowl {player.bowlingRating}
          </span>
        </div>
      </div>

      <span className="text-[10px] text-slate-600 flex-shrink-0">
        {LEVEL_LABELS[player.teamLevel] ?? `L${player.teamLevel}`}
      </span>
    </button>
  );
}

// ── XICard ─────────────────────────────────────────────────────────────────

function XICard({
  xi,
  captainId,
  wkId,
  fixture,
  onSetCaptain,
  onSetWK,
  onRemove,
}: {
  xi: Player[];
  captainId: string;
  wkId: string;
  fixture: Fixture | null;
  onSetCaptain: (id: string) => void;
  onSetWK: (id: string) => void;
  onRemove: (player: Player) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"lineup" | "post">("lineup");

  const post = buildTeamSheetPost(xi, captainId, wkId, fixture);

  const copy = () => {
    navigator.clipboard.writeText(post).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-slate-800 rounded-2xl border border-green-500/40 overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-3 pb-0 border-b border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold text-sm">Suggested XI</h3>
          <span className="text-[10px] text-slate-500">
            {xi.length} players
          </span>
        </div>
        <div className="flex gap-0">
          {(["lineup", "post"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors capitalize ${
                tab === t
                  ? "border-green-500 text-green-400"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {t === "lineup" ? "Lineup" : "Post Preview"}
            </button>
          ))}
        </div>
      </div>

      {tab === "lineup" && (
        <div>
          <div className="px-4 py-2 bg-slate-900/50 flex gap-4 text-[10px] text-slate-500 font-semibold">
            <span className="flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 flex items-center justify-center font-bold">C</span>
              Tap to set Captain
            </span>
            <span className="flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold text-[9px]">WK</span>
              Tap to set Keeper
            </span>
          </div>
          <div className="divide-y divide-slate-700/50">
            {xi.map((p, i) => {
              const isC = p.id === captainId;
              const isWK = p.id === wkId;
              return (
                <div key={p.id} className="flex items-center gap-2 px-4 py-2.5">
                  <span className="text-slate-500 text-xs w-4 flex-shrink-0">{i + 1}.</span>

                  <span className="text-white text-sm flex-1 truncate min-w-0">{p.name}</span>

                  {/* Role badge */}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border flex-shrink-0 ${ROLE_COLORS[p.role]}`}>
                    {p.role === "All-rounder" ? "AR" : p.role[0]}
                  </span>

                  {/* Captain toggle */}
                  <button
                    onClick={() => onSetCaptain(p.id)}
                    title="Set as Captain"
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-colors flex-shrink-0 ${
                      isC
                        ? "bg-yellow-500 text-slate-900 border-yellow-400"
                        : "bg-slate-700 text-slate-500 border-slate-600 hover:border-yellow-500/50 hover:text-yellow-400"
                    }`}
                  >
                    C
                  </button>

                  {/* WK toggle */}
                  <button
                    onClick={() => onSetWK(p.id)}
                    title="Set as Wicketkeeper"
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold border transition-colors flex-shrink-0 ${
                      isWK
                        ? "bg-amber-500 text-slate-900 border-amber-400"
                        : "bg-slate-700 text-slate-500 border-slate-600 hover:border-amber-500/50 hover:text-amber-400"
                    }`}
                  >
                    WK
                  </button>

                  {/* Remove */}
                  <button
                    onClick={() => onRemove(p)}
                    title="Remove from XI"
                    className="w-7 h-7 rounded-full flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0 text-base"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "post" && (
        <div className="p-4">
          <pre className="text-slate-300 text-xs whitespace-pre-wrap font-sans leading-relaxed bg-slate-900 rounded-xl p-4 mb-3">
            {post}
          </pre>
          <button
            onClick={copy}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              copied
                ? "bg-green-700 text-green-100"
                : "bg-green-600 hover:bg-green-500 text-white"
            }`}
          >
            {copied ? "Copied!" : "Copy Team Sheet"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function TeamPage() {
  const upcomingFixtures = useMemo(
    () => FIXTURES_2026.filter((f) => f.status === "upcoming").slice(0, 10),
    []
  );

  const [selectedFixtureId, setSelectedFixtureId] = useState<string>("none");
  const [availableIds, setAvailableIds] = useState<Set<string>>(new Set());
  const [levelFilter, setLevelFilter] = useState<number | "all">("all");
  const [roleFilter, setRoleFilter] = useState<"all" | "Batter" | "Bowler" | "All-rounder">("all");

  // XI state
  const [xi, setXI] = useState<Player[] | null>(null);
  const [captainId, setCaptainId] = useState<string>("");
  const [wkId, setWkId] = useState<string>("");
  const [suggesting, setSuggesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedFixture =
    upcomingFixtures.find((f) => f.id === selectedFixtureId) ?? null;

  const activePlayers = useMemo(
    () => PLAYERS.filter((p) => p.status === "Active"),
    []
  );

  const filteredPlayers = useMemo(() => {
    return activePlayers.filter((p) => {
      if (levelFilter !== "all" && p.teamLevel !== levelFilter) return false;
      if (roleFilter !== "all" && p.role !== roleFilter) return false;
      return true;
    });
  }, [activePlayers, levelFilter, roleFilter]);

  const xiIds = useMemo(() => new Set((xi ?? []).map((p) => p.id)), [xi]);

  const toggleAvailable = useCallback((id: string) => {
    setAvailableIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    setXI(null);
    setError(null);
  }, []);

  const selectAll = () => {
    setAvailableIds(new Set(filteredPlayers.map((p) => p.id)));
    setXI(null);
  };
  const clearAll = () => {
    setAvailableIds(new Set());
    setXI(null);
  };

  const suggest = async () => {
    setSuggesting(true);
    setError(null);
    try {
      const res = await fetch("/api/team/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availableIds: Array.from(availableIds) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Suggestion failed");
      setXI(data.xi);
      setCaptainId(data.captain?.id ?? "");
      setWkId(data.wicketkeeper?.id ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSuggesting(false);
    }
  };

  const removeFromXI = useCallback((player: Player) => {
    setXI((prev) => (prev ? prev.filter((p) => p.id !== player.id) : null));
  }, []);

  const canSuggest = availableIds.size >= 11 && !suggesting;

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
              <h1 className="text-white font-bold text-base leading-tight">Team Sheet</h1>
              <p className="text-slate-400 text-xs">Mark available · Pick Final XI · Copy post</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 pb-32">
        <div className="max-w-lg mx-auto space-y-5 pt-4">

          {/* Error banner */}
          {error && (
            <div className="bg-red-500/15 border border-red-500/40 rounded-xl p-3 flex items-start gap-2">
              <span className="text-red-400 text-lg leading-none flex-shrink-0">!</span>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* 1. Match selector */}
          <section>
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2 block">
              Match (optional)
            </label>
            <select
              value={selectedFixtureId}
              onChange={(e) => setSelectedFixtureId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-green-500"
            >
              <option value="none">– Select upcoming match –</option>
              {upcomingFixtures.map((f) => (
                <option key={f.id} value={f.id}>
                  {formatFixtureLabel(f)}
                </option>
              ))}
            </select>
          </section>

          {/* 2. Player pool */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-slate-300 text-xs font-semibold uppercase tracking-wide">
                  Player Availability
                </p>
                <p className="text-slate-500 text-xs mt-0.5">
                  {availableIds.size} marked available
                  {availableIds.size < 11 && (
                    <span className="text-amber-400 ml-1">
                      (need {11 - availableIds.size} more)
                    </span>
                  )}
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={selectAll} className="text-xs text-green-400 hover:text-green-300 font-medium">
                  All shown
                </button>
                <button onClick={clearAll} className="text-xs text-slate-500 hover:text-slate-300">
                  Clear
                </button>
              </div>
            </div>

            {/* Level filter */}
            <div className="flex gap-2 mb-2 flex-wrap">
              <button
                onClick={() => setLevelFilter("all")}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  levelFilter === "all"
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                }`}
              >
                All levels
              </button>
              {([1, 2, 3, 4] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevelFilter(levelFilter === lvl ? "all" : lvl)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    levelFilter === lvl
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                  }`}
                >
                  {LEVEL_LABELS[lvl]}
                </button>
              ))}
            </div>

            {/* Role filter */}
            <div className="flex gap-2 mb-3 flex-wrap">
              {(["all", "Batter", "Bowler", "All-rounder"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    roleFilter === role
                      ? "bg-slate-200 text-slate-900 border-slate-200"
                      : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                  }`}
                >
                  {role === "all" ? "All roles" : role}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {filteredPlayers.map((p) => (
                <PlayerChip
                  key={p.id}
                  player={p}
                  available={availableIds.has(p.id)}
                  inXI={xiIds.has(p.id)}
                  onToggle={() => toggleAvailable(p.id)}
                />
              ))}
            </div>
          </section>

          {/* 3. Suggested XI */}
          {xi && (
            <section>
              <XICard
                xi={xi}
                captainId={captainId}
                wkId={wkId}
                fixture={selectedFixture}
                onSetCaptain={setCaptainId}
                onSetWK={setWkId}
                onRemove={removeFromXI}
              />
            </section>
          )}

        </div>
      </main>

      {/* Sticky suggest button — z-30 clears BottomNav z-20 */}
      <div className="fixed bottom-16 left-0 right-0 px-4 pb-2 z-30 pointer-events-none">
        <div className="max-w-lg mx-auto pointer-events-auto">
          <button
            onClick={suggest}
            disabled={!canSuggest}
            className={`w-full py-3.5 rounded-2xl text-sm font-bold shadow-xl transition-all ${
              canSuggest
                ? "bg-green-600 hover:bg-green-500 active:bg-green-700 text-white"
                : "bg-slate-800 text-slate-600 cursor-not-allowed"
            }`}
          >
            {suggesting
              ? "Picking XI…"
              : availableIds.size < 11
              ? `Mark ${11 - availableIds.size} more player${11 - availableIds.size !== 1 ? "s" : ""} available`
              : `Pick Final XI from ${availableIds.size} available`}
          </button>
        </div>
      </div>
    </div>
  );
}
