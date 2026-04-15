"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-6 text-center">
      <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center mb-4">
        <span className="text-red-400 text-2xl font-bold">!</span>
      </div>
      <h2 className="text-white font-bold text-lg mb-2">Something went wrong</h2>
      <p className="text-slate-400 text-sm mb-6 max-w-xs">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-xl transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
