import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtected = createRouteMatcher([
  "/navigator(.*)",
  "/api/chatbase-jwt(.*)",
  "/api/techminutes(.*)",
  "/api/admin(.*)",
  "/partner(.*)",
  "/api/partner(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) await auth.protect();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

