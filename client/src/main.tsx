import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
import { spawn, spawnSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as net from "net";

const ROOT = path.resolve(__dirname, "..");
const SERVER_DIR = path.join(ROOT, "server");
const CLIENT_DIR = path.join(ROOT, "client");
const CLIENT_PORT = 5173;
const CLIENT_HOST = "127.0.0.1";
const TIMEOUT_SECONDS = 60;

function safeRequireDotenv() {
  try {
    // load .env if dotenv is available
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("dotenv").config();
  } catch {
    // ignore if not installed
  }
}

function checkCommand(okCmd: string, args: string[] = ["--version"]): boolean {
  try {
    const r = spawnSync(okCmd, args, { stdio: "ignore", shell: true });
    return r.status === 0;
  } catch {
    return false;
  }
}

function runSync(command: string, args: string[], cwd?: string): number {
  const res = spawnSync(command, args, { cwd: cwd ?? ROOT, stdio: "inherit", shell: true });
  return res.status ?? 1;
}

function runDetached(command: string, args: string[], cwd?: string) {
  const child = spawn(command, args, {
    cwd: cwd ?? ROOT,
    shell: true,
    stdio: "inherit",
  });
  child.on("exit", (code) => {
    console.log(`${command} exited with ${code}`);
  });
  return child;
}

function waitForPort(host: string, port: number, timeoutSec: number): Promise<void> {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const sock = new net.Socket();
      sock.setTimeout(1500);
      sock.once("error", () => {
        sock.destroy();
        if ((Date.now() - start) / 1000 > timeoutSec) {
          clearInterval(interval);
          reject(new Error("timeout"));
        }
      });
      sock.once("timeout", () => {
        sock.destroy();
      });
      sock.connect(port, host, () => {
        sock.end();
        clearInterval(interval);
        resolve();
      });
    }, 1000);
  });
}

function openBrowser(url: string) {
  const platform = process.platform;
  if (platform === "win32") {
    spawn("cmd", ["/c", "start", "", url], { shell: false, stdio: "ignore" });
    return;
  }
  if (platform === "darwin") {
    spawn("open", [url], { stdio: "ignore" });
    return;
  }
  // linux
  spawn("xdg-open", [url], { stdio: "ignore" });
}

async function main() {
  safeRequireDotenv();

  // Pre-checks
  if (!checkCommand("python")) {
    console.warn("python not found in PATH. DB initializer may fail.");
  }
  if (!checkCommand("npm")) {
    console.error("npm not found in PATH. Cannot continue.");
    process.exit(1);
  }

  // 1) Run python DB initializer if file exists
  const dbInitPath = path.join(SERVER_DIR, "db", "db.py");
  if (fs.existsSync(dbInitPath)) {
    console.log("Running DB initializer:", dbInitPath);
    const code = runSync("python", [dbInitPath], SERVER_DIR);
    if (code !== 0) {
      console.warn("DB initializer returned non-zero exit code:", code);
    }
  } else {
    console.log("DB initializer not found, skipping:", dbInitPath);
  }

  // 2) Ensure node deps (simple check for node_modules)
  function ensureDeps(dir: string) {
    const nm = path.join(dir, "node_modules");
    if (!fs.existsSync(nm)) {
      console.log("Installing npm deps in", dir);
      const code = runSync("npm", ["install"], dir);
      if (code !== 0) {
        console.warn("npm install failed in", dir);
      }
    } else {
      console.log("node_modules present in", dir, "- skipping install");
    }
  }

  if (fs.existsSync(SERVER_DIR)) ensureDeps(SERVER_DIR);
  if (fs.existsSync(CLIENT_DIR)) ensureDeps(CLIENT_DIR);

  // 3) Start server and client (in this terminal, outputs are inherited)
  if (fs.existsSync(SERVER_DIR)) {
    console.log("Starting server (npm run dev --prefix server)...");
    runDetached("npm", ["run", "dev", "--prefix", "server"], ROOT);
  } else {
    console.log("Server folder not found, skipping server start.");
  }

  if (fs.existsSync(CLIENT_DIR)) {
    console.log("Starting client (npm run dev --prefix client)...");
    runDetached("npm", ["run", "dev", "--prefix", "client"], ROOT);
  } else {
    console.log("Client folder not found, skipping client start.");
  }

  try {
    console.log(`Waiting up to ${TIMEOUT_SECONDS}s for client at http://${CLIENT_HOST}:${CLIENT_PORT} ...`);
    await waitForPort(CLIENT_HOST, CLIENT_PORT, TIMEOUT_SECONDS);
    const url = `http://${CLIENT_HOST}:${CLIENT_PORT}`;
    console.log("Client reachable — opening", url);
    openBrowser(url);
  } catch {
    console.warn("Client did not become reachable in time. Open the client URL manually when ready.");
  }
}

main().catch((err) => {
  console.error("start-desktop error:", err);
  process.exit(1);
});