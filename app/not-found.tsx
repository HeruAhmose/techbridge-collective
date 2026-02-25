export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="font-mono text-xs tracking-widest text-ink/40 uppercase">404</div>
      <h1 className="text-3xl font-semibold text-forest">Page not found</h1>
      <p className="text-ink/60">The page you're looking for doesn't exist.</p>
      <a href="/" className="mt-2 text-sm font-semibold text-sage underline-offset-4 hover:underline">
        Go home
      </a>
    </div>
  );
}
