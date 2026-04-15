"use client";

import Link from "next/link";
import type { PlayHQGame } from "@/lib/playhq";
import { formatScore, getMearnsResult } from "@/lib/playhq";

interface MatchCardProps {
  game: PlayHQGame;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function fmtDate(iso: string) {
  const d = new Date(iso);
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

const resultColors: Record<string, string> = {
  won:       "bg-green-500/20 text-green-400 border border-green-500/30",
  lost:      "bg-red-500/20 text-red-400 border border-red-500/30",
  draw:      "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  no_result: "bg-white/10 text-blue-200/60 border border-white/10",
  unknown:   "bg-[#111d50] text-[#8fa8d8]",
};

const resultLabels: Record<string, string> = {
  won: "Won", lost: "Lost", draw: "Draw", no_result: "No Result", unknown: "",
};

export default function MatchCard({ game }: MatchCardProps) {
  const isUpcoming = game.status === "upcoming";
  const result = isUpcoming ? "unknown" : getMearnsResult(game);

  const isMearnsHome = game.homeTeam.name.toLowerCase().includes("mearns");
  const mearnsTeam   = isMearnsHome ? game.homeTeam : game.awayTeam;
  const opponentTeam = isMearnsHome ? game.awayTeam : game.homeTeam;

  return (
    <Link href={`/matches/${game.id}`}>
      <div className="bg-[#111d50] rounded-xl p-4 border border-[#1e2f70] active:scale-[0.98] transition-transform">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#8fa8d8] mb-0.5">{game.grade?.name ?? "Friendly"}</p>
            <p className="text-xs text-[#8fa8d8]/60">{fmtDate(game.startTime)}</p>
          </div>
          {isUpcoming ? (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-400/20 text-yellow-400 border border-yellow-400/30">
              Upcoming
            </span>
          ) : result !== "unknown" ? (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${resultColors[result]}`}>
              {resultLabels[result]}
            </span>
          ) : null}
        </div>

        {/* Teams + scores */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold text-sm truncate flex-1 mr-2">{mearnsTeam.name}</span>
            <span className="text-white font-mono text-sm whitespace-nowrap">
              {formatScore(mearnsTeam.score, mearnsTeam.wickets, mearnsTeam.overs)}
            </span>
          </div>
          <div className="border-t border-[#1e2f70]" />
          <div className="flex items-center justify-between">
            <span className="text-[#8fa8d8] text-sm truncate flex-1 mr-2">{opponentTeam.name}</span>
            <span className="text-[#8fa8d8] font-mono text-sm whitespace-nowrap">
              {formatScore(opponentTeam.score, opponentTeam.wickets, opponentTeam.overs)}
            </span>
          </div>
        </div>

        {game.resultDescription && (
          <p className="text-xs text-[#8fa8d8] mt-3 truncate">{game.resultDescription}</p>
        )}
        {game.venue && (
          <p className="text-xs text-[#8fa8d8]/50 mt-1 truncate">{game.venue.name}</p>
        )}

        <div className="flex items-center justify-end mt-3">
          <span className={`text-xs font-medium ${isUpcoming ? "text-yellow-400" : "text-green-400"}`}>
            {isUpcoming ? "View fixture →" : "Create post →"}
          </span>
        </div>
      </div>
    </Link>
  );
}
