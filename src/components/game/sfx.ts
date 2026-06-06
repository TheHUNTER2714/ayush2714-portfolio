// Lightweight WebAudio synth — no asset downloads. Lazy-inits on first user
// gesture so browsers don't block autoplay. Supports stereo panning so the
// Phoenix sigil → door split timeline can feel spatial.

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
    master.gain.value = 0.2;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function bus(pan = 0): AudioNode {
  const c = ctx!;
  if (typeof (c as any).createStereoPanner === "function") {
    const p = c.createStereoPanner();
    p.pan.value = Math.max(-1, Math.min(1, pan));
    p.connect(master!);
    return p;
  }
  return master!;
}

function tone(
  freq: number,
  dur: number,
  type: OscillatorType = "square",
  glide?: number,
  vol = 0.5,
  pan = 0,
  attack = 0.008,
) {
  const c = ensure();
  if (!c || !master || muted) return;
  const out = bus(pan);
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, c.currentTime);
  if (glide) o.frequency.exponentialRampToValueAtTime(Math.max(40, glide), c.currentTime + dur);
  g.gain.setValueAtTime(0.0001, c.currentTime);
  g.gain.exponentialRampToValueAtTime(vol, c.currentTime + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.connect(g).connect(out);
  o.start();
  o.stop(c.currentTime + dur + 0.02);
}

function noise(dur: number, vol = 0.4, pan = 0, lowpass?: number) {
  const c = ensure();
  if (!c || !master || muted) return;
  const out = bus(pan);
  const buf = c.createBuffer(1, Math.max(1, Math.floor(c.sampleRate * dur)), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = c.createBufferSource();
  src.buffer = buf;
  const g = c.createGain();
  g.gain.value = vol;
  if (lowpass) {
    const f = c.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = lowpass;
    src.connect(f).connect(g).connect(out);
  } else {
    src.connect(g).connect(out);
  }
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

  // Phoenix sigil + door split timeline (spatial)
  spark:    (pan = 0) => {
    const base = 2400 + Math.random() * 1200;
    tone(base, 0.05, "triangle", base * 0.55, 0.22, pan, 0.004);
    noise(0.04, 0.12, pan, 4000);
  },
  charge:   () => {
    // deep rising drone, centered
    tone(120, 1.6, "sawtooth", 880, 0.3, 0, 0.4);
    setTimeout(() => tone(320, 1.4, "triangle", 1480, 0.22, 0, 0.3), 120);
    setTimeout(() => tone(60, 1.4, "sine", 180, 0.35), 0);
  },
  shockwave:() => {
    tone(70, 0.7, "sine", 28, 0.6, 0, 0.005);
    noise(0.45, 0.45, -0.6, 1200);
    setTimeout(() => noise(0.45, 0.45, 0.6, 1200), 30);
  },
  ignition: () => {
    // big centered crack
    noise(0.6, 0.6, 0, 6000);
    tone(110, 0.55, "sawtooth", 1400, 0.6, 0, 0.003);
    setTimeout(() => tone(1980, 0.25, "triangle", 2800, 0.45, -0.3, 0.003), 50);
    setTimeout(() => tone(1760, 0.25, "triangle", 2640, 0.45, 0.3, 0.003), 80);
    setTimeout(() => tone(660, 0.6, "square", 110, 0.32), 140);
  },
  doorRumble:() => {
    tone(48, 1.4, "sawtooth", 32, 0.55, 0, 0.05);
    noise(1.1, 0.35, -0.7, 600);
    setTimeout(() => noise(1.1, 0.35, 0.7, 600), 40);
  },
};
