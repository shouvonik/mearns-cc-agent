"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { GooglePhoto } from "@/lib/google-photos";
import { buildPhotoUrl } from "@/lib/google-photos";

interface PhotoPickerProps {
  selectedPhotoIds: string[];
  onChange: (photos: GooglePhoto[]) => void;
  maxPhotos?: number;
}

export default function PhotoPicker({
  selectedPhotoIds,
  onChange,
  maxPhotos = 10,
}: PhotoPickerProps) {
  const [photos, setPhotos] = useState<GooglePhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [loadingMore, setLoadingMore] = useState(false);

  const selectedSet = new Set(selectedPhotoIds);
  const selectedPhotos = photos.filter((p) => selectedSet.has(p.id));

  async function loadPhotos(pageToken?: string) {
    if (!pageToken) setLoading(true);
    else setLoadingMore(true);
    setError(null);

    try {
      const params = new URLSearchParams({ pageSize: "30" });
      if (pageToken) params.set("pageToken", pageToken);

      const res = await fetch(`/api/photos?${params}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to load photos");
      }
      const data: { photos: GooglePhoto[]; nextPageToken?: string } =
        await res.json();

      setPhotos((prev) => (pageToken ? [...prev, ...data.photos] : data.photos));
      setNextPageToken(data.nextPageToken);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    loadPhotos();
  }, []);

  function togglePhoto(photo: GooglePhoto) {
    const isSelected = selectedSet.has(photo.id);
    let updated: GooglePhoto[];

    if (isSelected) {
      updated = selectedPhotos.filter((p) => p.id !== photo.id);
    } else {
      if (selectedPhotos.length >= maxPhotos) return;
      updated = [...selectedPhotos, photo];
    }
    onChange(updated);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-slate-400 text-sm">Loading photos…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 text-sm mb-3">{error}</p>
        <button
          onClick={() => loadPhotos()}
          className="text-xs text-slate-400 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <p className="text-slate-400 text-sm text-center py-8">
        No photos found in the configured album.
      </p>
    );
  }

  return (
    <div>
      {selectedPhotoIds.length > 0 && (
        <p className="text-xs text-green-400 mb-3">
          {selectedPhotoIds.length} photo{selectedPhotoIds.length !== 1 ? "s" : ""} selected
          {maxPhotos < 99 && ` (max ${maxPhotos})`}
        </p>
      )}

      <div className="grid grid-cols-3 gap-1.5">
        {photos.map((photo) => {
          const isSelected = selectedSet.has(photo.id);
          const thumb = buildPhotoUrl(photo.baseUrl, 300, 300);

          return (
            <button
              key={photo.id}
              onClick={() => togglePhoto(photo)}
              className={`relative aspect-square rounded-lg overflow-hidden focus:outline-none transition-all ${
                isSelected
                  ? "ring-2 ring-green-400 ring-offset-1 ring-offset-slate-900"
                  : "opacity-80 hover:opacity-100"
              }`}
            >
              <Image
                src={thumb}
                alt={photo.filename}
                fill
                className="object-cover"
                unoptimized
              />
              {isSelected && (
                <div className="absolute inset-0 bg-green-400/20 flex items-center justify-center">
                  <div className="bg-green-400 text-slate-900 rounded-full w-6 h-6 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {nextPageToken && (
        <button
          onClick={() => loadPhotos(nextPageToken)}
          disabled={loadingMore}
          className="w-full mt-4 py-2.5 text-sm text-slate-400 border border-slate-700 rounded-lg hover:border-slate-500 transition-colors disabled:opacity-50"
        >
          {loadingMore ? "Loading…" : "Load more photos"}
        </button>
      )}
    </div>
  );
}
