/**
 * NOTE: This is a reference file for Figma design purposes.
 * These files are copies of the actual source code and are not meant to compile.
 * TypeScript errors are expected as dependencies are not available in this folder.
 * For the actual working code, see: client/src/website/main.tsx
 */

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
// @ts-ignore - Reference file, dependencies not available
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
