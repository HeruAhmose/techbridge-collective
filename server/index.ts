import express from "express";
import fs from "fs";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  const indexPath = path.join(staticPath, "index.html");
  const indexHtml = await fs.promises.readFile(indexPath, "utf-8");

  app.use(express.static(staticPath));

  // Handle client-side routing from an in-memory SPA shell.
  app.get("*", (_req, res) => {
    res.status(200).type("html").send(indexHtml);
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
