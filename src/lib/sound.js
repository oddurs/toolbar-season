// Synthesized sounds: IE's navigation click and a 56k modem connecting.
// Nothing plays until the user has interacted with the page.
import { ui } from "./state.svelte.js";

let ctx;
const audio = () => (ctx ||= new (window.AudioContext || window.webkitAudioContext)());

export const wakeAudio = () => { try { if (audio().state === "suspended") ctx.resume(); } catch {} };

function tone(freqs, start, dur, gain = 0.05, type = "sine") {
  const c = audio(), g = c.createGain();
  g.gain.setValueAtTime(gain, start);
  g.gain.setValueAtTime(gain, start + dur - 0.01);
  g.gain.linearRampToValueAtTime(0, start + dur);
  g.connect(c.destination);
  for (const f of freqs) {
    const o = c.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f, start);
    o.connect(g);
    o.start(start); o.stop(start + dur);
  }
  return g;
}

function noise(start, dur, gain = 0.03, band = 1800) {
  const c = audio(), len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
  src.buffer = buf; f.type = "bandpass"; f.frequency.value = band; f.Q.value = 0.8;
  g.gain.setValueAtTime(gain, start);
  g.gain.linearRampToValueAtTime(0, start + dur);
  src.connect(f).connect(g).connect(c.destination);
  src.start(start);
}

// Runs fn(ctx, now) only when sound is allowed and running.
function play(fn) {
  if (ui.muted) return;
  try { const c = audio(); if (c.state === "running") fn(c, c.currentTime); } catch {}
}

// Windows XP Ding: a bright bell with a quick decay.
export const ding = () => play((c, t) => {
  for (const [f, g] of [[1318, 0.06], [2637, 0.02], [1976, 0.015]]) bell(c, f, t, 0.9, g);
});
// Windows XP Critical Stop: a low, descending chord.
export const chord = () => play((c, t) => {
  [[523, 0], [392, 0.09], [311, 0.18]].forEach(([f, dt]) => bell(c, f, t + dt, 0.7, 0.045));
});
// SP2's pop-up blocked sound: a tiny, dry tick.
export const blocked = () => play((c, t) => { tone([3200], t, 0.012, 0.05, "square"); tone([1800], t + 0.02, 0.015, 0.03, "square"); });

function bell(c, f, t, dur, gain) {
  const o = c.createOscillator(), g = c.createGain();
  o.frequency.value = f;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t); o.stop(t + dur);
}

export function navClick() {
  if (ui.muted) return;
  try {
    const c = audio();
    if (c.state !== "running") return;
    [0, 0.028].forEach(dt => tone([2600], c.currentTime + dt, 0.02, 0.04, "square"));
  } catch {}
}

const DTMF = { 1: [697, 1209], 2: [697, 1336], 3: [697, 1477], 4: [770, 1209], 5: [770, 1336], 6: [770, 1477], 7: [852, 1209], 8: [852, 1336], 9: [852, 1477], 0: [941, 1336] };

// Resume audio inside the click that asked for it, and wait until it's live.
// (Browsers only allow sound after a user gesture, and resuming is async.)
// Some browsers never settle resume() (no sound device, strict autoplay
// rules), so don't wait more than a moment: without sound, carry on silently.
export async function ready() {
  if (ui.muted) return null;
  try {
    const c = audio();
    if (c.state !== "running") await Promise.race([c.resume(), new Promise(r => setTimeout(r, 800))]);
    return c.state === "running" ? c : null;
  } catch { return null; }
}

