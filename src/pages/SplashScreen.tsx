import { useEffect, useState, useRef, useCallback } from "react";

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"draw" | "text" | "exit">("draw");
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = 2;
    const W = 300;
    const H = 120;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    // "e" path: horizontal bar then counter-clockwise arc
    const ePoints: { x: number; y: number }[] = [];
    const eCx = 110, eCy = 55, eR = 28;
    // bar from left to right
    for (let i = 0; i <= 15; i++) {
      const t = i / 15;
      ePoints.push({ x: eCx - eR + t * eR * 2, y: eCy });
    }
    // arc counter-clockwise from 0 to ~290 degrees
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const angle = -t * Math.PI * 1.62;
      ePoints.push({ x: eCx + Math.cos(angle) * eR, y: eCy - Math.sin(angle) * eR });
    }

    // "L" path: vertical line down then horizontal right
    const lPoints: { x: number; y: number }[] = [];
    const lx = 160, ly = 28;
    // vertical stroke top to bottom
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      lPoints.push({ x: lx, y: ly + t * 55 });
    }
    // horizontal stroke
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      lPoints.push({ x: lx + t * 30, y: ly + 55 });
    }

    const totalFrames = 80;
    let frame = 0;
    const tailLen = 12;

    function drawPath(points: { x: number; y: number }[], progress: number) {
      const idx = Math.min(Math.floor(progress * points.length), points.length - 1);
      if (idx < 1) return;

      // Draw completed stroke
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i <= idx; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 4.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      // Glowing tail
      for (let i = 0; i < tailLen; i++) {
        const ti = idx - i;
        if (ti < 0) break;
        const alpha = 1 - i / tailLen;
        ctx.beginPath();
        ctx.arc(points[ti].x, points[ti].y, 5 - i * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74, 222, 128, ${alpha * 0.5})`;
        ctx.fill();
      }

      // Leading dot
      const pt = points[idx];
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = "#4ade80";
      ctx.shadowColor = "#4ade80";
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    function drawFinal(points: { x: number; y: number }[]) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.strokeStyle = "rgba(255,255,255,0.95)";
      ctx.lineWidth = 4.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      const progress = Math.min(frame / totalFrames, 1);

      // "e" draws from left, "L" draws from right (starts slightly delayed)
      const eProgress = Math.min(progress * 1.3, 1);
      const lProgress = Math.min(Math.max((progress - 0.2) * 1.5, 0), 1);

      drawPath(ePoints, eProgress);
      if (lProgress > 0) drawPath(lPoints, lProgress);

      frame++;
      if (frame <= totalFrames) {
        requestAnimationFrame(animate);
      } else {
        // Final clean render without dots
        ctx.clearRect(0, 0, W, H);
        drawFinal(ePoints);
        drawFinal(lPoints);
      }
    }

    animate();
  }, []);

  // Phase transitions
  useEffect(() => {
    const t1 = setTimeout(() => { setPhase("text"); setTextVisible(true); }, 1800);
    const t2 = setTimeout(() => setPhase("exit"), 3400);
    const t3 = setTimeout(onFinish, 3900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-primary transition-opacity duration-500 ${
        phase === "exit" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Subtle radial glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: 280,
          height: 280,
          background: "radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)",
        }}
      />

      {/* "eL" canvas animation */}
      <canvas
        ref={canvasRef}
        className="w-[150px] h-[60px]"
      />

      {/* "e-Lekha" text below */}
      <p
        className="mt-4 text-2xl font-light tracking-[0.15em] transition-all duration-700"
        style={{
          color: "rgba(255,255,255,0.9)",
          opacity: textVisible ? 1 : 0,
          transform: textVisible ? "translateY(0)" : "translateY(8px)",
          fontFamily: "'Georgia', serif",
        }}
      >
        e-Lekha
      </p>

      {/* Tagline */}
      <p
        className="mt-2 text-xs tracking-[0.2em] uppercase transition-all duration-700"
        style={{
          color: "rgba(255,255,255,0.4)",
          opacity: textVisible ? 1 : 0,
          transform: textVisible ? "translateY(0)" : "translateY(6px)",
          transitionDelay: "0.3s",
        }}
      >
        Business Management
      </p>
    </div>
  );
};

export default SplashScreen;
