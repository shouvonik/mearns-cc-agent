"use client";

import Link from "next/link";
import type { PlayHQGame } from "@/lib/playhq";
import { formatScore, getMearnsResult } from "@/lib/playhq";

interface MatchCardProps {
  game: PlayHQGame;
}

const resultColors: Record<string, string> = {
  won: "bg-green-500/20 text-green-400 border border-green-500/30",
  lost: "bg-red-500/20 text-red-400 border border-red-500/30",
  draw: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  no_result: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
  unknown: "bg-slate-700 text-slate-400",
};

const resultLabels: Record<string, string> = {
  won: "Won",
  lost: "Lost",
  draw: "Draw",
  no_result: "No Result",
  unknown: "",
};

export default function MatchCard({ game }: MatchCardProps) {
  const isUpcoming = game.status === "upcoming";
  const result = isUpcoming ? "unknown" : getMearnsResult(game);
  const date = new Date(game.startTime).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const isMearnsHome =
    game.homeTeam.name.toLowerCase().includes("mearns");
  const mearnsTeam = isMearnsHome ? game.homeTeam : game.awayTeam;
  const opponentTeam = isMearnsHome ? game.awayTeam : game.homeTeam;

  return (
    <Link href={`/matches/${game.id}`}>
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 active:scale-[0.98] transition-transform">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-400 mb-0.5">
              {game.grade?.name ?? "Friendly"}
            </p>
            <p className="text-xs text-slate-500">{date}</p>
          </div>
          {isUpcoming ? (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Upcoming
            </span>
          ) : result !== "unknown" ? (
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${resultColors[result]}`}
            >
              {resultLabels[result]}
            </span>
          ) : null}
        </div>

        {/* Teams + Scores */}
        <div className="space-y-2">
          {/* Mearns */}
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold text-sm truncate flex-1 mr-2">
              {mearnsTeam.name}
            </span>
            <span className="text-white font-mono text-sm whitespace-nowrap">
              {formatScore(mearnsTeam.score, mearnsTeam.wickets, mearnsTeam.overs)}
            </span>
          </div>

          <div className="border-t border-slate-700" />

          {/* Opponent */}
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-sm truncate flex-1 mr-2">
              {opponentTeam.name}
            </span>
            <span className="text-slate-300 font-mono text-sm whitespace-nowrap">
              {formatScore(opponentTeam.score, opponentTeam.wickets, opponentTeam.overs)}
            </span>
          </div>
        </div>

        {/* Result description */}
        {game.resultDescription && (
          <p className="text-xs text-slate-400 mt-3 truncate">
            {game.resultDescription}
          </p>
        )}

        {/* Venue */}
        {game.venue && (
          <p className="text-xs text-slate-600 mt-1 truncate">
            {game.venue.name}
          </p>
        )}

        {/* CTA arrow */}
        <div className="flex items-center justify-end mt-3">
          <span className={`text-xs font-medium ${isUpcoming ? "text-blue-400" : "text-green-400"}`}>
            {isUpcoming ? "View fixture →" : "Create post →"}
          </span>
        </div>
      </div>
    </Link>
  );
}
