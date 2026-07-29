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
  const [padName, setPadName] = useState("");
  const [setupStep, setSetupStep] = useState<"connect" | "k" | "g" | "done">("connect");
  const [sound, setSound] = useState(true);
  const padPrev = useRef<boolean[]>([]);
  const attemptId = useRef(0);
  const setupRef = useRef(setupStep);
  useEffect(() => { setupRef.current = setupStep; }, [setupStep]);

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
      if (sound) {
        const audio = new AudioContext(); const osc = audio.createOscillator(); const gain = audio.createGain();
        osc.frequency.value = success ? 760 : 180; gain.gain.value = .035; osc.connect(gain); gain.connect(audio.destination); osc.start(); osc.stop(audio.currentTime + .07);
      }
      setReady(false);
    }
    updateHeld({ ...now, [button]: false, [`${button}At`]: null } as Held);
  }, [strict, updateHeld, sound]);

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
        setPadName(pad.id.replace(/\s*\([^)]*\)/g, "").slice(0, 54));
        if (setupRef.current === "connect") setSetupStep("k");
        const current = pad.buttons.map((b) => b.pressed);
        const newlyPressed = current.map((v, i) => v && !padPrev.current[i]).map((v, i) => v ? i : -1).filter((i) => i >= 0);
        for (const index of newlyPressed) {
          if (setupRef.current === "k") { setPadLabels([index, null]); setSetupStep("g"); break; }
          if (setupRef.current === "g" && index !== padLabels[0]) { setPadLabels([padLabels[0], index]); setSetupStep("done"); break; }
        }
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
  const streak = useMemo(() => { let n=0; for(const a of attempts){ if(!a.success) break; n++; } return n; }, [attempts]);

  const touchProps = (button: "k" | "g") => ({
    onPointerDown: (e: React.PointerEvent) => { e.currentTarget.setPointerCapture(e.pointerId); press(button); },
    onPointerUp: () => release(button),
    onPointerCancel: () => release(button),
  });

  return (
    <main>
      <header className="topbar"><span className="brand-mark">譎ｶ</span><span>繧｢繧ｭ繝ｩ繧ｹ繝壹す繝｣繝ｫ邱ｴ鄙呈ｩ・/span><span className={`connection ${padName ? "online" : ""}`}>笳・{padName ? "繧｢繧ｱ繧ｳ繝ｳ謗･邯壻ｸｭ" : "繧｢繧ｱ繧ｳ繝ｳ譛ｪ謗･邯・}</span></header>
      <section className="hero">
        <div className="eyebrow">PC縺ｫUSB繧｢繧ｱ繧ｳ繝ｳ繧偵▽縺ｪ縺・〒縲√◎縺ｮ縺ｾ縺ｾ邱ｴ鄙・/div>
        <h1>譎ｶ縺ｮ閹昴ｒ縲・em>蜃ｺ縺帙ｋ謇・/em>縺ｫ縲・/h1>
        <p className="lead">謠占・蠑ｾ閻ｿ・磯夂ｧｰ・壹い繧ｭ繝ｩ繧ｹ繝壹す繝｣繝ｫ・牙ｰら畑縲ゅ・繧ｿ繝ｳ繧呈款縺励◆譎る俣繧・/1000遘貞腰菴阪〒貂ｬ繧翫∝､ｱ謨励＠縺溽炊逕ｱ縺ｾ縺ｧ謨吶∴縺ｾ縺吶・/p>
      </section>

      <section className="start-guide">
        <div className={setupStep === "connect" ? "active" : "done"}><b>1</b><span><strong>繧｢繧ｱ繧ｳ繝ｳ繧旦SB謗･邯・/strong><small>{padName || "謗･邯壹☆繧九→閾ｪ蜍輔〒隕九▽縺代∪縺・}</small></span></div>
        <div className={setupStep === "k" ? "active" : (["g","done"].includes(setupStep) ? "done" : "")}><b>2</b><span><strong>K縺ｫ菴ｿ縺・・繧ｿ繝ｳ繧呈款縺・/strong><small>{padLabels[0] === null ? "譎ｮ谿ｵ縺ｮK繝懊ち繝ｳ繧・蝗樊款縺・ : `繝懊ち繝ｳ ${padLabels[0]} 繧堤匳骭ｲ貂医∩`}</small></span></div>
        <div className={setupStep === "g" ? "active" : (setupStep === "done" ? "done" : "")}><b>3</b><span><strong>G縺ｫ菴ｿ縺・・繧ｿ繝ｳ繧呈款縺・/strong><small>{padLabels[1] === null ? "譎ｮ谿ｵ縺ｮG繝懊ち繝ｳ繧・蝗樊款縺・ : `繝懊ち繝ｳ ${padLabels[1]} 繧堤匳骭ｲ貂医∩`}</small></span></div>
        {setupStep === "done" && <button onClick={() => {setPadLabels([null,null]); setSetupStep(padName ? "k" : "connect")}}>繝懊ち繝ｳ繧貞・險ｭ螳・/button>}
      </section>

      <section className="lab" aria-label="蜈･蜉帷ｷｴ鄙・>
        <div className="command-strip"><span>謚ｼ縺玲婿縺ｯ縺薙ｌ縺縺・/span><b>K</b><i>縺ｨ</i><b>G</b><strong>蜷梧凾縺ｫ謚ｼ縺・/strong><span className="arrow">竊・/span><b className="release-key">G</b><strong>縺縺代☆縺宣屬縺・/strong><small>K縺ｯ謚ｼ縺励◆縺ｾ縺ｾ</small></div>
        <div className="workbench">
          <div className="input-zone">
            <div className={`coach ${ready ? "go" : ""}`}><span>{ready ? "莉奇ｼ・ : "邱ｴ鄙・}</span><strong>{setupStep !== "done" ? "荳翫・謇矩・〒繝懊ち繝ｳ繧堤匳骭ｲ縺励※縺上□縺輔＞" : ready ? "G縺縺鷹屬縺呻ｼ・縺ｯ謚ｼ縺励◆縺ｾ縺ｾ・・ : held.k || held.g ? "K縺ｨG繧貞酔譎ゅ↓謚ｼ縺礼峩縺・ : "K縺ｨG繧貞酔譎ゅ↓謚ｼ縺励※縺上□縺輔＞"}</strong></div>
            <div className="buttons">
              <button className={`practice-button k-button ${held.k ? "held" : ""}`} {...touchProps("k")}><small>KICK</small><strong>K</strong><span>Keyboard J{padLabels[0] !== null ? ` ﾂｷ Pad ${padLabels[0]}` : ""}</span></button>
              <div className="plus">+</div>
              <button className={`practice-button g-button ${held.g ? "held" : ""}`} {...touchProps("g")}><small>GUARD</small><strong>G</strong><span>Keyboard K{padLabels[1] !== null ? ` ﾂｷ Pad ${padLabels[1]}` : ""}</span></button>
            </div>
            <div className="finger-tip"><b>繧ｳ繝・/b><span>K繧呈款縺呎欠縺ｯ豁｢繧√ｋ縲・縺ｮ謖・□縺代ｒ繝懊ち繝ｳ陦ｨ髱｢縺九ｉ霍ｳ縺ｭ荳翫￡繧九・/span></div>
          </div>
          <div className={`verdict ${latest ? (latest.success ? "success" : "fail") : "idle"}`}>
            <span className="verdict-label">LAST INPUT</span>
            <strong>{latest ? latest.ms.toFixed(1) : "窶・}<small> ms</small></strong>
            <span className="frames">{latest ? (latest.ms / FRAME_MS).toFixed(2) : "窶・} FRAME</span>
            <p>{latest ? latest.reason : "譛蛻昴・蜈･蜉帙ｒ蠕・▲縺ｦ縺・∪縺・}</p>
          </div>
        </div>
      </section>

      <section className="dashboard">
        <div className="stats">
          <article><span>SUCCESS RATE</span><strong>{stats.rate}<small>%</small></strong><div className="meter"><i style={{width: `${stats.rate}%`}}/></div></article>
          <article><span>CLEAN INPUTS</span><strong>{stats.success}<small> / {attempts.length || 0}</small></strong></article>
          <article><span>騾｣邯壽・蜉・/span><strong>{streak}<small> 蝗・/small></strong></article>
        </div>
        <div className="history">
          <div className="history-head"><h2>蜈･蜉帙き繝ｫ繝・窶・逶ｴ霑・0蝗・/h2><button onClick={() => setAttempts([])}>險倬鹸繧呈ｶ医☆</button></div>
          {attempts.length === 0 ? <p className="empty">縺ｾ縺繝・・繧ｿ縺後≠繧翫∪縺帙ｓ縲・+G縺九ｉ蟋九ａ縺ｾ縺励ｇ縺・・/p> : attempts.map((a, index) => <div className="history-row" key={a.id}><span>{String(attempts.length - index).padStart(2, "0")}</span><div><i className={a.success ? "ok" : "ng"} style={{width: `${Math.min(100, a.ms / 40 * 100)}%`}}/></div><b>{a.ms.toFixed(1)} ms</b><em>{a.success ? "CLEAN" : "MISS"}</em></div>)}
        </div>
      </section>

      <footer><div><b>邱ｴ鄙偵Ξ繝吶Ν</b><button className={!strict ? "selected" : ""} onClick={() => setStrict(false)}>繧・＆縺励＞ 1.5F</button><button className={strict ? "selected" : ""} onClick={() => setStrict(true)}>螳滓姶 1F</button><button className={sound ? "selected" : ""} onClick={() => setSound(!sound)}>蛻､螳夐浹 {sound ? "ON" : "OFF"}</button></div><p>縺ｾ縺壹後ｄ縺輔＠縺・阪〒10蝗樔ｸｭ8蝗槭ｒ逶ｮ謖・＠縲・＃謌舌＠縺溘ｉ縲悟ｮ滓姶縲阪∈縲・F = 邏・6.67ms・・0fps・峨・/p></footer>
    </main>
  );
}

