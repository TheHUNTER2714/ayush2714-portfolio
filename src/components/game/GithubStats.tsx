import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type User = {
  avatar_url: string; name: string | null; bio: string | null;
  public_repos: number; followers: number; following: number; html_url: string;
};
type Repo = {
  id: number; name: string; html_url: string; description: string | null;
  stargazers_count: number; forks_count: number; language: string | null; pushed_at: string;
};

const USERNAME = "thehunter2714";

export function GithubStats() {
  const [user, setUser] = useState<User | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [err, setErr] = useState<string | null>(null);

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

  return (
    <section className="min-h-screen px-6 md:px-16 pt-32 pb-32">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <div className="font-mono text-xs text-primary mb-2">▸ LIVE_FEED // github.com/{USERNAME}</div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-glow">REPO <span className="text-accent text-glow-accent">TELEMETRY</span></h2>
        </motion.div>

        {err && <div className="font-mono text-xs text-[var(--hp)]">▸ feed error: {err}</div>}

        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Profile card */}
          <motion.a
            href={user?.html_url ?? `https://github.com/${USERNAME}`} target="_blank" rel="noreferrer"
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="corner-frame box-glow bg-card backdrop-blur p-5 h-fit block hover:scale-[1.02] transition"
          >
            <span className="c-bl" /><span className="c-br" />
            {user ? (
              <>
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <img
                    src={user.avatar_url}
                    alt={USERNAME}
                    className="w-full h-full object-cover"
                    style={{ clipPath: "polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)" }}
                  />
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
                      <div className="font-display text-xl text-accent">{s.v}</div>
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
              return (
                <motion.a
                  key={repo.id}
                  href={repo.html_url} target="_blank" rel="noreferrer"
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -4 }}
                  className="corner-frame bg-card backdrop-blur p-4 block transition"
                >
                  <span className="c-bl" /><span className="c-br" />
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
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
