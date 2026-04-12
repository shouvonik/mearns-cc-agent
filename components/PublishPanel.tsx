"use client";

import { useState } from "react";
import PostPreview from "./PostPreview";
import type { Platform } from "./SummaryEditor";

type PublishStatus = "idle" | "publishing" | "success" | "error";

interface PlatformState {
  enabled: boolean;
  status: PublishStatus;
  resultUrl?: string;
  error?: string;
}

interface PublishPanelProps {
  summaries: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  photoUrls: string[];
}

const PLATFORM_META: Record<
  Platform,
  {
    label: string;
    handle: string;
    requiresPhoto: boolean;
    apiPath: string;
    bodyKey: string;
    envKey: string;
    color: string;
  }
> = {
  facebook: {
    label: "Facebook",
    handle: "Mearns Cricket Club",
    requiresPhoto: false,
    apiPath: "/api/publish/facebook",
    bodyKey: "message",
    envKey: "FACEBOOK_PAGE_ACCESS_TOKEN",
    color: "text-blue-400",
  },
  instagram: {
    label: "Instagram",
    handle: "@mearnscc",
    requiresPhoto: true,
    apiPath: "/api/publish/instagram",
    bodyKey: "caption",
    envKey: "INSTAGRAM_ACCOUNT_ID",
    color: "text-pink-400",
  },
  twitter: {
    label: "Twitter / X",
    handle: "@MearnsCC",
    requiresPhoto: false,
    apiPath: "/api/publish/twitter",
    bodyKey: "text",
    envKey: "TWITTER_API_KEY",
    color: "text-sky-400",
  },
};

