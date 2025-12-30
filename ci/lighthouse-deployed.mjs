import fs from "node:fs";
import path from "node:path";
import lighthouse from "lighthouse";
import chromeLauncher from "chrome-launcher";

const url = process.env.LIGHTHOUSE_URL;
if (!url) {
  console.error("Missing LIGHTHOUSE_URL env var");
  process.exit(1);
}

const workspaceRoot = process.cwd();
const outDir = path.join(workspaceRoot, "lighthouse-report");
fs.mkdirSync(outDir, { recursive: true });

const chrome = await chromeLauncher.launch({
  chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu"],
});

try {
  const result = await lighthouse(url, {
    port: chrome.port,
    output: ["html", "json"],
    logLevel: "info",
  });

  const html = Array.isArray(result.report) ? result.report[0] : result.report;
  const json = Array.isArray(result.report) ? result.report[1] : undefined;

  fs.writeFileSync(path.join(outDir, "index.html"), html, "utf8");
  if (json) {
    fs.writeFileSync(path.join(outDir, "report.json"), json, "utf8");
  }

  console.log(`Lighthouse report written to ${path.relative(workspaceRoot, outDir)}`);
} finally {
  await chrome.kill();
}
