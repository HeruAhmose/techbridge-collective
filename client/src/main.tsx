import { createRoot } from "react-dom/client";
import { Router as WouterRouter } from "wouter";
import App from "./App";
import "./index.css";

const viteBaseUrl = import.meta.env.BASE_URL;
const routerBase =
  viteBaseUrl === "/" ? undefined : viteBaseUrl.replace(/\/$/, "");

createRoot(document.getElementById("root")!).render(
  <WouterRouter base={routerBase}>
    <App />
  </WouterRouter>
);
