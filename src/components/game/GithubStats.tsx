import { motion, animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type User = {
  avatar_url: string; name: string | null; bio: string | null;
  public_repos: number; followers: number; following: number; html_url: string;
};
type Repo = {
  id: number; name: string; html_url: string; description: string | null;
  stargazers_count: number; forks_count: number; language: string | null; pushed_at: string;
};

const USERNAME = "thehunter2714";

function CountUp({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.4, ease: "easeOut", onUpdate: (n) => setV(Math.round(n)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref} className={className}>{v.toLocaleString()}</span>;
}

const STORY = [
  "▸ uplink established · handshake OK",
  "▸ pulling commit telemetry from origin/main",
  "▸ decrypting repo constellation · 6 nodes",
  "▸ rendering activity heatmap · 365d window",
  "▸ broadcasting live feed · 0 dropped frames",
  "▸ signal locked · streaming @ 60fps",
];


export function GithubStats() {
  const [user, setUser] = useState<User | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [story, setStory] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStory((s) => (s + 1) % STORY.length), 1800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [u, r] = await Promise.all([
          fetch(`https://api.github.com/users/${USERNAME}`).then((x) => x.json()),
          fetch(`https://api.github.com/users/${USERNAME}/repos?sort=pushed&per_page=6`).then((x) => x.json()),
        ]);
        if (cancelled) return;
        if (u?.message) throw new Error(u.message);
        setUser(u); setRepos(Array.isArray(r) ? r : []);
      } catch (e) {
        if (!cancelled) setErr((e as Error).message);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const stars = repos.reduce((a, r) => a + (r.stargazers_count || 0), 0);
  const forks = repos.reduce((a, r) => a + (r.forks_count || 0), 0);
  const langs = Array.from(new Set(repos.map((r) => r.language).filter(Boolean))) as string[];

  return (
    <section className="min-h-screen px-6 md:px-16 pt-32 pb-32 relative">
      {/* ambient telemetry grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.82 0.18 195) 1px, transparent 1px), linear-gradient(90deg, oklch(0.82 0.18 195) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <div className="max-w-6xl mx-auto relative">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6">
          <div className="font-mono text-xs text-primary mb-2 flex items-center gap-2">
            <motion.span
              className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--hp)]"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            LIVE_FEED // github.com/{USERNAME}
          </div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-glow">
            REPO <span className="text-accent text-glow-accent">TELEMETRY</span>
          </h2>
          <motion.div
            className="mt-2 h-[2px] origin-left"
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            style={{ background: "linear-gradient(90deg, var(--primary), var(--accent), transparent)" }}
          />
          {/* storytelling ticker */}
          <div className="mt-3 h-5 overflow-hidden font-mono text-[11px] text-accent/90 corner-frame bg-card/40 px-3 py-0.5 inline-block">
            <span className="c-bl" /><span className="c-br" />
            <motion.div animate={{ y: -story * 20 }} transition={{ duration: 0.5, ease: "easeInOut" }}>
              {STORY.concat(STORY[0]).map((s, i) => (
                <div key={i} className="h-5 leading-5">{s}</div>
              ))}
            </motion.div>
          </div>
        </motion.div>


        {err && <div className="font-mono text-xs text-[var(--hp)] mb-4">▸ feed error: {err}</div>}

        {/* metrics strip */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
        >
          {[
            { l: "REPOS", v: user?.public_repos ?? 0, c: "var(--hud)" },
            { l: "STARS", v: stars, c: "var(--legendary)" },
            { l: "FORKS", v: forks, c: "var(--xp)" },
            { l: "FOLLOWERS", v: user?.followers ?? 0, c: "var(--mp)" },
          ].map((s, i) => (
            <motion.div key={s.l}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="corner-frame bg-card/80 backdrop-blur p-3 relative overflow-hidden"
            >
              <span className="c-bl" /><span className="c-br" />
              <div className="font-display text-2xl" style={{ color: s.c, textShadow: `0 0 12px ${s.c}66` }}>
                <CountUp to={s.v} />
              </div>
              <div className="font-mono text-[10px] text-muted-foreground mt-1 tracking-widest">{s.l}</div>
              <motion.div
                className="absolute inset-x-0 bottom-0 h-[2px]"
                initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                transition={{ duration: 1.2, delay: i * 0.1 }}
                style={{ background: `linear-gradient(90deg, transparent, ${s.c}, transparent)`, transformOrigin: "left" }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* lang chips */}
        {langs.length > 0 && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex flex-wrap gap-2 mb-6">
            {langs.map((l, i) => (
              <motion.span
                key={l}
                initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="font-mono text-[10px] px-2 py-1 border border-primary/40 text-primary"
                style={{ boxShadow: "0 0 10px oklch(0.78 0.18 195 / 0.25)" }}
              >
                {l}
              </motion.span>
            ))}
          </motion.div>
        )}

        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Profile card */}
          <motion.a
            href={user?.html_url ?? `https://github.com/${USERNAME}`} target="_blank" rel="noreferrer"
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="corner-frame box-glow bg-card backdrop-blur p-5 h-fit block hover:scale-[1.02] transition relative overflow-hidden"
          >
            <span className="c-bl" /><span className="c-br" />
            {/* radar sweep */}
            <motion.div
              className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: "conic-gradient(from 0deg, oklch(0.78 0.18 195 / 0.35), transparent 30%)" }}
              animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
            {user ? (
              <>
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <img src={user.avatar_url} alt={USERNAME} className="w-full h-full object-cover"
                    style={{ clipPath: "polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)" }} />
                  <div className="absolute inset-0 ring-2 ring-primary"
                    style={{ clipPath: "polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)" }} />
                </div>
                <div className="text-center font-display text-primary text-glow text-sm">@{USERNAME}</div>
                <div className="text-center font-mono text-[10px] text-muted-foreground mt-1">{user.name ?? "—"}</div>
                {user.bio && <p className="text-[12px] text-foreground/75 text-center mt-3">{user.bio}</p>}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  {[
                    { l: "REPOS", v: user.public_repos },
                    { l: "STARS", v: stars },
                    { l: "FOLLOW", v: user.followers },
                  ].map((s) => (
                    <div key={s.l}>
                      <div className="font-display text-xl text-accent"><CountUp to={s.v} /></div>
                      <div className="font-mono text-[9px] text-muted-foreground">{s.l}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="font-mono text-xs text-muted-foreground animate-pulse text-center py-12">▸ syncing feed...</div>
            )}
          </motion.a>

          {/* Repo grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {(repos.length ? repos : Array.from({ length: 4 })).map((r, i) => {
              if (!r) return (
                <div key={i} className="corner-frame bg-card/60 backdrop-blur p-4 h-32 animate-pulse">
                  <span className="c-bl" /><span className="c-br" />
                </div>
              );
              const repo = r as Repo;
              const ageDays = Math.max(1, Math.floor((Date.now() - new Date(repo.pushed_at).getTime()) / 86400000));
              const activity = Math.min(100, Math.round(120 / Math.log2(ageDays + 2)));
              return (
                <motion.a
                  key={repo.id}
                  href={repo.html_url} target="_blank" rel="noreferrer"
                  initial={{ opacity: 0, y: 16, rotateX: -10 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.55 }}
                  whileHover={{ y: -4 }}
                  className="corner-frame bg-card backdrop-blur p-4 block transition relative overflow-hidden group"
                >
                  <span className="c-bl" /><span className="c-br" />
                  {/* hover sweep */}
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "linear-gradient(110deg, transparent 35%, oklch(0.78 0.18 195 / 0.18) 50%, transparent 65%)" }}
                  />
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-display text-sm text-primary text-glow truncate">{repo.name}</h4>
                    <span className="font-mono text-[10px] text-[var(--legendary)]">★ {repo.stargazers_count}</span>
                  </div>
                  <p className="text-[11.5px] text-foreground/70 mt-1.5 line-clamp-2 min-h-[2.5em]">
                    {repo.description ?? "—"}
                  </p>
                  <div className="flex items-center justify-between mt-3 font-mono text-[10px]">
                    <span className="text-accent">{repo.language ?? "txt"}</span>
                    <span className="text-muted-foreground">⑂ {repo.forks_count}</span>
                  </div>
                  {/* activity bar */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between font-mono text-[9px] text-muted-foreground">
                      <span>ACTIVITY</span><span>{ageDays}d ago</span>
                    </div>
                    <div className="h-1 bg-secondary/60 mt-1 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} whileInView={{ width: `${activity}%` }} viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: i * 0.08, ease: "easeOut" }}
                        className="h-full"
                        style={{ background: "linear-gradient(90deg, var(--hud), var(--legendary))" }}
                      />
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
