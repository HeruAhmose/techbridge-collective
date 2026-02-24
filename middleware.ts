import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Always public — never require auth
const isAlwaysPublic = createRouteMatcher([
  "/api/health",
  "/",
  "/about(.*)",
  "/get-help(.*)",
  "/host-a-hub(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

// Public only when MEETING_MODE=1 (set in Vercel env for demos)
const isMeetingPublic = createRouteMatcher([
  "/impact(.*)",
  "/demo(.*)",
]);

// Always require auth
const isProtectedRoute = createRouteMatcher([
  "/navigator(.*)",
  "/partner(.*)",
  "/dashboard(.*)",
  "/api/admin(.*)",
  "/api/partner(.*)",
  "/api/techminutes(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isAlwaysPublic(req)) return;
  if (process.env.MEETING_MODE === "1" && isMeetingPublic(req)) return;
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
