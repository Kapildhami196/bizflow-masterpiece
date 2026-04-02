import { useEffect, useState, useRef } from "react";

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"drawing" | "text" | "exit">("drawing");
  const [visibleLetters, setVisibleLetters] = useState(0);

  // Draw the "e" with a moving dot + trail
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const size = 160;
    canvas.width = size * 2;
    canvas.height = size * 2;
    ctx.scale(2, 2); // retina

    const cx = size / 2;
    const cy = size / 2;
    const r = 32;
    const totalFrames = 90;
    let frame = 0;

    // "e" path: circle from ~30deg going CCW to ~30deg, then a horizontal middle line
    // We'll draw: 1) horizontal bar, 2) arc from right-mid going up and around

    const ePathPoints: { x: number; y: number }[] = [];

    // Generate points for the "e" shape
    // Start from right middle, go up (counter-clockwise full circle minus a gap at bottom-right)
    const startAngle = 0; // right middle
    const totalArc = Math.PI * 1.75; // about 315 degrees
    const arcSteps = 60;

    // First: horizontal middle line from left to right
    const lineSteps = 20;
    for (let i = 0; i <= lineSteps; i++) {
      const t = i / lineSteps;
      ePathPoints.push({
        x: cx - r + t * (r * 2),
        y: cy,
      });
    }

    // Then: arc from right-middle going counter-clockwise
    for (let i = 0; i <= arcSteps; i++) {
      const t = i / arcSteps;
      const angle = startAngle - t * totalArc;
      ePathPoints.push({
        x: cx + Math.cos(angle) * r,
        y: cy - Math.sin(angle) * r,
      });
    }

    const totalPoints = ePathPoints.length;
    const pointsPerFrame = totalPoints / totalFrames;

    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary-foreground")
      .trim();
    const dotColor = `hsl(${accentColor || "0 0% 100%"})`;

    function draw() {
      ctx.clearRect(0, 0, size, size);

      const currentIndex = Math.min(
        Math.floor(frame * pointsPerFrame),
        totalPoints - 1
      );

      // Draw trail
      if (currentIndex > 0) {
        ctx.beginPath();
        ctx.moveTo(ePathPoints[0].x, ePathPoints[0].y);
        for (let i = 1; i <= currentIndex; i++) {
          ctx.lineTo(ePathPoints[i].x, ePathPoints[i].y);
        }
        ctx.strokeStyle = dotColor;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      }

      // Draw moving dot
      const pt = ePathPoints[currentIndex];
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();

      // Glow tail (last few points fading)
      const tailLen = 8;
      for (let i = 0; i < tailLen; i++) {
        const idx = currentIndex - i;
        if (idx < 0) break;
        const alpha = 1 - i / tailLen;
        ctx.beginPath();
        ctx.arc(ePathPoints[idx].x, ePathPoints[idx].y, 4 - i * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = dotColor.replace(")", ` / ${alpha * 0.5})`).replace("hsl(", "hsl(");
        ctx.fill();
      }

      frame++;
      if (frame <= totalFrames) {
        requestAnimationFrame(draw);
      }
    }

    draw();
  }, []);

  // Phase transitions
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 1800);
    const t2 = setTimeout(() => setPhase("exit"), 3600);
    const t3 = setTimeout(onFinish, 4200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinish]);

  // Letter-by-letter "Lekha"
  useEffect(() => {
    if (phase !== "text") return;
    const letters = "Lekha".length;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleLetters(i);
      if (i >= letters) clearInterval(interval);
    }, 150);
    return () => clearInterval(interval);
  }, [phase]);

  const text = "Lekha";

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-primary transition-opacity duration-500 ${
        phase === "exit" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Canvas for animated "e" */}
      <div className="w-20 h-20 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-20 h-20"
        />
      </div>

      {/* App name: "e" + "Lekha" letter by letter */}
      <div className="mt-6 flex items-baseline">
        <span
          className={`text-4xl font-bold text-primary-foreground transition-opacity duration-300 ${
            phase === "text" || phase === "exit" ? "opacity-100" : "opacity-0"
          }`}
        >
          e
        </span>
        {text.split("").map((letter, i) => (
          <span
            key={i}
            className="text-4xl font-bold text-primary-foreground/80 transition-all duration-300"
            style={{
              opacity: visibleLetters > i ? 1 : 0,
              transform: visibleLetters > i ? "translateY(0)" : "translateY(8px)",
              transitionDelay: `${i * 50}ms`,
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Tagline */}
      <p
        className={`mt-2 text-primary-foreground/50 text-xs tracking-[0.2em] uppercase transition-all duration-500 ${
          phase === "text" ? "opacity-100" : "opacity-0"
        }`}
      >
        Business Management
      </p>
    </div>
  );
};

export default SplashScreen;
