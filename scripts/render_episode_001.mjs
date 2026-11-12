import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

const base = "http://127.0.0.1:4173";
const audioPath = "dist/episode-001/narration-complete.wav";
const timelinePath = "dist/episode-001/timeline.json";
const capturePath = "dist/episode-001/scene-capture.mp4";
const timeline = JSON.parse(await readFile(timelinePath, "utf8"));
const duration = Number(timeline.duration);
if (!Number.isFinite(duration) || duration <= 1 || timeline.segments?.length !== 6) {
  throw new Error("Durée ou nombre de scènes invalide dans timeline.json");
}

let browser;
let capture;
try {
  browser = await chromium.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--autoplay-policy=no-user-gesture-required",
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-webgl",
      "--enable-unsafe-swiftshader",
      "--ignore-gpu-blocklist",
      "--disable-features=VizDisplayCompositor",
      "--mute-audio",
      "--kiosk"
    ]
  });
  const page = await browser.newPage({ viewport: { width: 720, height: 1280 }, deviceScaleFactor: 1 });
  page.on("pageerror", error => console.error("Erreur navigateur :", error.message));
  await page.goto(base, { waitUntil: "networkidle", timeout: 60000 });
  await page.addStyleTag({ content: `
    html, body, #app, main, .stage-wrap, #stage {
      width: 100vw !important; height: 100vh !important;
      min-height: 100vh !important; margin: 0 !important; padding: 0 !important;
      overflow: hidden !important;
    }
    .topbar, .intro, .stage-heading, .stage-caption, .audio-lab,
    .controls, footer { display: none !important; }
    .stage-wrap { border: 0 !important; box-shadow: none !important; background: #151d26 !important; }
    #stage canvas { width: 100% !important; height: 100% !important; }
  ` });
  await page.locator("#audio-file").setInputFiles(audioPath);
  await page.locator("#timeline-file").setInputFiles(timelinePath);
  await page.waitForFunction(
    () => document.querySelector("#sync-status")?.textContent?.includes("Synchronisation prête"),
    null,
    { timeout: 15000 }
  );
  await page.waitForFunction(() => {
    const canvas = document.querySelector("#stage canvas");
    return canvas && canvas.width > 0 && canvas.height > 0;
  }, null, { timeout: 15000 });

  capture = spawn("ffmpeg", [
    "-y", "-f", "x11grab", "-framerate", "30",
    "-video_size", "720x1280", "-i", process.env.DISPLAY || ":99.0",
    "-t", String(duration + 1.0), "-an",
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "19",
    "-pix_fmt", "yuv420p", capturePath
  ], { stdio: "ignore" });
  await delay(450);
  await page.locator("#narration-player").evaluate(audio => audio.play());
  await page.waitForFunction(() => document.querySelector("#narration-player")?.ended === true,
    null, { timeout: duration * 1000 + 20000 });
  const [code] = await new Promise(resolve => capture.once("close", (...args) => resolve(args)));
  if (code !== 0) throw new Error(`Capture FFmpeg terminée avec le code ${code}`);
  console.log(`Capture terminée : ${duration.toFixed(2)} secondes, six scènes synchronisées.`);
} finally {
  if (capture && capture.exitCode === null) capture.kill("SIGTERM");
  if (browser) await browser.close();
}
