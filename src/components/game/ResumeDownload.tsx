import { motion } from "framer-motion";
import { Download, FileText, Sparkles } from "lucide-react";
import resumeAsset from "@/assets/resume.doc.asset.json";

const STATS = [
  { l: "PROJECTS", v: "12+" },
  { l: "CERTS", v: "2x OCI" },
  { l: "HACKATHONS", v: "1st" },
  { l: "OSS", v: "GSSoC" },
];

export function ResumeDownload() {
  return (
    <section className="min-h-[80vh] px-6 md:px-16 pt-32 pb-24 relative overflow-hidden grid place-items-center">
      {/* layered ambient */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute left-1/2 top-1/2 w-[640px] h-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-30"
          style={{ background: "conic-gradient(from 0deg, oklch(0.85 0.22 40 / 0.6), oklch(0.78 0.28 330 / 0.6), oklch(0.78 0.18 195 / 0.6), oklch(0.85 0.22 40 / 0.6))" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: "linear-gradient(oklch(0.82 0.18 195) 1px, transparent 1px), linear-gradient(90deg, oklch(0.82 0.18 195) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse at center, black 25%, transparent 75%)",
        }} />
      </div>

      <div className="max-w-3xl w-full relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="font-mono text-xs text-primary mb-2 animate-flicker">▸ LOOT_DROP.bin // RARE ITEM UNLOCKED</div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-glow">
            GRAB THE <span className="text-accent text-glow-accent">DOSSIER</span>
          </h2>
          <p className="mt-3 text-foreground/75 max-w-xl mx-auto">
            One scroll, every campaign. Download the full résumé — projects, certifications, achievements, contact.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, rotateX: -8 }}
          whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -6 }}
          className="corner-frame box-glow relative bg-card/80 backdrop-blur-xl p-7 md:p-10 overflow-hidden"
          style={{
            transformStyle: "preserve-3d",
            boxShadow: "0 0 0 1px oklch(0.82 0.18 195 / 0.3), 0 30px 80px -30px oklch(0.78 0.28 330 / 0.5), inset 0 0 80px -40px oklch(0.85 0.22 40 / 0.6)",
          }}
        >
          <span className="c-bl" /><span className="c-br" />

          {/* rotating conic ring */}
          <motion.div
            aria-hidden
            className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-40 pointer-events-none"
            style={{ background: "conic-gradient(from 0deg, oklch(0.85 0.22 40 / 0.7), transparent 35%)" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />

          {/* scan line */}
          <motion.div
            aria-hidden
            className="absolute inset-x-0 h-12 pointer-events-none"
            style={{ background: "linear-gradient(180deg, transparent, oklch(0.82 0.18 195 / 0.18), transparent)" }}
            animate={{ y: ["-20%", "120%"] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
          />

          <div className="relative grid md:grid-cols-[auto_1fr] gap-6 items-center">
            {/* document mockup */}
            <motion.div
              className="relative mx-auto"
              whileHover={{ rotate: -3, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="relative w-32 h-40 md:w-36 md:h-48 rounded-sm bg-gradient-to-br from-background to-secondary border border-primary/40 shadow-[0_10px_30px_-10px_oklch(0.78_0.28_330/_0.6)] overflow-hidden">
                <div className="absolute inset-0 p-3 space-y-1.5">
                  <div className="h-2 w-2/3 bg-primary/70 rounded-sm" />
                  <div className="h-1 w-full bg-foreground/30 rounded-sm" />
                  <div className="h-1 w-5/6 bg-foreground/20 rounded-sm" />
                  <div className="h-1 w-4/6 bg-foreground/20 rounded-sm" />
                  <div className="h-2 w-1/2 bg-accent/70 rounded-sm mt-3" />
                  <div className="h-1 w-full bg-foreground/20 rounded-sm" />
                  <div className="h-1 w-3/4 bg-foreground/20 rounded-sm" />
                  <div className="h-1 w-2/3 bg-foreground/20 rounded-sm" />
                  <div className="h-2 w-2/5 bg-[var(--legendary)]/70 rounded-sm mt-3" />
                  <div className="h-1 w-full bg-foreground/20 rounded-sm" />
                  <div className="h-1 w-4/5 bg-foreground/20 rounded-sm" />
                </div>
                <motion.div
                  aria-hidden
                  className="absolute inset-x-0 h-6"
                  style={{ background: "linear-gradient(180deg, transparent, oklch(0.82 0.18 195 / 0.4), transparent)" }}
                  animate={{ y: [-30, 200] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <motion.div
                aria-hidden
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full grid place-items-center bg-[var(--legendary)] text-background"
                animate={{ rotate: [0, 12, 0, -12, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
            </motion.div>

            <div>
              <div className="font-mono text-[10px] text-accent tracking-[0.3em] mb-1">▸ ITEM TYPE — ARTIFACT · LEGENDARY</div>
              <div className="font-display text-2xl md:text-3xl text-primary text-glow leading-tight">
                Ayush Agnihotri — Résumé
              </div>
              <div className="font-mono text-[11px] text-muted-foreground mt-1">
                .doc · {(resumeAsset.size / 1024).toFixed(1)} KB · updated 2025
              </div>

              <div className="grid grid-cols-4 gap-2 mt-4">
                {STATS.map((s, i) => (
                  <motion.div
                    key={s.l}
                    initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="text-center border border-primary/30 py-1.5 bg-background/40"
                  >
                    <div className="font-display text-sm text-primary">{s.v}</div>
                    <div className="font-mono text-[8px] text-muted-foreground tracking-widest">{s.l}</div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <motion.a
                  href={resumeAsset.url}
                  download="Ayush_Agnihotri_Resume.doc"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative inline-flex items-center gap-2 px-5 py-3 font-display tracking-widest text-xs text-background bg-gradient-to-r from-[oklch(0.85_0.22_40)] via-[oklch(0.82_0.18_195)] to-[oklch(0.78_0.28_330)] overflow-hidden group"
                  style={{
                    clipPath: "polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)",
                    boxShadow: "0 8px 30px -8px oklch(0.82 0.18 195 / 0.6)",
                  }}
                >
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.5) 50%, transparent 65%)" }}
                  />
                  <Download className="w-4 h-4 relative" />
                  <span className="relative">DOWNLOAD RESUME</span>
                </motion.a>

                <a
                  href={resumeAsset.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3 font-mono text-[11px] text-primary border border-primary/50 hover:bg-primary/10 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  PREVIEW IN NEW TAB
                </a>
              </div>

              <div className="font-mono text-[10px] text-muted-foreground mt-3">
                ▸ tip: drop into ATS · works in Word, Pages, Google Docs
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
