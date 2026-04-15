import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-6 text-center">
      <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 border border-slate-700">
        <span className="text-slate-400 text-xl font-bold">404</span>
      </div>
      <h2 className="text-white font-bold text-lg mb-2">Page not found</h2>
      <p className="text-slate-400 text-sm mb-6">That page doesn&apos;t exist.</p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-xl transition-colors"
      >
        Go home
      </Link>
    </div>
  );
}
