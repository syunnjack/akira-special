"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Attempt = { id: number; ms: number; success: boolean; reason: string };
type Held = { k: boolean; g: boolean; kAt: number | null; gAt: number | null };

const FRAME_MS = 1000 / 60;
const initialHeld: Held = { k: false, g: false, kAt: null, gAt: null };

export default function Home() {
  const [held, setHeld] = useState<Held>(initialHeld);
  const heldRef = useRef<Held>(initialHeld);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [strict, setStrict] = useState(true);
  const [ready, setReady] = useState(false);
  const [padLabels, setPadLabels] = useState<[number | null, number | null]>([null, null]);
  const padPrev = useRef<boolean[]>([]);
  const attemptId = useRef(0);

  const updateHeld = useCallback((next: Held) => {
    heldRef.current = next;
    setHeld(next);
  }, []);

  const press = useCallback((button: "k" | "g", at = performance.now()) => {
    const now = heldRef.current;
    if (now[button]) return;
    const next = { ...now, [button]: true, [`${button}At`]: at } as Held;
    updateHeld(next);
    if (next.k && next.g) setReady(true);
  }, [updateHeld]);

  const release = useCallback((button: "k" | "g", at = performance.now()) => {
    const now = heldRef.current;
    if (!now[button]) return;
    if (button === "g" && now.gAt !== null) {
      const ms = at - now.gAt;
      const together = now.kAt !== null && Math.abs(now.gAt - now.kAt) <= (strict ? FRAME_MS : FRAME_MS * 2);
      const success = now.k && together && ms <= (strict ? FRAME_MS : FRAME_MS * 1.5);
      const reason = !now.k ? "K繧る屬繧後※縺・∪縺・ : !together ? "蜷梧凾謚ｼ縺励′縺壹ｌ縺ｦ縺・∪縺・ : ms > (strict ? FRAME_MS : FRAME_MS * 1.5) ? "G繧帝屬縺吶・縺碁≦縺・ : "1F繝ｪ繝ｪ繝ｼ繧ｹ謌仙粥";
      setAttempts((prev) => [{ id: ++attemptId.current, ms, success, reason }, ...prev].slice(0, 10));
      setReady(false);
    }
    updateHeld({ ...now, [button]: false, [`${button}At`]: null } as Held);
  }, [strict, updateHeld]);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (event.code === "KeyJ") { event.preventDefault(); press("k"); }
      if (event.code === "KeyK") { event.preventDefault(); press("g"); }
      if (event.code === "Space") { event.preventDefault(); setAttempts([]); }
    };
    const up = (event: KeyboardEvent) => {
      if (event.code === "KeyJ") release("k");
      if (event.code === "KeyK") release("g");
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, [press, release]);

  useEffect(() => {
    let frame = 0;
    const poll = () => {
      const pad = navigator.getGamepads?.()[0];
      if (pad) {
        const current = pad.buttons.map((b) => b.pressed);
        const newlyPressed = current.map((v, i) => v && !padPrev.current[i]).map((v, i) => v ? i : -1).filter((i) => i >= 0);
        setPadLabels((labels) => {
          let next = labels;
          for (const index of newlyPressed) {
            if (next[0] === null) next = [index, next[1]];
            else if (next[1] === null && index !== next[0]) next = [next[0], index];
          }
          return next;
        });
        const [kButton, gButton] = padLabels;
        if (kButton !== null) current[kButton] ? press("k") : release("k");
        if (gButton !== null) current[gButton] ? press("g") : release("g");
        padPrev.current = current;
      }
      frame = requestAnimationFrame(poll);
    };
    frame = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(frame);
  }, [padLabels, press, release]);

  const stats = useMemo(() => {
    const success = attempts.filter((a) => a.success).length;
    const average = attempts.length ? attempts.reduce((sum, a) => sum + a.ms, 0) / attempts.length : 0;
    return { success, rate: attempts.length ? Math.round(success / attempts.length * 100) : 0, average };
  }, [attempts]);
  const latest = attempts[0];

  const touchProps = (button: "k" | "g") => ({
    onPointerDown: (e: React.PointerEvent) => { e.currentTarget.setPointerCapture(e.pointerId); press(button); },
    onPointerUp: () => release(button),
    onPointerCancel: () => release(button),
  });

  return (
    <main>
      <header className="topbar"><span className="brand-mark">邨・/span><span>AKIRA // INPUT LAB</span><span className="version">VF5 R.E.V.O. WS ﾂｷ 60 FPS</span></header>
      <section className="hero">
        <div className="eyebrow">謠占・蠑ｾ閻ｿ / TEISHITSU DANTAI</div>
        <h1>1繝輔Ξ繝ｼ繝繧偵・br/><em>隕九∴繧区橿陦・/em>縺ｫ縲・/h1>
        <p>縲桑+G繧貞酔譎よ款縺励；縺縺・F縺ｧ髮｢縺吶阪ｒ逕溷・蜉帙〒險域ｸｬ縲ゅご繝ｼ繝縺ｫ謗･邯壹○縺壹∵焔蜈・・邊ｾ蠎ｦ縺縺代ｒ骰帙∴繧九・/p>
      </section>

      <section className="lab" aria-label="蜈･蜉帷ｷｴ鄙・>
        <div className="command-strip"><span>COMMAND</span><b>K</b><i>+</i><b>G</b><span className="arrow">竊・/span><b className="release-key">G</b><small>RELEASE 竕､ {strict ? "16.7" : "25.0"} ms</small></div>
        <div className="workbench">
          <div className="input-zone">
            <div className="status-line"><span className={`status-dot ${ready ? "live" : ""}`}/>{ready ? "NOW 窶・G縺縺鷹屬縺・ : held.k || held.g ? "繧ゅ≧荳譁ｹ繧よ款縺・ : "READY 窶・K + G 繧呈款縺・}</div>
            <div className="buttons">
              <button className={`practice-button k-button ${held.k ? "held" : ""}`} {...touchProps("k")}><small>KICK</small><strong>K</strong><span>Keyboard J{padLabels[0] !== null ? ` ﾂｷ Pad ${padLabels[0]}` : ""}</span></button>
              <div className="plus">+</div>
              <button className={`practice-button g-button ${held.g ? "held" : ""}`} {...touchProps("g")}><small>GUARD</small><strong>G</strong><span>Keyboard K{padLabels[1] !== null ? ` ﾂｷ Pad ${padLabels[1]}` : ""}</span></button>
            </div>
            <p className="hint">繧ｲ繝ｼ繝繝代ャ繝峨・莉ｻ諢上・2繝懊ち繝ｳ繧帝・↓謚ｼ縺吶→閾ｪ蜍募牡繧雁ｽ薙※縲ょ・謗･邯壹〒繝ｪ繧ｻ繝・ヨ縲・/p>
          </div>
          <div className={`verdict ${latest ? (latest.success ? "success" : "fail") : "idle"}`}>
            <span className="verdict-label">LAST INPUT</span>
            <strong>{latest ? latest.ms.toFixed(1) : "窶・}<small> ms</small></strong>
            <span className="frames">{latest ? (latest.ms / FRAME_MS).toFixed(2) : "窶・} FRAME</span>
            <p>{latest ? latest.reason : "蜈･蜉帛ｾ・■"}</p>
          </div>
        </div>
      </section>

      <section className="dashboard">
        <div className="stats">
          <article><span>SUCCESS RATE</span><strong>{stats.rate}<small>%</small></strong><div className="meter"><i style={{width: `${stats.rate}%`}}/></div></article>
          <article><span>CLEAN INPUTS</span><strong>{stats.success}<small> / {attempts.length || 0}</small></strong></article>
          <article><span>AVG RELEASE</span><strong>{attempts.length ? stats.average.toFixed(1) : "窶・}<small> ms</small></strong></article>
        </div>
        <div className="history">
          <div className="history-head"><h2>逶ｴ霑・0蝗・/h2><button onClick={() => setAttempts([])}>SPACE / RESET</button></div>
          {attempts.length === 0 ? <p className="empty">縺ｾ縺繝・・繧ｿ縺後≠繧翫∪縺帙ｓ縲・+G縺九ｉ蟋九ａ縺ｾ縺励ｇ縺・・/p> : attempts.map((a, index) => <div className="history-row" key={a.id}><span>{String(attempts.length - index).padStart(2, "0")}</span><div><i className={a.success ? "ok" : "ng"} style={{width: `${Math.min(100, a.ms / 40 * 100)}%`}}/></div><b>{a.ms.toFixed(1)} ms</b><em>{a.success ? "CLEAN" : "MISS"}</em></div>)}
        </div>
      </section>

      <footer><div><b>蛻､螳夊ｨｭ螳・/b><button className={strict ? "selected" : ""} onClick={() => setStrict(true)}>螳滓姶 1F</button><button className={!strict ? "selected" : ""} onClick={() => setStrict(false)}>邱ｴ鄙・1.5F</button></div><p>逶ｮ螳・ 60fps縺ｮ1繝輔Ξ繝ｼ繝 = 16.67ms縲ゅヶ繝ｩ繧ｦ繧ｶ繝ｻ讖溷勣縺ｮ驕・ｻｶ繧貞性繧縺溘ａ縲∫ｵｶ蟇ｾ蛟､繧医ｊ蜀咲樟諤ｧ繧定ｦ九※縺上□縺輔＞縲・/p></footer>
    </main>
  );
}

