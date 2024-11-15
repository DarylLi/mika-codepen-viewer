import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./Root";
import axios from "axios";
import "./index.css";
import "./assets/main.scss";
import { initIndexDB } from "./utils/indexDb";

createRoot(document.getElementById("root")!).render(<App />);
