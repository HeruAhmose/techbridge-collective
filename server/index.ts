import express from "express";
import fs from "fs";
import { createServer } from "http";
import net from "net";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function applySecurityHeaders(
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), geolocation=(), microphone=(), payment=(), usb=()"
  );
  res.setHeader(
    "Content-Security-Policy",
    "base-uri 'self'; frame-ancestors 'none'; object-src 'none'"
  );
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000");
  }
  next();
}

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const probe = net.createServer();
    probe.once("error", () => resolve(false));
    probe.listen(port, () => probe.close(() => resolve(true)));
  });
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.disable("x-powered-by");
  app.use(applySecurityHeaders);

  // Serve static files from dist/public in production.
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  const indexPath = path.join(staticPath, "index.html");
  const indexHtml = await fs.promises.readFile(indexPath, "utf-8");

  app.use(express.static(staticPath, { dotfiles: "deny", fallthrough: true }));

  // Framework-neutral SPA fallback: safe under Express 5 and preserves
  // client-side routing without relying on legacy wildcard route syntax.
  app.use((_req, res) => {
    res.status(200).type("html").send(indexHtml);
  });

  const rawPort = Number(process.env.PORT || 3000);
  if (!Number.isInteger(rawPort) || rawPort < 1 || rawPort > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }
  if (!(await isPortAvailable(rawPort))) {
    throw new Error(`Configured port ${rawPort} is unavailable`);
  }

  server.listen(rawPort, () => {
    console.log(`Server running on http://localhost:${rawPort}/`);
  });
}

startServer().catch(error => {
  console.error("Server startup failed", error);
  process.exitCode = 1;
});
