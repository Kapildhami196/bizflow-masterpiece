import { useEffect, useState, useRef, useCallback } from "react";

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"init" | "dots" | "logo" | "text" | "tagline" | "exit">("init");
  const animRef = useRef<number>(0);
  const skipRef = useRef(false);

  const handleSkip = useCallback(() => {
    skipRef.current = true;
    onFinish();
  }, [onFinish]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 2;
    const W = 400;
    const H = 400;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    // Logo params
    const cx = W / 2;
    const cy = H / 2;
    const logoRadius = 52;

    // Dot animation params
    const dotStartX_left = -30;
    const dotStartX_right = W + 30;
    const dotEndX_left = cx - 14; // where "e" sits
    const dotEndX_right = cx + 14; // where "L" sits
    const dotY = cy;

    const totalDuration = 2800; // ms
    const dotTravelDuration = 800;
    const logoRevealDuration = 400;
    const startTime = performance.now();

    function easeOutCubic(t: number) {
      return 1 - Math.pow(1 - t, 3);
    }

    function easeInOutQuad(t: number) {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    function drawGlowDot(x: number, y: number, tailX: number, progress: number) {
      // Tail (fading gradient line)
      const tailLen = Math.abs(x - tailX);
      if (tailLen > 2) {
        const grad = ctx.createLinearGradient(tailX, y, x, y);
        grad.addColorStop(0, "rgba(74, 222, 128, 0)");
        grad.addColorStop(1, "rgba(74, 222, 128, 0.5)");
        ctx.beginPath();
        ctx.moveTo(tailX, y);
        ctx.lineTo(x, y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      // Outer glow
      const glowGrad = ctx.createRadialGradient(x, y, 0, x, y, 18);
      glowGrad.addColorStop(0, "rgba(74, 222, 128, 0.4)");
      glowGrad.addColorStop(1, "rgba(74, 222, 128, 0)");
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#4ade80";
      ctx.fill();
    }

    function drawLogo(opacity: number) {
      ctx.save();
      ctx.globalAlpha = opacity;

      // Circle
      ctx.beginPath();
      ctx.arc(cx, cy, logoRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#1a6b3c";
      ctx.fill();

      // "eL" text
      ctx.font = "bold 46px 'Inter', 'Helvetica Neue', Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("eL", cx, cy + 1);

      ctx.restore();
    }

    function animate(now: number) {
      if (skipRef.current) return;

      const elapsed = now - startTime;
      ctx.clearRect(0, 0, W, H);

      // Phase 1: Dots travel (0 - dotTravelDuration)
      if (elapsed < dotTravelDuration) {
        const t = easeOutCubic(Math.min(elapsed / dotTravelDuration, 1));
        const leftX = dotStartX_left + (dotEndX_left - dotStartX_left) * t;
        const rightX = dotStartX_right + (dotEndX_right - dotStartX_right) * t;

        // Tail origin moves slower
        const tailT = easeOutCubic(Math.min(elapsed / dotTravelDuration, 1) * 0.6);
        const leftTailX = dotStartX_left + (dotEndX_left - dotStartX_left) * tailT;
        const rightTailX = dotStartX_right + (dotEndX_right - dotStartX_right) * tailT;

        drawGlowDot(leftX, dotY, leftTailX, t);
        drawGlowDot(rightX, dotY, rightTailX, t);
      }
      // Phase 2: Dots converge and logo reveals
      else if (elapsed < dotTravelDuration + logoRevealDuration) {
        const t = (elapsed - dotTravelDuration) / logoRevealDuration;
        const logoOpacity = easeInOutQuad(Math.min(t, 1));

        // Dots fade out
        const dotFade = 1 - easeInOutQuad(Math.min(t * 2, 1));
        if (dotFade > 0) {
          ctx.globalAlpha = dotFade;
          drawGlowDot(dotEndX_left, dotY, dotEndX_left - 20, 1);
          drawGlowDot(dotEndX_right, dotY, dotEndX_right + 20, 1);
          ctx.globalAlpha = 1;
        }

        drawLogo(logoOpacity);
      }
      // Phase 3: Logo stable
      else {
        drawLogo(1);
      }

      if (elapsed < totalDuration) {
        animRef.current = requestAnimationFrame(animate);
      }
    }

    // Start after brief delay
    const initTimer = setTimeout(() => {
      setPhase("dots");
      animRef.current = requestAnimationFrame(animate);
    }, 200);

    // Phase timers
    const t1 = setTimeout(() => setPhase("logo"), dotTravelDuration + 200);
    const t2 = setTimeout(() => setPhase("text"), dotTravelDuration + logoRevealDuration + 300);
    const t3 = setTimeout(() => setPhase("tagline"), dotTravelDuration + logoRevealDuration + 700);
    const t4 = setTimeout(() => setPhase("exit"), totalDuration + 200);
    const t5 = setTimeout(() => { if (!skipRef.current) onFinish(); }, totalDuration + 700);

    return () => {
      cancelAnimationFrame(animRef.current);
      clearTimeout(initTimer);
      [t1, t2, t3, t4, t5].forEach(clearTimeout);
    };
  }, [onFinish]);

  const showText = phase === "text" || phase === "tagline" || phase === "exit";
  const showTagline = phase === "tagline" || phase === "exit";

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-primary transition-opacity duration-500 ${
        phase === "exit" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Canvas for dot + logo animation */}
      <canvas
        ref={canvasRef}
        className="w-[200px] h-[200px]"
        style={{ marginBottom: -20 }}
      />

      {/* Wordmark */}
      <p
        className="text-2xl font-semibold tracking-wide transition-all duration-500"
        style={{
          color: "rgba(255,255,255,0.95)",
          opacity: showText ? 1 : 0,
          transform: showText ? "translateY(0)" : "translateY(12px)",
          fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        e-Lekha
      </p>

      {/* Tagline */}
      <p
        className="mt-1.5 text-xs tracking-widest uppercase transition-all duration-500"
        style={{
          color: "rgba(255,255,255,0.45)",
          opacity: showTagline ? 1 : 0,
          transform: showTagline ? "translateY(0)" : "translateY(8px)",
        }}
      >
        Business Management
      </p>

      {/* Skip */}
      <button
        onClick={handleSkip}
        className="absolute bottom-10 text-sm transition-opacity duration-300"
        style={{
          color: "rgba(255,255,255,0.4)",
          opacity: phase !== "init" ? 1 : 0,
        }}
      >
        Skip
      </button>
    </div>
  );
};

export default SplashScreen;
