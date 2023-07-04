import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const parseArr = (s: string): string[] => s.split(",").map((s) => s.trim());

const buybackServerUrl: string = import.meta.env.VITE_BUYBACK_SERVER_URL;
const itemParserServerUrl: string = import.meta.env.VITE_ITEM_PARSER_SERVER_URL;
const languages: string[] = parseArr(import.meta.env.VITE_LANGUAGES);
const regions: string[] = parseArr(import.meta.env.VITE_REGIONS);

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App
      buybackServerUrl={buybackServerUrl}
      itemParserServerUrl={itemParserServerUrl}
      languages={languages}
      regions={regions}
    />
  </StrictMode>
);
