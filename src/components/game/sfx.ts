// Lightweight WebAudio synth — no asset downloads. Lazy-inits on first user
// gesture so browsers don't block autoplay.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;

function ensure() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.18;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq: number, dur: number, type: OscillatorType = "square", glide?: number, vol = 0.5) {
  const c = ensure();
  if (!c || !master || muted) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, c.currentTime);
  if (glide) o.frequency.exponentialRampToValueAtTime(Math.max(40, glide), c.currentTime + dur);
  g.gain.setValueAtTime(0.0001, c.currentTime);
  g.gain.exponentialRampToValueAtTime(vol, c.currentTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.connect(g).connect(master);
  o.start();
  o.stop(c.currentTime + dur + 0.02);
}

function noise(dur: number, vol = 0.4) {
  const c = ensure();
  if (!c || !master || muted) return;
  const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = c.createBufferSource();
  src.buffer = buf;
  const g = c.createGain();
  g.gain.value = vol;
  src.connect(g).connect(master);
  src.start();
}

export const sfx = {
  setMuted: (m: boolean) => { muted = m; },
  isMuted: () => muted,
  resume: () => { ensure(); },
  fire:    () => tone(880, 0.08, "square", 220, 0.35),
  hit:     () => { tone(180, 0.12, "sawtooth", 60, 0.5); noise(0.08, 0.25); },
  unlock:  () => { tone(660, 0.09, "triangle", 990, 0.45); setTimeout(() => tone(990, 0.12, "triangle", 1320, 0.4), 70); },
  start:   () => { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.12, "square", undefined, 0.35), i * 80)); },
  win:     () => { [523, 659, 784, 988, 1318].forEach((f, i) => setTimeout(() => tone(f, 0.16, "triangle", undefined, 0.4), i * 110)); },
  lose:    () => { [330, 262, 196, 147].forEach((f, i) => setTimeout(() => tone(f, 0.2, "sawtooth", undefined, 0.4), i * 130)); },
  type:    () => tone(1200 + Math.random() * 400, 0.018, "square", undefined, 0.12),
  ui:      () => tone(720, 0.05, "triangle", 540, 0.25),
};