// A 56k modem dialing and connecting (V.90), heard through a phone line.
// Resolves to the handshake's length in seconds, or 0 if sound is off.
export async function modem(number = "5550142") {
  const c = await ready();
  if (!c) return 0;

  // The phone line: 300-3400 Hz, a little saturation, then a compressor.
  const line = c.createGain();
  const hp = c.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 300;
  const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3400;
  const sat = c.createWaveShaper();
  sat.curve = Float32Array.from({ length: 1024 }, (_, i) => Math.tanh(((i / 1023) * 2 - 1) * 1.6));
  const comp = c.createDynamicsCompressor();
  const out = c.createGain(); out.gain.value = 0.55;
  line.connect(hp).connect(lp).connect(sat).connect(comp).connect(out).connect(c.destination);

  const osc = (freqs, t, dur, gain, type = "sine") => {
    const g = c.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.008);
    g.gain.setValueAtTime(gain, t + dur - 0.008);
    g.gain.linearRampToValueAtTime(0, t + dur);
    g.connect(line);
    for (const f of freqs) { const o = c.createOscillator(); o.type = type; o.frequency.value = f; o.connect(g); o.start(t); o.stop(t + dur); }
  };
  const hiss = (t, dur, gain, lo = 300, hi = 3400) => {
    const len = Math.ceil(c.sampleRate * dur), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    src.buffer = buf; f.type = "bandpass"; f.frequency.value = Math.sqrt(lo * hi); f.Q.value = Math.sqrt(lo * hi) / (hi - lo);
    g.gain.value = gain;
    src.connect(f).connect(g).connect(line); src.start(t); src.stop(t + dur);
    return g;
  };
  // V.21 FSK at 300 baud: the warbling "bong" of the two modems introducing themselves.
  const fsk = (t, dur, mark, space, gain) => {
    const o = c.createOscillator(), g = c.createGain();
    for (let x = t; x < t + dur; x += 1 / 300) o.frequency.setValueAtTime(Math.random() < 0.55 ? mark : space, x);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + 0.01);
    g.gain.setValueAtTime(gain, t + dur - 0.01); g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(g).connect(line); o.start(t); o.stop(t + dur);
  };
  // ANSam: 2100 Hz answer tone, 15 Hz amplitude wobble, phase flipped every 450 ms.
  const ansam = (t, dur, gain) => {
    for (let s = t, k = 0; s < t + dur; s += 0.45, k++) {
      const e = Math.min(t + dur, s + 0.45);
      const o = c.createOscillator(), g = c.createGain(), lfo = c.createOscillator(), depth = c.createGain();
      o.frequency.value = 2100; g.gain.value = (k % 2 ? -1 : 1) * gain;
      lfo.frequency.value = 15; depth.gain.value = gain * 0.2;
      lfo.connect(depth).connect(g.gain);
      o.connect(g).connect(line);
      o.start(s); o.stop(e); lfo.start(s); lfo.stop(e);
    }
  };
  // V.34 line probing: a chord of tones every 150 Hz, the metallic "ding".
  const probe = (t, dur, gain) => {
    const freqs = [];
    for (let f = 150; f <= 3750; f += 150) if (![900, 1200, 1800, 2400].includes(f)) freqs.push(f);
    osc(freqs, t, dur, gain / Math.sqrt(freqs.length));
  };

  let t = c.currentTime + 0.05;
  const start = t;
  hiss(t, 0.03, 0.5); t += 0.25;                                   // off-hook click
  hiss(t, 13, 0.012);                                             // line noise under everything
  osc([350, 440], t, 1.4, 0.16); t += 1.5;                        // dial tone
  for (const d of number) { osc(DTMF[d], t, 0.085, 0.2); t += 0.165; }
  t += 1.0;                                                       // switching...
  osc([440, 480], t, 1.3, 0.12); t += 1.3;                        // one ring
  hiss(t, 0.02, 0.4); t += 0.3;                                   // picked up
  ansam(t, 2.6, 0.2); t += 2.6;                                   // answer tone
  fsk(t, 0.75, 1180, 980, 0.16); fsk(t + 0.12, 0.7, 1850, 1650, 0.12); t += 0.9; // CM/JM "bong"
  probe(t, 0.18, 0.5); t += 0.35; probe(t, 0.55, 0.5); t += 0.65; // line probing chord
  osc([1200], t, 0.12, 0.14, "square"); osc([2400], t + 0.12, 0.1, 0.1, "square"); t += 0.3;
  const train = hiss(t, 2.8, 0.55, 400, 3200);                     // "kssshhhh": scrambled training
  train.gain.setValueAtTime(0.55, t + 1.3); train.gain.linearRampToValueAtTime(0.2, t + 1.4); train.gain.linearRampToValueAtTime(0.6, t + 1.55);
  t += 2.8;                                                       // connected; the speaker mutes
  return t - start;
}

