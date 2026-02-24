export default function Loading() {
  return (
    <main className="bg-linen">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="h-8 w-64 rounded bg-black/10" />
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl border border-ink/10 bg-white shadow-sm" />
          ))}
        </div>
        <div className="mt-6 h-80 rounded-2xl border border-ink/10 bg-white shadow-sm" />
      </div>
    </main>
  );
}
