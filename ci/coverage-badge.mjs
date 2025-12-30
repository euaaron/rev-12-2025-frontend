import fs from "node:fs";
import path from "node:path";

const workspaceRoot = process.cwd();
const summaryPath = path.join(workspaceRoot, "coverage", "coverage-summary.json");
const outPath = path.join(workspaceRoot, "coverage-badge.svg");

if (!fs.existsSync(summaryPath)) {
  console.error(
    `Missing ${summaryPath}. Ensure vitest runs with coverage reporter 'json-summary'.`,
  );
  process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(summaryPath, "utf8"));

// Prefer lines coverage (common convention for badges).
const pct =
  summary?.total?.lines?.pct ??
  summary?.total?.statements?.pct ??
  summary?.total?.branches?.pct ??
  summary?.total?.functions?.pct;

if (typeof pct !== "number" || Number.isNaN(pct)) {
  console.error("Could not read coverage percentage from coverage-summary.json");
  process.exit(1);
}

const rounded = Math.round(pct * 10) / 10;

// Simple color mapping similar to common badge services.
const color =
  rounded >= 95
    ? "#2da44e"
    : rounded >= 90
      ? "#3fb950"
      : rounded >= 80
        ? "#bf8700"
        : "#d1242f";

const label = "coverage";
const value = `${rounded}%`;

// Basic, self-contained SVG badge (no external fonts).
// Keep widths slightly generous so small rounding changes don't clip.
const leftWidth = 70;
const rightWidth = 60;
const width = leftWidth + rightWidth;
const height = 20;

const escapeXml = (text) =>
  String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" role="img" aria-label="${escapeXml(label)}: ${escapeXml(value)}">
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${width}" height="${height}" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${leftWidth}" height="${height}" fill="#555"/>
    <rect x="${leftWidth}" width="${rightWidth}" height="${height}" fill="${color}"/>
    <rect width="${width}" height="${height}" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,DejaVu Sans,sans-serif" font-size="11">
    <text x="${leftWidth / 2}" y="14">${escapeXml(label)}</text>
    <text x="${leftWidth + rightWidth / 2}" y="14">${escapeXml(value)}</text>
  </g>
</svg>
`;

fs.writeFileSync(outPath, svg, "utf8");
console.log(`Wrote ${path.relative(workspaceRoot, outPath)}`);
