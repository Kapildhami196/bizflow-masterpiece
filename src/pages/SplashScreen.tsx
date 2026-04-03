import { useEffect, useState, useRef, useCallback } from "react";
import logoSrc from "@/assets/elekha-logo.png";

// Generate points for handwriting "e-Lekha" text
function getTextPoints(): { x: number; y: number; lift?: boolean }[] {
  const pts: { x: number; y: number; lift?: boolean }[] = [];
  const baseY = 0;
  const h = 30;
  const sp = 5;
  let x = 0;

  function bezier(
    x0: number, y0: number, cx1: number, cy1: number, cx2: number, cy2: number, x3: number, y3: number, steps = 12
  ) {
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const u = 1 - t;
      pts.push({
        x: u * u * u * x0 + 3 * u * u * t * cx1 + 3 * u * t * t * cx2 + t * t * t * x3,
        y: u * u * u * y0 + 3 * u * u * t * cy1 + 3 * u * t * t * cy2 + t * t * t * y3,
      });
    }
  }

  function line(x0: number, y0: number, x1: number, y1: number, steps = 8) {
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      pts.push({ x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t });
    }
  }

  function lift() {
    pts.push({ x: pts[pts.length - 1]?.x || 0, y: pts[pts.length - 1]?.y || 0, lift: true });
  }

  // "e"
  const eR = 9;
  const eCx = x + eR;
  const eCy = baseY;
  line(eCx - eR, eCy, eCx + eR, eCy, 8);
  for (let i = 0; i <= 30; i++) {
    const t = i / 30;
    const angle = -t * Math.PI * 1.6;
    pts.push({ x: eCx + Math.cos(angle) * eR, y: eCy - Math.sin(angle) * eR });
  }
  x = eCx + eR + sp + 2;
  lift();

  // "-"
  line(x, baseY, x + 11, baseY, 6);
  x += 11 + sp;
  lift();

  // "L"
  line(x, baseY - h * 0.5, x, baseY + h * 0.35, 10);
  line(x, baseY + h * 0.35, x + 15, baseY + h * 0.35, 8);
  x += 15 + sp;
  lift();

  // "e"
  const e2R = 8;
  const e2Cx = x + e2R;
  const e2Cy = baseY + 2;
  line(e2Cx - e2R, e2Cy, e2Cx + e2R, e2Cy, 6);
  for (let i = 0; i <= 25; i++) {
    const t = i / 25;
    const angle = -t * Math.PI * 1.6;
    pts.push({ x: e2Cx + Math.cos(angle) * e2R, y: e2Cy - Math.sin(angle) * e2R });
  }
  x = e2Cx + e2R + sp;
  lift();

  // "k"
  const kx = x;
  line(kx, baseY - h * 0.45, kx, baseY + h * 0.35, 10);
  lift();
  line(kx + 13, baseY - h * 0.1, kx, baseY + h * 0.08, 8);
  line(kx, baseY + h * 0.08, kx + 13, baseY + h * 0.35, 8);
  x = kx + 13 + sp;
  lift();

  // "h"
  const hx = x;
  line(hx, baseY - h * 0.45, hx, baseY + h * 0.35, 10);
  lift();
  bezier(hx, baseY - h * 0.05, hx + 5, baseY - h * 0.25, hx + 11, baseY - h * 0.25, hx + 14, baseY - h * 0.05, 10);
  line(hx + 14, baseY - h * 0.05, hx + 14, baseY + h * 0.35, 8);
  x = hx + 14 + sp;
  lift();

  // "a"
  const aR = 8;
  const aCx = x + aR;
  const aCy = baseY + 4;
  for (let i = 0; i <= 30; i++) {
    const t = i / 30;
    const angle = Math.PI * 0.5 - t * Math.PI * 2;
    pts.push({ x: aCx + Math.cos(angle) * aR, y: aCy - Math.sin(angle) * aR });
  }
  lift();
  line(aCx + aR, aCy - aR, aCx + aR, baseY + h * 0.35, 8);

  return pts;
}

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const textCanvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"logo" | "text" | "glow" | "exit">("logo");
  const [logoLoaded, setLogoLoaded] = useState(false);

  const handleLogoLoad = useCallback(() => setLogoLoaded(true), []);

  // Animate "e-Lekha" text with dot + trail
  useEffect(() => {
    if (phase !== "text") return;
    const canvas = textCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const w = 340;
    const h = 60;
    canvas.width = w * 2;
    canvas.height = h * 2;
    ctx.scale(2, 2);

    const rawPoints = getTextPoints();
    const offsetX = (w - 155) / 2;
    const offsetY = h / 2;

    const strokes: { x: number; y: number }[][] = [];
    let current: { x: number; y: number }[] = [];
    for (const p of rawPoints) {
      if (p.lift) {
        if (current.length > 0) strokes.push(current);
        current = [];
      } else {
        current.push({ x: p.x + offsetX, y: p.y + offsetY });
      }
    }
    if (current.length > 0) strokes.push(current);

    const allPoints: { x: number; y: number; strokeStart?: boolean }[] = [];
    strokes.forEach((stroke) => {
      stroke.forEach((p, i) => {
        allPoints.push({ ...p, strokeStart: i === 0 });
      });
    });

    const totalFrames = 90;
    let frame = 0;
    const pointsPerFrame = allPoints.length / totalFrames;
    const drawnStrokes: { x: number; y: number }[][] = [[]];

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const currentIndex = Math.min(Math.floor(frame * pointsPerFrame), allPoints.length - 1);

      drawnStrokes.length = 0;
      drawnStrokes.push([]);
      for (let i = 0; i <= currentIndex; i++) {
        if (allPoints[i].strokeStart && drawnStrokes[drawnStrokes.length - 1].length > 0) {
          drawnStrokes.push([]);
        }
        drawnStrokes[drawnStrokes.length - 1].push(allPoints[i]);
      }

      for (const stroke of drawnStrokes) {
        if (stroke.length < 2) continue;
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo(stroke[i].x, stroke[i].y);
        }
        ctx.strokeStyle = "rgba(255,255,255,0.92)";
        ctx.lineWidth = 2.8;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      }

      // Tail glow
      const tailLen = 8;
      for (let i = 0; i < tailLen; i++) {
        const idx = currentIndex - i;
        if (idx < 0) break;
        if (allPoints[idx].strokeStart && i > 0) break;
        const alpha = 1 - i / tailLen;
        ctx.beginPath();
        ctx.arc(allPoints[idx].x, allPoints[idx].y, 3.5 - i * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74, 222, 128, ${alpha * 0.5})`;
        ctx.fill();
      }

      // Dot
      const pt = allPoints[currentIndex];
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#4ade80";
      ctx.shadowColor = "#4ade80";
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      frame++;
      if (frame <= totalFrames) {
        requestAnimationFrame(draw);
      } else {
        // Redraw final without dot
        ctx.clearRect(0, 0, w, h);
        for (const stroke of drawnStrokes) {
          if (stroke.length < 2) continue;
          ctx.beginPath();
          ctx.moveTo(stroke[0].x, stroke[0].y);
          for (let i = 1; i < stroke.length; i++) ctx.lineTo(stroke[i].x, stroke[i].y);
          ctx.strokeStyle = "rgba(255,255,255,0.95)";
          ctx.lineWidth = 2.8;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.stroke();
        }
      }
    }

    draw();
  }, [phase]);

  // Phase transitions
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 1200);
    const t2 = setTimeout(() => setPhase("glow"), 3200);
    const t3 = setTimeout(() => setPhase("exit"), 3800);
    const t4 = setTimeout(onFinish, 4300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-primary transition-opacity duration-500 ${
        phase === "exit" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Subtle radial glow behind logo */}
      <div
        className="absolute rounded-full transition-all duration-1000"
        style={{
          width: phase === "glow" || phase === "exit" ? 300 : 0,
          height: phase === "glow" || phase === "exit" ? 300 : 0,
          background: "radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Logo image with scale-in animation */}
      <div
        className="relative transition-all duration-700 ease-out"
        style={{
          transform: logoLoaded ? "scale(1)" : "scale(0.6)",
          opacity: logoLoaded ? 1 : 0,
        }}
      >
        <img
          src={logoSrc}
          alt="eLekha Logo"
          onLoad={handleLogoLoad}
          className="w-24 h-24 rounded-full object-cover"
          style={{
            filter: "drop-shadow(0 0 20px rgba(74,222,128,0.3))",
          }}
        />
        {/* Pulse ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping"
          style={{ animationDuration: "2s", animationIterationCount: "2" }}
        />
      </div>

      {/* Animated "e-Lekha" handwriting */}
      <div className="mt-6">
        <canvas
          ref={textCanvasRef}
          className="w-[170px] h-[30px]"
          style={{
            opacity: phase === "logo" ? 0 : 1,
            transition: "opacity 0.4s ease",
          }}
        />
      </div>

      {/* Tagline */}
      <p
        className="mt-3 text-xs tracking-[0.2em] uppercase transition-all duration-700"
        style={{
          color: "rgba(255,255,255,0.45)",
          opacity: phase === "glow" || phase === "exit" ? 1 : 0,
          transform: phase === "glow" || phase === "exit" ? "translateY(0)" : "translateY(6px)",
        }}
      >
        Business Management
      </p>
    </div>
  );
};

export default SplashScreen;
