import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublic = createRouteMatcher([
  "/",
  "/api/health",
  "/about(.*)",
  "/get-help(.*)",
  "/host-a-hub(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/robots.txt",
  "/sitemap.xml",
  "/api/intake(.*)",
  "/api/webhooks(.*)",
]);

const isMeetingPublic = createRouteMatcher([
  "/impact(.*)",
  "/demo(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublic(req)) return;
  if (process.env.MEETING_MODE === "1" && isMeetingPublic(req)) return;
  if (!isPublic(req)) await auth.protect();
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
