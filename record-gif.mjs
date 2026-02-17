import { chromium } from 'playwright';
import GIFEncoder from 'gif-encoder-2';
import sharp from 'sharp';
import { createWriteStream } from 'fs';

const WIDTH = 960;
const HEIGHT = 540;
const FPS = 12;
const DELAY = Math.round(1000 / FPS);

const encoder = new GIFEncoder(WIDTH, HEIGHT, 'neuquant', true);
encoder.setDelay(DELAY);
encoder.setQuality(10);
encoder.setRepeat(0); // loop forever

const output = createWriteStream('assets/demo.gif');
encoder.createReadStream().pipe(output);
encoder.start();

async function addFrame(page) {
  const buf = await page.screenshot({ type: 'png' });
  const { data } = await sharp(buf)
    .resize(WIDTH, HEIGHT)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  encoder.addFrame(data);
}

async function addFrames(page, count) {
  for (let i = 0; i < count; i++) {
    await addFrame(page);
    await page.waitForTimeout(DELAY);
  }
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });

// Scene 1: Flowchart loads (hold 2s)
await page.goto('http://localhost:5174');
await page.waitForTimeout(2500);
console.log('Recording flowchart...');
await addFrames(page, FPS * 2);

// Scene 2: Switch to sequence diagram (hold 2s)
console.log('Switching to sequence...');
await page.click('button[data-example="sequence"]');
await page.waitForTimeout(1500);
await addFrames(page, FPS * 2);

// Scene 3: Switch to mindmap (hold 2s)
console.log('Switching to mindmap...');
await page.click('button[data-example="mindmap"]');
await page.waitForTimeout(1500);
await addFrames(page, FPS * 2);

// Scene 4: Switch to gitgraph (hold 2s)
console.log('Switching to gitgraph...');
await page.click('button[data-example="gitgraph"]');
await page.waitForTimeout(1500);
await addFrames(page, FPS * 2);

// Scene 5: Switch to pie (hold 1.5s)
console.log('Switching to pie...');
await page.click('button[data-example="pie"]');
await page.waitForTimeout(1500);
await addFrames(page, FPS * 1.5);

// Scene 6: Back to flowchart, do a zoom-in via scroll wheel (3s)
console.log('Back to flowchart + zoom...');
await page.click('button[data-example="flowchart"]');
await page.waitForTimeout(1500);
await addFrames(page, FPS * 1);

const container = await page.$('#diagram-container');
const box = await container.boundingBox();
const cx = box.x + box.width / 2;
const cy = box.y + box.height / 2;

// Zoom in
for (let i = 0; i < 8; i++) {
  await page.mouse.wheel(cx, cy, { deltaY: -120 });
  await page.waitForTimeout(80);
  await addFrame(page);
}
await addFrames(page, FPS * 1);

// Zoom back out
for (let i = 0; i < 8; i++) {
  await page.mouse.wheel(cx, cy, { deltaY: 120 });
  await page.waitForTimeout(80);
  await addFrame(page);
}
await addFrames(page, FPS * 1);

encoder.finish();
await browser.close();

await new Promise(resolve => output.on('finish', resolve));
console.log('Done! Saved to assets/demo.gif');
