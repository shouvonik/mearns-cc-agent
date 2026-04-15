"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { PLAYERS, type Player } from "@/lib/players";
import { FIXTURES_2026, type Fixture } from "@/lib/fixtures-2026";

// ── Date formatting (deterministic UTC — avoids SSR/client locale mismatch) ─

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function fmtDayMon(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00Z");
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

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
  return `${fmtDayMon(f.date)} – vs ${f.opponent} (${f.homeAway}, ${f.competition})`;
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

// Batting-order weights — defined once at module level, never recreated
const BATTING_ORDER: Record<string, number> = { Batter: 0, "All-rounder": 2, Bowler: 3 };

// ── Team Sheet Canvas ──────────────────────────────────────────────────────

/**
 * Renders the 1080×1080 template PNG with match details and player list
 * overlaid at the correct pixel positions using the HTML5 Canvas API.
 *
 * Coordinate reference (all values in template pixels, 1080×1080):
 *  - Header (dark blue):  y 0–215
 *  - Match title:         centre x ~660, y ~90  (bold ~64px)
 *  - Venue / date:        centre x ~660, y ~165 (22px)
 *  - Middle section:      y 215–865
 *  - League name:         rotated −90°, centre x ~75, y ~540
 *  - Player list start:   x 215, y 272, spacing 57px (bold ~34px)
 *  - Footer:              y 865–1080
 */
function useTeamSheetCanvas(
  xi: Player[],
  captainId: string,
  wkId: string,
  fixture: Fixture | null,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = "/template_team_sheet.png";
    img.onload = () => {
      canvas.width = img.naturalWidth;   // 1080
      canvas.height = img.naturalHeight; // 1080

      // 1. Draw template
      ctx.drawImage(img, 0, 0);

      // 2. Match title
      const opponent = fixture?.opponent ?? "TBC";
      ctx.save();
      ctx.font = "bold 62px Arial, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`Mearns vs ${opponent}`, 658, 90);
      ctx.restore();

      // 3. Venue / date / time
      if (fixture) {
        const sub = [fixture.venue, fmtDayMon(fixture.date), fixture.startTime].filter(Boolean).join("  |  ");
        ctx.save();
        ctx.font = "22px Arial, sans-serif";
        ctx.fillStyle = "#e0e8ff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(sub, 658, 167);
        ctx.restore();
      }

      // 4. League name (vertical, rotated −90°)
      if (fixture?.competition) {
        ctx.save();
        ctx.translate(78, 540);
        ctx.rotate(-Math.PI / 2);
        ctx.font = "bold 36px Arial, sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(fixture.competition, 0, 0);
        ctx.restore();
      }

      // 5. Player list
      ctx.save();
      ctx.font = "bold 34px Arial, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      xi.forEach((p, i) => {
        const tags: string[] = [];
        if (p.id === captainId) tags.push("(C)");
        if (p.id === wkId) tags.push("(WK)");
        const displayName = p.preferredName + " " + p.name.split(" ").slice(1).join(" ");
        const line = `${i + 1}. ${displayName}${tags.length ? " " + tags.join(" ") : ""}`;
        ctx.fillText(line, 270, 272 + i * 57);
      });
      ctx.restore();

      // Export to data URL so any tab can display it via <img>
      setDataUrl(canvas.toDataURL("image/png"));
    };
  }, [xi, captainId, wkId, fixture]);

  return { canvasRef, dataUrl };
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
  const [tab, setTab] = useState<"lineup" | "image" | "post">("lineup");

  // ── Team Sheet image ──
  const { canvasRef, dataUrl } = useTeamSheetCanvas(xi, captainId, wkId, fixture);
  const downloadImage = () => {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.download = "mearns-cc-team-sheet.png";
    link.href = dataUrl;
    link.click();
  };

  // ── Post Preview ──
  type Platform = "facebook" | "instagram" | "twitter";
  const [caption, setCaption] = useState("");
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState<Platform | null>(null);
  const [publishResult, setPublishResult] = useState<Record<Platform, string | null>>({
    facebook: null, instagram: null, twitter: null,
  });

  const generate = async () => {
    setGenerating(true);
    setGenerateError(null);
    try {
      const res = await fetch("/api/team/announce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xi, captainId, wicketkeeperId: wkId, fixture }),
      });
      const data = await res.json();
      if (res.ok) setCaption(data.caption ?? "");
      else setGenerateError(data.error ?? "Generation failed");
    } catch {
      setGenerateError("Could not reach server");
    } finally {
      setGenerating(false);
    }
  };

  const publish = async (platform: Platform) => {
    setPublishing(platform);
    setPublishResult((r) => ({ ...r, [platform]: null }));
    try {
      const endpoints: Record<Platform, string> = {
        facebook: "/api/publish/facebook",
        instagram: "/api/publish/instagram",
        twitter: "/api/publish/twitter",
      };
      const bodies: Record<Platform, object> = {
        facebook: { message: caption },
        instagram: { caption, imageUrls: [] },
        twitter: { text: caption },
      };
      const res = await fetch(endpoints[platform], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodies[platform]),
      });
      const data = await res.json();
      setPublishResult((r) => ({
        ...r,
        [platform]: res.ok ? "Posted!" : (data.error ?? "Failed"),
      }));
    } catch {
      setPublishResult((r) => ({ ...r, [platform]: "Failed" }));
    } finally {
      setPublishing(null);
    }
  };

  return (
    <div className="bg-slate-800 rounded-2xl border border-green-500/40 overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-3 pb-0 border-b border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold text-sm">Suggested XI</h3>
          <span className="text-[10px] text-slate-500">{xi.length} players</span>
        </div>
        <div className="flex gap-0">
          {(["lineup", "image", "post"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                tab === t
                  ? "border-green-500 text-green-400"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {t === "lineup" ? "Lineup" : t === "image" ? "Team Sheet" : "Post"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Lineup tab ── */}
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
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border flex-shrink-0 ${ROLE_COLORS[p.role]}`}>
                    {p.role === "All-rounder" ? "AR" : p.role[0]}
                  </span>
                  <button
                    onClick={() => onSetCaptain(p.id)}
                    title="Set as Captain"
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-colors flex-shrink-0 ${
                      isC
                        ? "bg-yellow-500 text-slate-900 border-yellow-400"
                        : "bg-slate-700 text-slate-500 border-slate-600 hover:border-yellow-500/50 hover:text-yellow-400"
                    }`}
                  >C</button>
                  <button
                    onClick={() => onSetWK(p.id)}
                    title="Set as Wicketkeeper"
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold border transition-colors flex-shrink-0 ${
                      isWK
                        ? "bg-amber-500 text-slate-900 border-amber-400"
                        : "bg-slate-700 text-slate-500 border-slate-600 hover:border-amber-500/50 hover:text-amber-400"
                    }`}
                  >WK</button>
                  <button
                    onClick={() => onRemove(p)}
                    title="Remove from XI"
                    className="w-7 h-7 rounded-full flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0 text-base"
                  >×</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hidden canvas — always mounted so useEffect can paint it */}
      <canvas ref={canvasRef} className="hidden" />

      {/* ── Team Sheet image tab ── */}
      <div className={tab === "image" ? "p-4 space-y-3" : "hidden"}>
        {dataUrl
          /* eslint-disable-next-line @next/next/no-img-element */
          ? <img src={dataUrl} alt="Team sheet" className="w-full rounded-xl border border-slate-700" />
          : <div className="w-full aspect-square bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-center text-slate-600 text-xs">Generating…</div>
        }
        <button
          onClick={downloadImage}
          disabled={!dataUrl}
          className="w-full py-2.5 rounded-xl text-sm font-semibold bg-green-600 hover:bg-green-500 text-white transition-colors disabled:opacity-40"
        >
          Download PNG
        </button>
      </div>

      {/* ── Post Preview tab ── */}
      {tab === "post" && (
        <div className="p-4 space-y-3">
          {/* Team sheet image preview — shared data URL from the hidden canvas */}
          {dataUrl
            ? /* eslint-disable-next-line @next/next/no-img-element */
              <img src={dataUrl} alt="Team sheet" className="w-full rounded-xl border border-slate-700" />
            : <div className="w-full aspect-square bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-center text-slate-600 text-xs">Loading image…</div>
          }

          {/* One-line caption */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Caption</span>
              <button
                onClick={generate}
                disabled={generating}
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                  generating
                    ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white"
                }`}
              >
                {generating ? "Generating…" : "Generate with AI"}
              </button>
            </div>
            {generateError && (
              <p className="text-[10px] text-red-400">{generateError}</p>
            )}
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption for your post…"
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-300 text-xs font-sans leading-relaxed resize-none focus:outline-none focus:border-green-500 placeholder:text-slate-600"
            />
          </div>

          {/* Publish buttons */}
          <div className="grid grid-cols-3 gap-2">
            {(["facebook", "instagram", "twitter"] as Platform[]).map((p) => {
              const labels: Record<Platform, string> = { facebook: "Facebook", instagram: "Instagram", twitter: "X" };
              const colors: Record<Platform, string> = {
                facebook: "bg-blue-600 hover:bg-blue-500",
                instagram: "bg-pink-600 hover:bg-pink-500",
                twitter: "bg-slate-600 hover:bg-slate-500",
              };
              const result = publishResult[p];
              return (
                <div key={p} className="flex flex-col gap-1">
                  <button
                    onClick={() => publish(p)}
                    disabled={publishing === p || !caption.trim()}
                    className={`py-2 rounded-xl text-xs font-semibold text-white transition-colors ${
                      publishing === p || !caption.trim()
                        ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                        : colors[p]
                    }`}
                  >
                    {publishing === p ? "…" : labels[p]}
                  </button>
                  {result && (
                    <p className={`text-[10px] text-center font-semibold ${result === "Posted!" ? "text-green-400" : "text-red-400"}`}>
                      {result}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
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
      const sorted = [...(data.xi as Player[])].sort((a, b) => {
        const aOrder = a.isWicketkeeper ? 1 : (BATTING_ORDER[a.role] ?? 2);
        const bOrder = b.isWicketkeeper ? 1 : (BATTING_ORDER[b.role] ?? 2);
        return aOrder - bOrder;
      });
      setXI(sorted);
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
