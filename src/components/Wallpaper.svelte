<script>
  // The desktop: a hand-painted (well, code-painted) take on XP's Bliss.
  // Azure sky, soft cumulus, one rolling green hill. Seeded, so it looks the
  // same every time, and redrawn to fit the screen.
  import { onMount } from "svelte";
  import { ui } from "../lib/state.svelte.js";

  let canvas = $state();

  // Small seeded random, so the clouds and grass don't move between visits.
  function rng(seed) {
    return () => {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function paint() {
    const dpr = Math.min(2, devicePixelRatio || 1);
    const w = innerWidth, h = innerHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    const g = canvas.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const r = rng(2005);
    const s = Math.max(w, h * 1.6) / 1600; // scale detail with the screen

    // Sky: deep azure overhead, paling toward the horizon.
    const sky = g.createLinearGradient(0, 0, 0, h * 0.7);
    sky.addColorStop(0, "#1d5fd4");
    sky.addColorStop(0.45, "#4b8fea");
    sky.addColorStop(0.8, "#8fc0f4");
    sky.addColorStop(1, "#c6e0f8");
    g.fillStyle = sky;
    g.fillRect(0, 0, w, h);

    // Clouds: clusters of soft puffs, lit from above, shaded underneath.
    function puff(x, y, rad, color) {
      const gr = g.createRadialGradient(x, y, 0, x, y, rad);
      gr.addColorStop(0, color);
      gr.addColorStop(1, color.replace(/[\d.]+\)$/, "0)"));
      g.fillStyle = gr;
      g.beginPath(); g.arc(x, y, rad, 0, Math.PI * 2); g.fill();
    }
    // An ellipse of soft light, for bodies and wisps.
    function smear(x, y, rx, ry, color, rot = 0) {
      g.save(); g.translate(x, y); g.rotate(rot); g.scale(1, ry / rx);
      puff(0, 0, rx, color);
      g.restore();
    }
    // Cumulus: a flat-bottomed body, billows piled on top, a shaded underside.
    function cloud(cx, cy, width, height, n) {
      smear(cx, cy + height * 0.12, width * 0.55, height * 0.42, "rgba(160,185,220,0.28)");
      smear(cx, cy, width * 0.52, height * 0.42, "rgba(255,255,255,0.7)");
      for (let i = 0; i < n; i++) {
        const t = r() * 2 - 1;                                  // across the cloud
        const top = Math.sqrt(1 - t * t);                       // taller in the middle
        const x = cx + t * width * 0.46;
        const y = cy - r() * height * 0.55 * top;
        const rad = (0.35 + 0.65 * top) * (18 + r() * 34) * s * (width / (400 * s)) ** 0.5;
        puff(x, y + rad * 0.3, rad * 1.05, "rgba(170,190,225,0.18)");
        puff(x, y, rad, "rgba(255,255,255,0.72)");
        puff(x - rad * 0.25, y - rad * 0.3, rad * 0.6, "rgba(255,255,255,0.55)");
      }
    }
    // High, thin streaks.
    for (let i = 0; i < 6; i++) smear(r() * w, h * (0.05 + r() * 0.22), (120 + r() * 200) * s, (16 + r() * 16) * s, `rgba(255,255,255,${0.1 + r() * 0.12})`, (r() - 0.5) * 0.12);
    cloud(w * 0.18, h * 0.2, 440 * s, 150 * s, 60);
    cloud(w * 0.5, h * 0.11, 280 * s, 80 * s, 30);
    cloud(w * 0.84, h * 0.24, 480 * s, 170 * s, 64);
    cloud(w * 0.04, h * 0.4, 280 * s, 70 * s, 24);
    cloud(w * 0.64, h * 0.43, 420 * s, 70 * s, 34);
    // A thin haze band above the horizon.
    const haze = g.createLinearGradient(0, h * 0.48, 0, h * 0.66);
    haze.addColorStop(0, "rgba(220,235,250,0)");
    haze.addColorStop(1, "rgba(220,235,250,0.55)");
    g.fillStyle = haze;
    g.fillRect(0, h * 0.48, w, h * 0.2);

    // A far hill on the right, hazier, then the famous one in front.
    const back = new Path2D();
    back.moveTo(w * 0.45, h);
    back.lineTo(w * 0.45, h * 0.7);
    back.bezierCurveTo(w * 0.62, h * 0.6, w * 0.8, h * 0.57, w, h * 0.6);
    back.lineTo(w, h); back.closePath();
    const bg = g.createLinearGradient(0, h * 0.57, 0, h * 0.8);
    bg.addColorStop(0, "#8cc75a"); bg.addColorStop(1, "#4f9a2c");
    g.fillStyle = bg; g.fill(back);

    const hill = new Path2D();
    hill.moveTo(0, h);
    hill.lineTo(0, h * 0.64);
    hill.bezierCurveTo(w * 0.14, h * 0.52, w * 0.3, h * 0.47, w * 0.44, h * 0.5);
    hill.bezierCurveTo(w * 0.62, h * 0.54, w * 0.82, h * 0.66, w, h * 0.7);
    hill.lineTo(w, h); hill.closePath();
    const hg = g.createLinearGradient(0, h * 0.47, 0, h);
    hg.addColorStop(0, "#86c93f");
    hg.addColorStop(0.25, "#5aa72a");
    hg.addColorStop(1, "#2f7a17");
    g.fillStyle = hg; g.fill(hill);

    // Light and shadow across the hill: sun on the crest, dips in the dells.
    g.save();
    g.clip(hill);
    const sun = g.createRadialGradient(w * 0.3, h * 0.5, 0, w * 0.3, h * 0.5, w * 0.45);
    sun.addColorStop(0, "rgba(220,245,120,0.35)"); sun.addColorStop(1, "rgba(220,245,120,0)");
    g.fillStyle = sun; g.fillRect(0, 0, w, h);
    // Broad, shallow dells.
    for (let i = 0; i < 4; i++) smear(w * (0.15 + r() * 0.75), h * (0.72 + r() * 0.22), (260 + r() * 300) * s, (60 + r() * 50) * s, "rgba(25,80,12,0.16)", (r() - 0.5) * 0.3);
    // Mottling, so it reads as a field and not a flat fill.
    for (let i = 0; i < 1400 * (w * h) / (1600 * 1000); i++) {
      const x = r() * w, y = h * 0.46 + r() * h * 0.56, rad = (5 + r() * 16) * s;
      puff(x, y, rad, r() < 0.5 ? "rgba(190,235,110,0.07)" : "rgba(20,70,10,0.07)");
    }
    // Grass: thousands of short strokes, brighter near the top of the hill.
    g.lineCap = "round";
    const blades = Math.round(9000 * (w * h) / (1600 * 1000));
    for (let i = 0; i < blades; i++) {
      const x = r() * w, y = h * 0.46 + r() * h * 0.56;
      if (!g.isPointInPath(hill, x * dpr, y * dpr)) continue;
      const depth = (y - h * 0.46) / (h * 0.56);
      const len = (3 + r() * 6) * s * (0.6 + depth);
      const lean = (r() - 0.5) * 0.7;
      g.strokeStyle = `hsla(${88 + r() * 22}, ${55 + r() * 20}%, ${48 - depth * 22 + r() * 10}%, 0.45)`;
      g.lineWidth = (0.8 + r()) * s;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + lean * len, y - len); g.stroke();
    }
    g.restore();
  }

  onMount(() => {
    paint();
    let t;
    const onresize = () => { clearTimeout(t); t = setTimeout(paint, 150); };
    addEventListener("resize", onresize);
    return () => removeEventListener("resize", onresize);
  });
</script>

<canvas class="wallpaper" bind:this={canvas} aria-hidden="true" hidden={ui.wallpaper !== "bliss"}></canvas>
{#if ui.wallpaper !== "bliss"}<div class="wallpaper wp-{ui.wallpaper}" aria-hidden="true"></div>{/if}
