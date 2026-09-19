// Synthesized sounds: IE's navigation click and a 56k modem connecting.
// Nothing plays until the user has interacted with the page.
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

export function navClick() {
  try {
    const c = audio();
    if (c.state !== "running") return;
    [0, 0.028].forEach(dt => tone([2600], c.currentTime + dt, 0.02, 0.04, "square"));
  } catch {}
}

const DTMF = { 1: [697, 1209], 2: [697, 1336], 3: [697, 1477], 4: [770, 1209], 5: [770, 1336], 6: [770, 1477], 7: [852, 1209], 8: [852, 1336], 9: [852, 1477], 0: [941, 1336] };

// Dial tone, the number, then the handshake. Returns its length in seconds.
export function modem(number = "5550142") {
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
