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

// Dial tone, the number, then the handshake. Returns its length in seconds.
export function modem(number = "5550142") {
  if (ui.muted) return 0;
  try {
    const c = audio();
    if (c.state !== "running") return 0;
    let t = c.currentTime + 0.05;
    tone([350, 440], t, 0.9, 0.04); t += 1;
    for (const d of number) { tone(DTMF[d], t, 0.09, 0.05); t += 0.14; }
    t += 0.6;
    tone([2100], t, 1.2, 0.035); t += 1.25;                          // answer tone
    for (let i = 0; i < 6; i++) tone([1200 + (i % 2) * 1200], t + i * 0.12, 0.1, 0.03, "square");
    t += 0.8;
    tone([980, 1650], t, 0.5, 0.025, "sawtooth"); t += 0.5;          // the famous "bong"
    noise(t, 0.4, 0.05, 1200); tone([2250], t, 0.4, 0.02); t += 0.45;
    noise(t, 1.6, 0.06, 1800); t += 1.6;                              // scrambled training hiss
    return t - c.currentTime;
  } catch { return 0; }
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
