// Tiny pub/sub store shared between the mini-game and the live background.
// Lets the 3D background react to score, unlocks, hits, and active section.

type GameSnapshot = {
  hue: number;          // 0..360 dominant accent hue
  energy: number;       // 0..1 intensity (drives speed, particle count)
  pulse: number;        // monotonically increasing; bump on hit/unlock
  section: string;      // active section id
};

type Listener = (s: GameSnapshot) => void;

const state: GameSnapshot = { hue: 195, energy: 0.4, pulse: 0, section: "character" };
const listeners = new Set<Listener>();

export const gameBus = {
  get: () => state,
  set: (patch: Partial<GameSnapshot>) => {
    Object.assign(state, patch);
    listeners.forEach((l) => l(state));
  },
  pulse: () => {
    state.pulse += 1;
    listeners.forEach((l) => l(state));
  },
  subscribe: (l: Listener) => {
    listeners.add(l);
    l(state);
    return () => listeners.delete(l);
  },
};

// Section → hue map for the live color sync
export const SECTION_HUE: Record<string, number> = {
  character: 195,    // cyan
  quests: 280,       // violet
  skills: 160,       // mint
  achievements: 45,  // gold
  arcade: 330,       // magenta
  resume: 40,        // ember orange
  contact: 220,      // electric blue
};
