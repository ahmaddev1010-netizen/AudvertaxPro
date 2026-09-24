"use client";

import { useEffect, useState } from "react";
import styles from "./Preloader.module.css";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "exiting" | "done">("loading");

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const duration = 1100;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setPhase("exiting");
        window.setTimeout(() => setPhase("done"), 720);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (phase === "done") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Audvertax"
      className={`${styles.preloader} ${phase === "exiting" ? styles["preloader--exiting"] : ""}`}
    >
      <div className={styles.preloader__background} />
      <div className={styles.preloader__grid} />
      <div className={styles.preloader__content}>
        <p className={styles.preloader__progress}>
          <span>{progress}</span>
          <span className={styles.preloader__percent}>%</span>
        </p>
        <p className={styles.preloader__status}>Activating your U.S. presence</p>
      </div>
      <span className="sr-only">Loading the Audvertax experience…</span>
    </div>
  );
}
