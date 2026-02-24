import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAlwaysPublic = createRouteMatcher(["/api/health"]);

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
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
