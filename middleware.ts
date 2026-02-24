import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublic = createRouteMatcher([
  "/",
  "/api/health",
  "/about(.*)",
  "/get-help(.*)",
  "/host-a-hub(.*)",
  "/impact(.*)",
  "/demo(.*)",
  "/dashboard(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/robots.txt",
  "/sitemap.xml",
  "/api/intake(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublic(req)) await auth.protect();
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
