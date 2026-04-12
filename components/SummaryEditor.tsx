"use client";

import { useState } from "react";

export type Platform = "facebook" | "instagram" | "twitter";

interface Summaries {
  facebook: string;
  instagram: string;
  twitter: string;
}

interface SummaryEditorProps {
  summaries: Summaries;
  onChange: (platform: Platform, text: string) => void;
}

const PLATFORM_CONFIG: Record<
  Platform,
  { label: string; color: string; maxLength: number; icon: string }
> = {
  facebook: {
    label: "Facebook",
    color: "text-blue-400",
    maxLength: 63206,
    icon: "f",
  },
  instagram: {
    label: "Instagram",
    color: "text-pink-400",
    maxLength: 2200,
    icon: "ig",
  },
  twitter: {
    label: "Twitter / X",
    color: "text-sky-400",
    maxLength: 280,
    icon: "𝕏",
  },
};

export default function SummaryEditor({
  summaries,
  onChange,
}: SummaryEditorProps) {
  const [active, setActive] = useState<Platform>("facebook");
  const config = PLATFORM_CONFIG[active];
  const text = summaries[active];
  const remaining = config.maxLength - text.length;

  return (
    <div>
      {/* Platform tabs */}
      <div className="flex gap-2 mb-4">
        {(Object.keys(PLATFORM_CONFIG) as Platform[]).map((platform) => {
          const cfg = PLATFORM_CONFIG[platform];
          const isActive = platform === active;
          return (
            <button
              key={platform}
              onClick={() => setActive(platform)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                isActive
                  ? "bg-slate-700 text-white border border-slate-600"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Editor */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => onChange(active, e.target.value)}
          rows={active === "twitter" ? 4 : 10}
          className={`w-full bg-slate-900 text-slate-100 rounded-xl p-4 text-sm border resize-none focus:outline-none focus:ring-1 focus:ring-green-500 ${
            remaining < 0
              ? "border-red-500"
              : "border-slate-700"
          }`}
          placeholder={`${config.label} post…`}
        />
        <div className="absolute bottom-3 right-3">
          <span
            className={`text-xs font-mono ${
              remaining < 0
                ? "text-red-400"
                : remaining < 20
                ? "text-yellow-400"
                : "text-slate-500"
            }`}
          >
            {remaining}
          </span>
        </div>
      </div>

      {remaining < 0 && (
        <p className="text-xs text-red-400 mt-1">
          Post exceeds {config.label} character limit by {Math.abs(remaining)} characters.
        </p>
      )}
    </div>
  );
}
