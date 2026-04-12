"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import ScoreCard from "@/components/ScoreCard";
import PhotoPicker from "@/components/PhotoPicker";
import SummaryEditor, { type Platform } from "@/components/SummaryEditor";
import PublishPanel from "@/components/PublishPanel";
import type { PlayHQGameSummary } from "@/lib/playhq";
import type { GooglePhoto } from "@/lib/google-photos";
import { buildPhotoUrl } from "@/lib/google-photos";

type Step = "scorecard" | "photos" | "summaries" | "publish";

const STEPS: { id: Step; label: string }[] = [
  { id: "scorecard", label: "Scorecard" },
  { id: "photos", label: "Photos" },
  { id: "summaries", label: "Summaries" },
  { id: "publish", label: "Publish" },
];

export default function MatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [step, setStep] = useState<Step>("scorecard");
  const [gameSummary, setGameSummary] = useState<PlayHQGameSummary | null>(null);
  const [loadingMatch, setLoadingMatch] = useState(true);
  const [matchError, setMatchError] = useState<string | null>(null);

  const [selectedPhotos, setSelectedPhotos] = useState<GooglePhoto[]>([]);

  const [summaries, setSummaries] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
  });
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [extraContext, setExtraContext] = useState("");

  // Load match
  useEffect(() => {
    async function load() {
      setLoadingMatch(true);
      setMatchError(null);
      try {
        const res = await fetch(`/api/playhq/match/${id}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? "Failed to load match");
        }
        setGameSummary(await res.json());
      } catch (e) {
        setMatchError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoadingMatch(false);
      }
    }
    load();
  }, [id]);

  const generateSummaries = useCallback(async () => {
    setGeneratingSummary(true);
    setSummaryError(null);
    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: id, extraContext }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to generate summary");
      }
      const data = await res.json();
      setSummaries(data.summaries);
    } catch (e) {
      setSummaryError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setGeneratingSummary(false);
    }
  }, [id, extraContext]);

  // Auto-generate when landing on summaries tab (if not already done)
  useEffect(() => {
    if (step === "summaries" && !summaries.facebook && !generatingSummary) {
      generateSummaries();
    }
  }, [step, summaries.facebook, generatingSummary, generateSummaries]);

  const photoUrls = selectedPhotos.map((p) => buildPhotoUrl(p.baseUrl, 1080, 1080));
  const currentStepIndex = STEPS.findIndex((s) => s.id === step);

  function goNext() {
    const next = STEPS[currentStepIndex + 1];
    if (next) setStep(next.id);
  }

  function goPrev() {
    const prev = STEPS[currentStepIndex - 1];
    if (prev) setStep(prev.id);
    else router.back();
  }

  return (
    <div className="flex flex-col min-h-dvh">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4">
        <div className="max-w-lg mx-auto py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={goPrev}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white -ml-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">
                {gameSummary
                  ? `${gameSummary.game.homeTeam.name} vs ${gameSummary.game.awayTeam.name}`
                  : "Match Detail"}
              </p>
              {gameSummary?.game.grade && (
                <p className="text-slate-400 text-xs truncate">
                  {gameSummary.game.grade.name}
                </p>
              )}
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-1 mt-3 pb-1">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => {
                  // Allow tapping steps freely (but require match to be loaded)
                  if (!loadingMatch) setStep(s.id);
                }}
                className={`flex-1 text-center text-[10px] font-semibold py-1.5 rounded-full transition-colors ${
                  s.id === step
                    ? "bg-green-600 text-white"
                    : i < currentStepIndex
                    ? "bg-slate-700 text-slate-300"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 pb-28">
        <div className="max-w-lg mx-auto pt-4">
          {loadingMatch ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-400 text-sm">Loading match data…</p>
            </div>
          ) : matchError ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
              <p className="text-red-400 text-sm">{matchError}</p>
            </div>
          ) : (
            <>
              {/* STEP: Scorecard */}
              {step === "scorecard" && gameSummary && (
                <ScoreCard summary={gameSummary} />
              )}

              {/* STEP: Photos */}
              {step === "photos" && (
                <div>
                  <h2 className="text-white font-semibold mb-1">
                    Select Match Photos
                  </h2>
                  <p className="text-slate-400 text-xs mb-4">
                    Choose photos from the club Google Photos album to attach to your posts.
                    Instagram requires at least 1.
                  </p>
                  <PhotoPicker
                    selectedPhotoIds={selectedPhotos.map((p) => p.id)}
                    onChange={setSelectedPhotos}
                    maxPhotos={10}
                  />
                </div>
              )}

              {/* STEP: Summaries */}
              {step === "summaries" && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-white font-semibold">Post Summaries</h2>
                    <button
                      onClick={generateSummaries}
                      disabled={generatingSummary}
                      className="text-xs text-green-400 border border-green-500/40 px-3 py-1.5 rounded-lg disabled:opacity-50 hover:bg-green-500/10 transition-colors"
                    >
                      {generatingSummary ? "Generating…" : "Regenerate"}
                    </button>
                  </div>

                  {/* Extra context */}
                  <div className="mb-4">
                    <textarea
                      value={extraContext}
                      onChange={(e) => setExtraContext(e.target.value)}
                      placeholder="Add context (e.g. 'Great team effort despite tough conditions') — optional"
                      rows={2}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-green-500 resize-none"
                    />
                  </div>

                  {generatingSummary ? (
                    <div className="flex flex-col items-center py-12 gap-3">
                      <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                      <p className="text-slate-400 text-sm">
                        Claude is writing your match summary…
                      </p>
                    </div>
                  ) : summaryError ? (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
                      <p className="text-red-400 text-sm">{summaryError}</p>
                      <button
                        onClick={generateSummaries}
                        className="text-xs text-red-400 underline mt-2"
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    <SummaryEditor
                      summaries={summaries}
                      onChange={(platform: Platform, text: string) =>
                        setSummaries((prev) => ({ ...prev, [platform]: text }))
                      }
                    />
                  )}
                </div>
              )}

              {/* STEP: Publish */}
              {step === "publish" && (
                <div>
                  <h2 className="text-white font-semibold mb-1">Publish</h2>
                  <p className="text-slate-400 text-xs mb-4">
                    Review and post to your social media accounts.
                    {selectedPhotos.length === 0 &&
                      " No photos selected — Instagram will be disabled."}
                  </p>
                  <PublishPanel summaries={summaries} photoUrls={photoUrls} />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Bottom navigation */}
      {!loadingMatch && !matchError && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 px-4 pb-safe-bottom">
          <div className="max-w-lg mx-auto py-3 flex gap-3">
            {currentStepIndex > 0 && (
              <button
                onClick={goPrev}
                className="flex-1 py-3 border border-slate-700 rounded-xl text-slate-300 font-semibold text-sm hover:border-slate-500 transition-colors"
              >
                Back
              </button>
            )}
            {currentStepIndex < STEPS.length - 1 && (
              <button
                onClick={goNext}
                className="flex-1 py-3 bg-green-600 hover:bg-green-500 rounded-xl text-white font-semibold text-sm transition-colors"
              >
                {step === "photos"
                  ? selectedPhotos.length > 0
                    ? `Next (${selectedPhotos.length} photo${selectedPhotos.length !== 1 ? "s" : ""})`
                    : "Next (skip photos)"
                  : "Next"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
