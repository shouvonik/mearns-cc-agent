"use client";

import Image from "next/image";
import type { Platform } from "./SummaryEditor";

interface PostPreviewProps {
  platform: Platform;
  text: string;
  photoUrls: string[];
}

// ── Shared avatar placeholder ──────────────────────────────────────────────
function ClubAvatar({ size = 36 }: { size?: number }) {
  return (
    <div
      className="rounded-full bg-green-700 flex items-center justify-center flex-shrink-0 text-white font-bold"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      MC
    </div>
  );
}

// ── Photo grid (shared) ────────────────────────────────────────────────────
function PhotoGrid({ urls }: { urls: string[] }) {
  if (urls.length === 0) return null;
  const shown = urls.slice(0, 4);
  const cols = shown.length === 1 ? "grid-cols-1" : "grid-cols-2";

  return (
    <div className={`grid ${cols} gap-0.5 overflow-hidden rounded-lg`}>
      {shown.map((url, i) => (
        <div
          key={i}
          className={`relative bg-slate-700 ${
            shown.length === 1 ? "aspect-video" : "aspect-square"
          } ${shown.length === 3 && i === 0 ? "row-span-2" : ""}`}
        >
          <Image
            src={url}
            alt={`Photo ${i + 1}`}
            fill
            className="object-cover"
            unoptimized
          />
          {/* Overlay for 4th photo when there are more */}
          {i === 3 && urls.length > 4 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                +{urls.length - 4}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Facebook preview ───────────────────────────────────────────────────────
function FacebookPreview({ text, photoUrls }: { text: string; photoUrls: string[] }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow text-gray-900 font-sans">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3">
        <ClubAvatar size={40} />
        <div className="flex-1">
          <p className="font-semibold text-sm leading-tight">Mearns Cricket Club</p>
          <p className="text-xs text-gray-500">Just now · 🌐</p>
        </div>
        <span className="text-gray-400 text-lg">···</span>
      </div>

      {/* Post text */}
      <div className="px-4 pb-3">
        <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
          {text || <span className="text-gray-400 italic">Your Facebook post will appear here…</span>}
        </p>
      </div>

      {/* Photos */}
      {photoUrls.length > 0 && (
        <div className="mx-0">
          <PhotoGrid urls={photoUrls} />
        </div>
      )}

      {/* Reactions bar */}
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>👍 Like</span>
          <span>💬 Comment</span>
          <span>↗ Share</span>
        </div>
      </div>
    </div>
  );
}

// ── Instagram preview ──────────────────────────────────────────────────────
function InstagramPreview({ text, photoUrls }: { text: string; photoUrls: string[] }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow text-gray-900 font-sans">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <div className="rounded-full p-0.5 bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-400">
          <ClubAvatar size={34} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-xs">mearnscc</p>
        </div>
        <span className="text-gray-400 text-lg">···</span>
      </div>

      {/* Photo — Instagram is photo-first */}
      {photoUrls.length > 0 ? (
        <div className="relative w-full aspect-square bg-gray-100">
          <Image
            src={photoUrls[0]}
            alt="Match photo"
            fill
            className="object-cover"
            unoptimized
          />
          {photoUrls.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-full">
              1/{photoUrls.length}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
          <p className="text-gray-400 text-xs">No photo selected</p>
        </div>
      )}

      {/* Action icons */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-3 text-xl">
          <span>🤍</span>
          <span>💬</span>
          <span>↗</span>
        </div>
        <span className="text-xl">🔖</span>
      </div>

      {/* Caption */}
      <div className="px-3 pb-4">
        <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">
          <span className="font-semibold text-gray-900">mearnscc </span>
          {text || <span className="italic text-gray-400">Your Instagram caption will appear here…</span>}
        </p>
      </div>
    </div>
  );
}

// ── Twitter preview ────────────────────────────────────────────────────────
function TwitterPreview({ text, photoUrls }: { text: string; photoUrls: string[] }) {
  const charCount = text.length;
  const overLimit = charCount > 280;

  return (
    <div className="bg-black rounded-xl overflow-hidden shadow text-white font-sans border border-gray-800">
      {/* Post */}
      <div className="flex gap-3 px-4 pt-4 pb-3">
        <ClubAvatar size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-sm">Mearns Cricket Club</span>
            <span className="text-gray-500 text-xs">@MearnsCC · now</span>
          </div>

          <p
            className={`text-sm leading-relaxed mt-1 whitespace-pre-wrap ${
              overLimit ? "text-red-400" : "text-gray-100"
            }`}
          >
            {text || (
              <span className="text-gray-500 italic">Your tweet will appear here…</span>
            )}
          </p>

          {/* Photos in tweet */}
          {photoUrls.length > 0 && (
            <div className="mt-3 rounded-xl overflow-hidden">
              <PhotoGrid urls={photoUrls.slice(0, 4)} />
            </div>
          )}

          {/* Action icons */}
          <div className="flex items-center justify-between mt-3 text-gray-500 text-xs">
            <span>💬 Reply</span>
            <span>🔁 Repost</span>
            <span>🤍 Like</span>
            <span>↗ Share</span>
          </div>
        </div>
      </div>

      {/* Character count */}
      <div className={`px-4 pb-3 text-right text-xs ${overLimit ? "text-red-400" : "text-gray-500"}`}>
        {charCount}/280
      </div>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
export default function PostPreview({ platform, text, photoUrls }: PostPreviewProps) {
  if (platform === "facebook") {
    return <FacebookPreview text={text} photoUrls={photoUrls} />;
  }
  if (platform === "instagram") {
    return <InstagramPreview text={text} photoUrls={photoUrls} />;
  }
  return <TwitterPreview text={text} photoUrls={photoUrls} />;
}
