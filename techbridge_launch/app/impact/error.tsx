"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="bg-linen">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-xl font-semibold text-red-900">Impact page error</h1>
          <p className="mt-2 text-sm text-red-900/80">
            Something went wrong loading the dashboard. You can retry, or check the health endpoint.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              className="rounded-md bg-red-900 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
              onClick={() => reset()}
            >
              Retry
            </button>
            <a
              className="rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-900 no-underline hover:bg-red-100"
              href="/api/health"
            >
              /api/health
            </a>
          </div>
          <pre className="mt-4 max-h-40 overflow-auto rounded-md bg-white/60 p-3 text-xs text-red-900/70">
            {error?.message}
          </pre>
        </div>
      </div>
    </main>
  );
}