// Pachelbel's Canon, the most GeoCities of MIDI files (public domain).
// Ground bass under three variations, looped until stopped.
const NOTE = n => 440 * 2 ** ((({ C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 })[n[0]] + (n[1] === "#" ? 1 : 0) + (+n.at(-1) - 4) * 12) / 12);
const BASS = ["D3", "A2", "B2", "F#2", "G2", "D2", "G2", "A2"];
const TUNES = [
  ["F#5", "E5", "D5", "C#5", "B4", "A4", "B4", "C#5"].map(n => [n]),
  ["D5", "C#5", "B4", "A4", "G4", "F#4", "G4", "E4"].map(n => [n]),
  [["D5", "F#5"], ["A5", "G5"], ["F#5", "D5"], ["F#5", "E5"], ["D5", "B4"], ["D5", "A4"], ["G4", "B4"], ["A4", "G4"]],
];
export function canon() {
  let stopped = false, bar = 0, timer;
  const beat = 0.62;
  const schedule = () => {
    if (stopped || ui.muted) return;
    try {
      const c = audio();
      if (c.state !== "running") { timer = setTimeout(schedule, 300); return; }
      const t0 = c.currentTime + 0.05, tune = TUNES[bar % TUNES.length];
      BASS.forEach((n, i) => tone([NOTE(n)], t0 + i * beat, beat * 0.95, 0.035, "triangle"));
      tune.forEach((notes, i) => notes.forEach((n, j) => tone([NOTE(n)], t0 + i * beat + (j * beat) / notes.length, beat / notes.length * 0.9, 0.025, "square")));
      bar++;
      timer = setTimeout(schedule, BASS.length * beat * 1000 - 60);
    } catch {}
  };
  schedule();
  return () => { stopped = true; clearTimeout(timer); };
}

// "Daisy Bell" (1892, public domain), the song computers sing. Calls onNote(i)
// as each syllable starts and onDone() at the end. Returns a stop function.
export const DAISY = [
  ["Dai-", "G5", 3], ["sy, ", "E5", 3], ["Dai-", "C5", 3], ["sy, ", "G4", 3],
  ["give ", "A4", 1], ["me ", "B4", 1], ["your ", "C5", 1], ["an-", "A4", 2], ["swer, ", "C5", 1], ["do. ", "G4", 5],
  ["I'm ", "D5", 3], ["half ", "G5", 3], ["cra-", "E5", 3], ["zy, ", "C5", 3],
  ["all ", "A4", 1], ["for ", "B4", 1], ["the ", "C5", 1], ["love ", "D5", 2], ["of ", "E5", 1], ["you!", "D5", 5],
];
export function daisy(onNote, onDone) {
  const beat = 0.3, timers = [], gains = [];
  let stopped = false;
  (async () => {
    const c = await ready();
    if (stopped) return;
    let t = 0;
    const t0 = c ? c.currentTime + 0.05 : 0;
    DAISY.forEach(([, note, beats], i) => {
      timers.push(setTimeout(() => onNote(i), t * 1000));
      if (c) {
        const start = t0 + t, dur = beats * beat * 0.92, f = NOTE(note);
        const o = c.createOscillator(), g = c.createGain(), vib = c.createOscillator(), depth = c.createGain();
        o.type = "square"; o.frequency.value = f;
        vib.frequency.value = 5.5; depth.gain.value = f * 0.012;     // the wobble
        vib.connect(depth).connect(o.frequency);
        g.gain.setValueAtTime(0, start); g.gain.linearRampToValueAtTime(0.035, start + 0.03);
        g.gain.setValueAtTime(0.035, start + dur - 0.05); g.gain.linearRampToValueAtTime(0, start + dur);
        o.connect(g).connect(c.destination);
        o.start(start); o.stop(start + dur); vib.start(start); vib.stop(start + dur);
        gains.push(g);
      }
      t += beats * beat;
    });
    timers.push(setTimeout(onDone, t * 1000 + 400));
  })();
  return () => {
    stopped = true;
    timers.forEach(clearTimeout);
    // Silence the notes already scheduled.
    for (const g of gains) { try { g.gain.cancelScheduledValues(0); g.gain.value = 0; } catch {} }
  };
}
