"use client";

import type { PlayHQGameSummary, PlayHQInning } from "@/lib/playhq";

interface ScoreCardProps {
  summary: PlayHQGameSummary;
}

function InningTable({ inning }: { inning: PlayHQInning }) {
  return (
    <div className="mb-6">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-white font-semibold text-sm">{inning.battingTeam}</h3>
        <span className="text-green-400 font-mono font-bold">
          {inning.totalRuns}/{inning.totalWickets}
          <span className="text-slate-400 font-normal text-xs ml-1">
            ({inning.totalOvers} ov)
          </span>
        </span>
      </div>

      {/* Batting */}
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        Batting
      </p>
      <div className="space-y-1 mb-4">
        {inning.batters.map((b) => (
          <div
            key={b.name}
            className="flex items-start justify-between text-xs"
          >
            <div className="flex-1 min-w-0 mr-2">
              <span className="text-slate-200">{b.name}</span>
              {b.dismissal && (
                <span className="text-slate-500 ml-1 truncate block text-[10px]">
                  {b.dismissal}
                </span>
              )}
            </div>
            <div className="text-right whitespace-nowrap text-slate-300 font-mono">
              <span className="font-semibold text-white">{b.runs}</span>
              <span className="text-slate-500"> ({b.balls})</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bowling */}
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        Bowling
      </p>
      <div className="space-y-1">
        <div className="flex text-[10px] text-slate-500 uppercase tracking-wider mb-1">
          <span className="flex-1">Bowler</span>
          <span className="w-6 text-center">O</span>
          <span className="w-6 text-center">M</span>
          <span className="w-6 text-center">R</span>
          <span className="w-6 text-center">W</span>
          <span className="w-10 text-right">Econ</span>
        </div>
        {inning.bowlers.map((bwl) => (
          <div
            key={bwl.name}
            className="flex items-center text-xs font-mono"
          >
            <span className="flex-1 text-slate-200 font-sans truncate mr-1">
              {bwl.name}
            </span>
            <span className="w-6 text-center text-slate-300">{bwl.overs}</span>
            <span className="w-6 text-center text-slate-300">{bwl.maidens}</span>
            <span className="w-6 text-center text-slate-300">{bwl.runs}</span>
            <span className="w-6 text-center font-semibold text-white">
              {bwl.wickets}
            </span>
            <span className="w-10 text-right text-slate-400">
              {bwl.economy.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ScoreCard({ summary }: ScoreCardProps) {
  const { game, innings } = summary;

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      {/* Match header */}
      <div className="bg-slate-900 p-4 border-b border-slate-700">
        <p className="text-xs text-slate-400 mb-0.5">
          {game.grade?.name ?? "Match"}
        </p>
        <p className="text-white font-semibold">
          {game.homeTeam.name} vs {game.awayTeam.name}
        </p>
        {game.venue && (
          <p className="text-xs text-slate-400 mt-1">{game.venue.name}</p>
        )}
        <p className="text-xs text-slate-500 mt-0.5">
          {new Date(game.startTime).toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        {game.resultDescription && (
          <p className="text-sm text-green-400 font-medium mt-2">
            {game.resultDescription}
          </p>
        )}
      </div>

      {/* Innings */}
      <div className="p-4">
        {innings.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-4">
            Scorecard not yet available
          </p>
        ) : (
          innings.map((inning, i) => (
            <div key={i}>
              {i > 0 && <div className="border-t border-slate-700 mb-6" />}
              <InningTable inning={inning} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
