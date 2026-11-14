import fs from "node:fs";
import path from "node:path";

const file = process.argv[2] ?? "projects/example/project.json";
const errors = [];
let project;
try {
  project = JSON.parse(fs.readFileSync(file, "utf8"));
} catch (error) {
  console.error(`[FAIL] Cannot read JSON project ${file}: ${error.message}`);
  process.exit(1);
}
const required = ["schemaVersion","projectId","title","category","language","platform","format","fps","visualStyle","narration","scenes"];
for (const key of required) if (!(key in project)) errors.push(`Missing required field: ${key}`);
if (project.schemaVersion !== "1.0") errors.push("schemaVersion must be 1.0");
if (!["vertical","horizontal","square"].includes(project.format)) errors.push("format must be vertical, horizontal or square");
if (![24,25,30,50,60].includes(project.fps)) errors.push("fps must be 24, 25, 30, 50 or 60");
if (!Array.isArray(project.scenes) || project.scenes.length === 0) errors.push("scenes must contain at least one scene");

const ids = new Set();
const scenes = Array.isArray(project.scenes) ? [...project.scenes].sort((a,b) => a.startSec - b.startSec) : [];
for (const [index, scene] of scenes.entries()) {
  const label = scene.id ?? `scene[${index}]`;
  if (!scene.id || ids.has(scene.id)) errors.push(`${label}: missing or duplicate scene id`);
  ids.add(scene.id);
  if (!Number.isFinite(scene.startSec) || scene.startSec < 0) errors.push(`${label}: startSec must be >= 0`);
  if (!Number.isFinite(scene.durationSec) || scene.durationSec <= 0) errors.push(`${label}: durationSec must be > 0`);
  if (typeof scene.visualDescription !== "string" || scene.visualDescription.trim().length < 8) errors.push(`${label}: visualDescription is too short`);
  if (!Array.isArray(scene.animation) || scene.animation.length === 0) errors.push(`${label}: at least one real animation channel is required`);
  if (index > 0) {
    const previous = scenes[index - 1];
    if (Number.isFinite(previous.startSec) && Number.isFinite(previous.durationSec) && scene.startSec < previous.startSec + previous.durationSec - 0.001) {
      errors.push(`${label}: overlaps previous scene ${previous.id}`);
    }
  }
}
if (project.targetDurationSec && scenes.length) {
  const last = scenes.at(-1);
  if (last && Number.isFinite(last.startSec) && Number.isFinite(last.durationSec) && last.startSec + last.durationSec > project.targetDurationSec + 0.05) {
    errors.push("Scene timeline exceeds targetDurationSec");
  }
}
if (project.narration?.mode === "imported" && !project.narration.audioFile && !project.narration.transcript) {
  errors.push("Imported narration needs audioFile or transcript");
}

if (errors.length) {
  console.error("[FAIL] Project validation found issues:");
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}
console.log(`[PASS] ${path.basename(file)} — ${project.scenes.length} scenes, ${project.format}, ${project.fps} fps`);
console.log("[INFO] Scene animation channels:", [...new Set(scenes.flatMap(s => s.animation ?? []))].join(", "));
