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

import { PhaseTracker } from "@/components/game/PhaseTracker";
import { SectionTransition } from "@/components/game/SectionTransition";
import { gameBus, SECTION_HUE } from "@/components/game/gameState";
import { Terminal } from "@/components/game/Terminal";
import { GithubStats } from "@/components/game/GithubStats";
import { AIAssistant } from "@/components/game/AIAssistant";
import { World3D } from "@/components/game/World3D";
import { ScrollFalcon } from "@/components/game/ScrollFalcon";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ayush Agnihotri — THEHUNTER2714 · Playable Portfolio" },
      { name: "description", content: "Arcade portfolio of Ayush Agnihotri (THEHUNTER2714): cinematic intro, skill tree, quests, terminal, live GitHub feed, AI co-pilot, 3D world, and mini-games." },
      { property: "og:title", content: "THEHUNTER2714 — Ayush Agnihotri's Playable Portfolio" },
      { property: "og:description", content: "Full-stack dev · AI · Falcon-themed arcade portfolio with terminal, AI co-pilot, and 3D world." },
    ],
  }),
  component: Index,
});

const SECTIONS = [
  { id: "character",    label: "NEON_GRID — SECTOR 01" },
  { id: "quests",       label: "QUEST HALL — SECTOR 02" },
  { id: "skills",       label: "ABILITY CORE — SECTOR 03" },
  { id: "world",        label: "3D NEBULA — SECTOR 04" },
  { id: "achievements", label: "TROPHY VAULT — SECTOR 05" },
  { id: "github",       label: "REPO TELEMETRY — SECTOR 06" },
  { id: "terminal",     label: "/dev/falcon-shell — SECTOR 07" },
  { id: "ai",           label: "FALCON_AI — SECTOR 08" },
  { id: "arcade",       label: "ARCADE — SECTOR 09" },
  { id: "contact",      label: "SAVE POINT — SECTOR 10" },
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

  useEffect(() => {
    gameBus.set({ section: active, hue: SECTION_HUE[active] ?? 195 });
  }, [active]);

  const scrollTo = (id: string) => {
    refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const zone = SECTIONS.find((s) => s.id === active)?.label ?? SECTIONS[0].label;

  return (
    <main className="relative min-h-screen text-foreground">
      <GameBackground />
      {!booted && <BootScreen onDone={() => setBooted(true)} />}

      {booted && <HUD level={42} zone={zone} active={active} onNav={scrollTo} />}
      {booted && <PhaseTracker />}
      
      {booted && <ScrollFalcon />}

      <div className="relative">
        {SECTIONS.map((s) => (
          <div key={s.id} id={s.id} ref={(el) => { refs.current[s.id] = el; }}>
            <SectionTransition>
              {s.id === "character" && <Character booted={booted} />}
              {s.id === "quests" && <Quests />}
              {s.id === "skills" && <SkillTree />}
              {s.id === "world" && <World3D />}
              {s.id === "achievements" && <Achievements />}
              {s.id === "github" && <GithubStats />}
              {s.id === "terminal" && <Terminal />}
              {s.id === "ai" && <AIAssistant />}
              {s.id === "arcade" && <MiniGame />}
              {s.id === "contact" && <Contact />}
            </SectionTransition>
          </div>
        ))}
      </div>
    </main>
  );
}
