import { useEffect, useState, useRef } from "react";

// Generate points along a path for the dot to follow
function getEPoints(cx: number, cy: number, r: number): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  // Horizontal bar left to right
  const lineSteps = 25;
  for (let i = 0; i <= lineSteps; i++) {
    const t = i / lineSteps;
    points.push({ x: cx - r + t * r * 2, y: cy });
  }
  // Arc from right-middle counter-clockwise ~315 degrees
  const arcSteps = 65;
  const totalArc = Math.PI * 1.75;
  for (let i = 0; i <= arcSteps; i++) {
    const t = i / arcSteps;
    const angle = -t * totalArc;
    points.push({ x: cx + Math.cos(angle) * r, y: cy - Math.sin(angle) * r });
  }
  return points;
}

// Generate points for handwriting "e-Lekha" text using bezier strokes
function getTextPoints(): { x: number; y: number; lift?: boolean }[] {
  const pts: { x: number; y: number; lift?: boolean }[] = [];
  const baseY = 0;
  const h = 28; // letter height
  const sp = 4; // spacing
  let x = 0;

  // Helper to sample a bezier
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

  // "e" - small, similar to logo
  const eR = 8;
  const eCx = x + eR;
  const eCy = baseY;
  // bar
  line(eCx - eR, eCy, eCx + eR, eCy, 8);
  // arc CCW
  for (let i = 0; i <= 30; i++) {
    const t = i / 30;
    const angle = -t * Math.PI * 1.6;
    pts.push({ x: eCx + Math.cos(angle) * eR, y: eCy - Math.sin(angle) * eR });
  }
  x = eCx + eR + sp + 2;
  lift();

  // "-" dash
  line(x, baseY, x + 10, baseY, 6);
  x += 10 + sp;
  lift();

  // "L"
  line(x, baseY - h * 0.5, x, baseY + h * 0.35, 10);
  line(x, baseY + h * 0.35, x + 14, baseY + h * 0.35, 8);
  x += 14 + sp;
  lift();

  // "e"
  const e2R = 7;
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
  line(kx + 12, baseY - h * 0.1, kx, baseY + h * 0.08, 8);
  line(kx, baseY + h * 0.08, kx + 12, baseY + h * 0.35, 8);
  x = kx + 12 + sp;
  lift();

  // "h"
  const hx = x;
  line(hx, baseY - h * 0.45, hx, baseY + h * 0.35, 10);
  lift();
  bezier(hx, baseY - h * 0.05, hx + 4, baseY - h * 0.25, hx + 10, baseY - h * 0.25, hx + 13, baseY - h * 0.05, 10);
  line(hx + 13, baseY - h * 0.05, hx + 13, baseY + h * 0.35, 8);
  x = hx + 13 + sp;
  lift();

  // "a"
  const aR = 7;
  const aCx = x + aR;
  const aCy = baseY + 4;
  // circle
  for (let i = 0; i <= 30; i++) {
    const t = i / 30;
    const angle = Math.PI * 0.5 - t * Math.PI * 2;
    pts.push({ x: aCx + Math.cos(angle) * aR, y: aCy - Math.sin(angle) * aR });
  }
  lift();
  // stem
  line(aCx + aR, aCy - aR, aCx + aR, baseY + h * 0.35, 8);

  return pts;
}

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const logoCanvasRef = useRef<HTMLCanvasElement>(null);
  const textCanvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"logo" | "text" | "exit">("logo");

  // Animate the "e" logo with dot + tail
  useEffect(() => {
    const canvas = logoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const size = 160;
    canvas.width = size * 2;
    canvas.height = size * 2;
    ctx.scale(2, 2);

    const cx = size / 2;
    const cy = size / 2;
    const r = 34;
    const points = getEPoints(cx, cy, r);
    const totalFrames = 80;
    let frame = 0;
    const pointsPerFrame = points.length / totalFrames;

    function draw() {
      ctx.clearRect(0, 0, size, size);
      const currentIndex = Math.min(Math.floor(frame * pointsPerFrame), points.length - 1);

      // Trail
      if (currentIndex > 0) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i <= currentIndex; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.strokeStyle = "rgba(255,255,255,0.95)";
        ctx.lineWidth = 3.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      }

      // Glowing tail particles
      const tailLen = 10;
      for (let i = 0; i < tailLen; i++) {
        const idx = currentIndex - i;
        if (idx < 0) break;
        const alpha = 1 - i / tailLen;
        ctx.beginPath();
        ctx.arc(points[idx].x, points[idx].y, 4.5 - i * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74, 222, 128, ${alpha * 0.6})`;
        ctx.fill();
      }

      // Moving dot
      const pt = points[currentIndex];
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#4ade80";
      ctx.shadowColor = "#4ade80";
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      frame++;
      if (frame <= totalFrames) {
        requestAnimationFrame(draw);
      }
    }

    draw();
  }, []);

  // Animate "e-Lekha" text with same dot + tail style
  useEffect(() => {
    if (phase !== "text") return;
    const canvas = textCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const w = 320;
    const h = 60;
    canvas.width = w * 2;
    canvas.height = h * 2;
    ctx.scale(2, 2);

    const rawPoints = getTextPoints();
    const offsetX = (w - 140) / 2; // center the text ~140px wide
    const offsetY = h / 2;

    // Separate into strokes
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

    // Flatten for animation
    const allPoints: { x: number; y: number; strokeStart?: boolean }[] = [];
    strokes.forEach((stroke) => {
      stroke.forEach((p, i) => {
        allPoints.push({ ...p, strokeStart: i === 0 });
      });
    });

    const totalFrames = 100;
    let frame = 0;
    const pointsPerFrame = allPoints.length / totalFrames;

    // Accumulate drawn strokes
    const drawnStrokes: { x: number; y: number }[][] = [[]];

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const currentIndex = Math.min(Math.floor(frame * pointsPerFrame), allPoints.length - 1);

      // Rebuild drawn strokes up to currentIndex
      drawnStrokes.length = 0;
      drawnStrokes.push([]);
      for (let i = 0; i <= currentIndex; i++) {
        if (allPoints[i].strokeStart && drawnStrokes[drawnStrokes.length - 1].length > 0) {
          drawnStrokes.push([]);
        }
        drawnStrokes[drawnStrokes.length - 1].push(allPoints[i]);
      }

      // Draw all completed strokes
      for (const stroke of drawnStrokes) {
        if (stroke.length < 2) continue;
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo(stroke[i].x, stroke[i].y);
        }
        ctx.strokeStyle = "rgba(255,255,255,0.95)";
        ctx.lineWidth = 2.5;
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
      }
    }

    draw();
  }, [phase]);

  // Phase transitions
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 1600);
    const t2 = setTimeout(() => setPhase("exit"), 3800);
    const t3 = setTimeout(onFinish, 4400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-primary transition-opacity duration-500 ${
        phase === "exit" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Animated "e" logo */}
      <div className="w-20 h-20 flex items-center justify-center">
        <canvas ref={logoCanvasRef} className="w-20 h-20" />
      </div>

      {/* Animated "e-Lekha" text */}
      <div className="mt-5">
        <canvas
          ref={textCanvasRef}
          className="w-[160px] h-[30px]"
          style={{ opacity: phase === "logo" ? 0 : 1, transition: "opacity 0.3s" }}
        />
      </div>

      {/* Tagline */}
      <p
        className={`mt-3 text-primary-foreground/50 text-xs tracking-[0.2em] uppercase transition-all duration-500 ${
          phase === "text" ? "opacity-100" : "opacity-0"
        }`}
      >
        Business Management
      </p>
    </div>
  );
};

export default SplashScreen;
