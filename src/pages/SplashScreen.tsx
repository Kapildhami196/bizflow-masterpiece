import { useEffect, useState, useRef, useCallback } from "react";

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const wmCanvasRef = useRef<HTMLCanvasElement>(null);
  const [showTagline, setShowTagline] = useState(false);
  const [exiting, setExiting] = useState(false);
  const skipRef = useRef(false);
  const animRef = useRef<number>(0);

  const handleSkip = useCallback(() => {
    skipRef.current = true;
    onFinish();
  }, [onFinish]);

  useEffect(() => {
    const mainCv = mainCanvasRef.current;
    const wmCv = wmCanvasRef.current;
    if (!mainCv || !wmCv) return;

    const ctx = mainCv.getContext("2d")!;
    const wmCtx = wmCv.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 2, 3);

    // Sizing
    const container = mainCv.parentElement!;
    let W = container.offsetWidth;
    let H = container.offsetHeight;

    function resize() {
      W = container.offsetWidth;
      H = container.offsetHeight;
      mainCv.width = W * dpr;
      mainCv.height = H * dpr;
      mainCv.style.width = W + "px";
      mainCv.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    const CX = W / 2;
    const CY = H / 2 - 60;

    // Easing
    function easeInOut(t: number) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function easeOut3(t: number) { return 1 - Math.pow(1 - t, 3); }
    function easeOutQ(t: number) { return 1 - (1 - t) * (1 - t); }
    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

    const LOGO_R = 56;
    const SW = 8.5;

    // Build "e" points
    function buildE(cx: number, cy: number) {
      const ex = cx - 19, ey = cy + 3, rw = 17, rh = 16;
      const pts: { x: number; y: number }[] = [];
      const steps = 120;
      for (let i = 0; i <= 30; i++) {
        const t = i / 30;
        pts.push({ x: ex - rw + 2 * rw * t, y: ey });
      }
      const arcSpan = 2 * Math.PI - 0.65;
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const angle = arcSpan * t;
        pts.push({ x: ex + rw * Math.cos(angle), y: ey - rh * Math.sin(angle) });
      }
      return pts;
    }

    // Build "L" points
    function buildL(cx: number, cy: number) {
      const lx = cx + 8, ltop = cy - 22, lbot = cy + 22, lright = lx + 26;
      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i <= 40; i++) {
        const t = i / 40;
        pts.push({ x: lx, y: lerp(ltop, lbot, t) });
      }
      for (let i = 1; i <= 24; i++) {
        const t = i / 24;
        pts.push({ x: lerp(lx, lright, t), y: lbot });
      }
      return pts;
    }

    // Build travel paths with wave
    function buildTravel(startX: number, startY: number, endX: number, endY: number, fromLeft: boolean, steps: number) {
      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const et = easeOut3(t);
        const x = lerp(startX, endX, et);
        const waveAmp = H * 0.10 * (1 - Math.pow(t, 1.6));
        const phase = fromLeft ? 0 : Math.PI;
        const wave = Math.sin(t * Math.PI * 2.4 + phase) * waveAmp;
        const y = lerp(startY, endY, et) + wave;
        pts.push({ x, y });
      }
      return pts;
    }

    const ePts = buildE(CX, CY);
    const lPts = buildL(CX, CY);
    const eTrav = buildTravel(-20, CY - H * 0.06, lPts[0].x, lPts[0].y, true, 90);
    const lTrav = buildTravel(W + 20, CY + H * 0.06, ePts[0].x, ePts[0].y, false, 90);
    const eAll = [...eTrav, ...lPts]; // dot A → writes L
    const lAll = [...lTrav, ...ePts]; // dot B → writes e
    const eTravLen = eTrav.length;
    const lTravLen = lTrav.length;

    // Timing
    const TOTAL = 3600;
    const T_LETTER = 0.72;
    const T_CIRCLE_END = 0.84;
    const T_WM_START = 0.81;
    const T_WM_END = 0.96;
    const T_TAG = 0.97;
    const TRAIL = 52;

    // Draw helpers
    function drawGlow(x: number, y: number, alpha: number) {
      const gr = 28;
      const g = ctx.createRadialGradient(x, y, 0, x, y, gr);
      g.addColorStop(0, `rgba(220,255,235,${alpha})`);
      g.addColorStop(0.3, `rgba(80,210,130,${alpha * 0.55})`);
      g.addColorStop(1, "rgba(45,106,79,0)");
      ctx.beginPath(); ctx.arc(x, y, gr, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(235,255,245,${alpha})`; ctx.fill();
    }

    function drawTrail(pts: { x: number; y: number }[], from: number, to: number) {
      if (to - from < 2) return;
      for (let i = from + 1; i <= to; i++) {
        const p0 = pts[i - 1], p1 = pts[i];
        if (!p0 || !p1) continue;
        const frac = (i - from) / (to - from);
        ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = `rgba(50,180,95,${frac * 0.9})`;
        ctx.lineWidth = 11; ctx.lineCap = "round"; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = `rgba(200,255,220,${frac * 0.4})`;
        ctx.lineWidth = 3.5; ctx.stroke();
      }
    }

    function drawStroke(pts: { x: number; y: number }[], upTo: number, alpha: number) {
      if (upTo < 2 || alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < upTo; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = SW;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      ctx.restore();
    }

    function drawCircleRing(alpha: number) {
      if (alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(CX, CY, LOGO_R + 5, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.22)";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    }

    const WM = "e-Lekha";
    function drawWordmark(progress: number) {
      wmCtx.clearRect(0, 0, wmCv.width, wmCv.height);
      wmCtx.font = "300 28px 'Inter','Helvetica Neue',Helvetica,Arial,sans-serif";
      wmCtx.textBaseline = "middle";
      let totalW = 0;
      for (let i = 0; i < WM.length; i++) totalW += wmCtx.measureText(WM[i]).width + (i < WM.length - 1 ? 4 : 0);
      let x = (wmCv.width - totalW) / 2;
      for (let i = 0; i < WM.length; i++) {
        const ch = WM[i];
        const cw = wmCtx.measureText(ch).width;
        const p = Math.min(1, Math.max(0, progress * WM.length - i));
        if (p > 0) {
          wmCtx.globalAlpha = easeOutQ(p);
          wmCtx.fillStyle = "rgba(255,255,255,0.95)";
          wmCtx.fillText(ch, x, wmCv.height / 2);
          wmCtx.globalAlpha = 1;
        }
        x += cw + 4;
      }
    }

    let t0: number | null = null;

    function frame(ts: number) {
      if (skipRef.current) return;
      if (!t0) t0 = ts;
      const gT = Math.min((ts - t0) / TOTAL, 1);
      ctx.clearRect(0, 0, W, H);

      const phase = Math.min(gT / T_LETTER, 1);
      const prog = easeInOut(phase);

      const eIdx = Math.min(Math.floor(prog * (eAll.length - 1)), eAll.length - 1);
      const lIdx = Math.min(Math.floor(prog * (lAll.length - 1)), lAll.length - 1);

      drawTrail(eAll, Math.max(0, eIdx - TRAIL), eIdx);
      drawTrail(lAll, Math.max(0, lIdx - TRAIL), lIdx);

      if (eIdx > eTravLen) drawStroke(lPts, Math.min(eIdx - eTravLen, lPts.length), 1);
      if (lIdx > lTravLen) drawStroke(ePts, Math.min(lIdx - lTravLen, ePts.length), 1);

      const dFade = phase < 0.96 ? 1 : 1 - (phase - 0.96) / 0.04;
      drawGlow(eAll[eIdx].x, eAll[eIdx].y, dFade);
      drawGlow(lAll[lIdx].x, lAll[lIdx].y, dFade);

      if (gT >= T_LETTER) {
        const p = Math.min((gT - T_LETTER) / 0.05, 1);
        drawStroke(lPts, lPts.length, p);
        drawStroke(ePts, ePts.length, p);
      }

      if (gT >= T_LETTER) {
        const cr = easeOut3(Math.min((gT - T_LETTER) / (T_CIRCLE_END - T_LETTER), 1));
        drawCircleRing(cr * 0.6);
      }

      if (gT >= T_WM_START) {
        const p = easeOutQ(Math.min((gT - T_WM_START) / (T_WM_END - T_WM_START), 1));
        drawWordmark(p * (WM.length + 1));
      }

      if (gT >= T_TAG && !showTagline) setShowTagline(true);

      if (gT < 1) {
        animRef.current = requestAnimationFrame(frame);
      }
    }

    const initDelay = setTimeout(() => {
      animRef.current = requestAnimationFrame(frame);
    }, 150);

    const exitTimer = setTimeout(() => {
      if (!skipRef.current) setExiting(true);
    }, TOTAL + 400);

    const finishTimer = setTimeout(() => {
      if (!skipRef.current) onFinish();
    }, TOTAL + 900);

    return () => {
      cancelAnimationFrame(animRef.current);
      clearTimeout(initDelay);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-primary transition-opacity duration-500 ${
        exiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ fontFamily: "'Inter','Helvetica Neue',Helvetica,Arial,sans-serif" }}
    >
      {/* Main animation canvas */}
      <div className="relative w-full flex-1" style={{ maxHeight: "70vh" }}>
        <canvas
          ref={mainCanvasRef}
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Wordmark canvas + tagline */}
      <div className="flex flex-col items-center gap-3 pb-24">
        <canvas
          ref={wmCanvasRef}
          width={260}
          height={44}
          className="block"
        />
        <p
          className="text-xs tracking-[3px] uppercase transition-opacity duration-700"
          style={{
            color: "rgba(255,255,255,0.5)",
            opacity: showTagline ? 1 : 0,
          }}
        >
          Smart business. Clear accounts.
        </p>
      </div>

      {/* Skip */}
      <button
        onClick={handleSkip}
        className="absolute bottom-4 right-4 px-3 py-1.5 text-xs rounded border transition-colors"
        style={{
          color: "rgba(255,255,255,0.55)",
          background: "rgba(0,0,0,0.12)",
          borderColor: "rgba(255,255,255,0.18)",
        }}
      >
        Skip
      </button>
    </div>
  );
};

export default SplashScreen;