export default function PublishPanel({ summaries, photoUrls }: PublishPanelProps) {
  const [activePlatform, setActivePlatform] = useState<Platform>("facebook");
  const [showPreview, setShowPreview] = useState(false);

  const [platforms, setPlatforms] = useState<Record<Platform, PlatformState>>({
    facebook: { enabled: true, status: "idle" },
    instagram: { enabled: photoUrls.length > 0, status: "idle" },
    twitter: { enabled: true, status: "idle" },
  });

  // Detect if we're in mock/demo mode (no credentials)
  // We use a convention: the publish API returns {mock: true} when credentials absent.
  // For UX we always show the preview, and show a "Configure credentials" message on publish.
  const isPublishing = Object.values(platforms).some((p) => p.status === "publishing");

  function togglePlatform(platform: Platform) {
    const meta = PLATFORM_META[platform];
    if (meta.requiresPhoto && photoUrls.length === 0) return;

    setPlatforms((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        enabled: !prev[platform].enabled,
        status: "idle",
        resultUrl: undefined,
        error: undefined,
      },
    }));
  }

  async function publishToPlatform(platform: Platform) {
    const meta = PLATFORM_META[platform];
    const text = summaries[platform];

    setPlatforms((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], status: "publishing", error: undefined },
    }));

    try {
      const body: Record<string, unknown> = { [meta.bodyKey]: text };
      if (photoUrls.length > 0) {
        body.photoUrls = photoUrls;
        body.imageUrls = photoUrls;
      }

      const res = await fetch(meta.apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Publish failed");

      setPlatforms((prev) => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          status: "success",
          resultUrl: data.postUrl ?? data.url,
        },
      }));
    } catch (e) {
      setPlatforms((prev) => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          status: "error",
          error: e instanceof Error ? e.message : "Unknown error",
        },
      }));
    }
  }

  async function publishAll() {
    const toPublish = (Object.keys(platforms) as Platform[]).filter(
      (p) => platforms[p].enabled && platforms[p].status === "idle"
    );
    await Promise.all(toPublish.map(publishToPlatform));
  }

  // ── Preview modal ──────────────────────────────────────────────────────
  if (showPreview) {
    return (
      <div>
        {/* Preview header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowPreview(false)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <p className="text-xs text-slate-400">
            Preview — {PLATFORM_META[activePlatform].label}
          </p>
          <div className="w-12" />
        </div>

        {/* Platform tabs */}
        <div className="flex gap-1.5 mb-4">
          {(Object.keys(PLATFORM_META) as Platform[]).map((p) => (
            <button
              key={p}
              onClick={() => setActivePlatform(p)}
              className={`flex-1 text-xs py-2 rounded-lg font-medium transition-colors ${
                activePlatform === p
                  ? "bg-slate-700 text-white"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {PLATFORM_META[p].label}
            </button>
          ))}
        </div>

        {/* Preview card */}
        <PostPreview
          platform={activePlatform}
          text={summaries[activePlatform]}
          photoUrls={photoUrls}
        />

        <p className="text-center text-xs text-slate-500 mt-4">
          This is how your post will appear. Edit in the Summaries step.
        </p>
      </div>
    );
  }

  // ── Publish controls ───────────────────────────────────────────────────
  return (
    <div className="space-y-3">
      {/* Preview button — prominent */}
      <button
        onClick={() => setShowPreview(true)}
        className="w-full py-3.5 border border-green-500/50 text-green-400 font-semibold rounded-xl text-sm hover:bg-green-500/10 transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Preview Posts
      </button>

      {/* Platform toggles + individual publish */}
      {(Object.keys(PLATFORM_META) as Platform[]).map((platform) => {
        const meta = PLATFORM_META[platform];
        const state = platforms[platform];
        const noPhoto = meta.requiresPhoto && photoUrls.length === 0;
        const text = summaries[platform];
        const isEmpty = !text.trim();

        return (
          <div
            key={platform}
            className={`rounded-xl border p-4 transition-colors ${
              state.enabled && !noPhoto
                ? "border-slate-600 bg-slate-800"
                : "border-slate-700 bg-slate-800/40"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Toggle */}
              <button
                onClick={() => togglePlatform(platform)}
                disabled={noPhoto || isPublishing}
                className="flex-shrink-0 disabled:opacity-40"
              >
                <div
                  className={`w-10 h-6 rounded-full transition-colors relative ${
                    state.enabled && !noPhoto ? "bg-green-600" : "bg-slate-600"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      state.enabled && !noPhoto ? "translate-x-4" : ""
                    }`}
                  />
                </div>
              </button>

              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${state.enabled ? "text-white" : "text-slate-500"}`}>
                  {meta.label}
                </p>
                <p className="text-xs text-slate-500">{meta.handle}</p>
              </div>

              {/* Status / publish button */}
              <div className="flex-shrink-0">
                {state.status === "idle" && state.enabled && !noPhoto && (
                  <button
                    onClick={() => {
                      setActivePlatform(platform);
                      publishToPlatform(platform);
                    }}
                    disabled={isPublishing || isEmpty}
                    className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-lg disabled:opacity-40 transition-colors"
                  >
                    Post
                  </button>
                )}
                {state.status === "publishing" && (
                  <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                )}
                {state.status === "success" && (
                  <span className="text-green-400 text-xs font-semibold">Posted ✓</span>
                )}
                {state.status === "error" && (
                  <button
                    onClick={() => publishToPlatform(platform)}
                    className="text-xs text-red-400 underline"
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            {noPhoto && (
              <p className="text-xs text-slate-500 mt-2">
                Select at least one photo to enable Instagram.
              </p>
            )}
            {state.error && (
              <p className="text-xs text-red-400 mt-2">{state.error}</p>
            )}
            {state.resultUrl && (
              <a
                href={state.resultUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-400 underline mt-2 block"
              >
                View post
              </a>
            )}
          </div>
        );
      })}

      {/* Publish all */}
      <button
        onClick={publishAll}
        disabled={
          isPublishing ||
          (Object.keys(platforms) as Platform[]).every(
            (p) => !platforms[p].enabled || platforms[p].status !== "idle"
          )
        }
        className="w-full py-3.5 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm"
      >
        {isPublishing ? "Publishing…" : "Publish All Selected"}
      </button>

      <p className="text-center text-xs text-slate-500 pt-1">
        Publishing requires social media credentials in <code className="bg-slate-800 px-1 rounded">.env.local</code>
      </p>
    </div>
  );
}
