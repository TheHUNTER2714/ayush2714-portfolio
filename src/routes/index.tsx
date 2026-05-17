import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { GameBackground } from "@/components/game/GameBackground";
import { HUD } from "@/components/game/HUD";
import { BootScreen } from "@/components/game/BootScreen";
import { Character } from "@/components/game/Character";
import { Quests } from "@/components/game/Quests";
import { SkillTree } from "@/components/game/SkillTree";
import { Achievements } from "@/components/game/Achievements";
import { Contact } from "@/components/game/Contact";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alex Kairos — Creative Engineer · Portfolio" },
      { name: "description", content: "A video-game-inspired portfolio: quests, skill tree, achievement vault. Built for motion-first interactive products." },
      { property: "og:title", content: "Alex Kairos — Creative Engineer" },
      { property: "og:description", content: "Interactive game-style portfolio with a live animated HUD." },
    ],
  }),
  component: Index,
});

const SECTIONS = [
  { id: "character", label: "NEON_GRID — SECTOR 01" },
  { id: "quests", label: "QUEST HALL — SECTOR 02" },
  { id: "skills", label: "ABILITY CORE — SECTOR 03" },
  { id: "achievements", label: "TROPHY VAULT — SECTOR 04" },
  { id: "contact", label: "SAVE POINT — SECTOR 05" },
];

function Index() {
  const [booted, setBooted] = useState(false);
  const [active, setActive] = useState("character");
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!booted) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { threshold: [0.35, 0.6] }
    );
    SECTIONS.forEach((s) => { const el = refs.current[s.id]; if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [booted]);

  const scrollTo = (id: string) => {
    refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const zone = SECTIONS.find((s) => s.id === active)?.label ?? SECTIONS[0].label;

  return (
    <main className="relative min-h-screen text-foreground">
      <GameBackground />
      {!booted && <BootScreen onDone={() => setBooted(true)} />}

      {booted && <HUD level={37} zone={zone} active={active} onNav={scrollTo} />}

      <div className="relative">
        {SECTIONS.map((s) => (
          <div key={s.id} id={s.id} ref={(el) => { refs.current[s.id] = el; }}>
            {s.id === "character" && <Character />}
            {s.id === "quests" && <Quests />}
            {s.id === "skills" && <SkillTree />}
            {s.id === "achievements" && <Achievements />}
            {s.id === "contact" && <Contact />}
          </div>
        ))}
      </div>
    </main>
  );
}
