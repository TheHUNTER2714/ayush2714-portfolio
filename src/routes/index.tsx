import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { GameBackground } from "@/components/game/GameBackground";
import { HUD } from "@/components/game/HUD";
import { BootScreen } from "@/components/game/BootScreen";
import { Character } from "@/components/game/Character";
import { Quests } from "@/components/game/Quests";
import { SkillTree } from "@/components/game/SkillTree";
import { Achievements } from "@/components/game/Achievements";
import { MiniGame } from "@/components/game/MiniGame";
import { Contact } from "@/components/game/Contact";
import { PlayInvite } from "@/components/game/PlayInvite";
import { SectionTransition } from "@/components/game/SectionTransition";
import { gameBus, SECTION_HUE } from "@/components/game/gameState";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ayush Agnihotri — Full-Stack Developer · Playable Portfolio" },
      { name: "description", content: "Video-game-inspired portfolio of Ayush Agnihotri: quests, skill tree, trophy vault, and a playable Space Invaders mini-game that unlocks the bio." },
      { property: "og:title", content: "Ayush Agnihotri — Playable Portfolio" },
      { property: "og:description", content: "Shoot the invaders to unlock my bio. Full-Stack Dev · AI Enthusiast · Kanpur, IN." },
    ],
  }),
  component: Index,
});

const SECTIONS = [
  { id: "character",    label: "NEON_GRID — SECTOR 01" },
  { id: "quests",       label: "QUEST HALL — SECTOR 02" },
  { id: "skills",       label: "ABILITY CORE — SECTOR 03" },
  { id: "achievements", label: "TROPHY VAULT — SECTOR 04" },
  { id: "arcade",       label: "ARCADE — SECTOR 05" },
  { id: "contact",      label: "SAVE POINT — SECTOR 06" },
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
      {booted && <PlayInvite active={active} onJump={() => scrollTo("arcade")} />}

      <div className="relative">
        {SECTIONS.map((s) => (
          <div key={s.id} id={s.id} ref={(el) => { refs.current[s.id] = el; }}>
            <SectionTransition>
              {s.id === "character" && <Character />}
              {s.id === "quests" && <Quests />}
              {s.id === "skills" && <SkillTree />}
              {s.id === "achievements" && <Achievements />}
              {s.id === "arcade" && <MiniGame />}
              {s.id === "contact" && <Contact />}
            </SectionTransition>
          </div>
        ))}
      </div>
    </main>
  );
}
