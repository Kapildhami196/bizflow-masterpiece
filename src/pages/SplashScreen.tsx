import { useEffect, useState, useRef, useCallback } from "react";

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const logoCanvasRef = useRef<HTMLCanvasElement>(null);
  const textCanvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"logo" | "text" | "exit">("logo");

  // Draw the logo: green rounded square with "e" and sparkle dots
  useEffect(() => {
    const canvas = logoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const s = 200;
    canvas.width = s * 2;
    canvas.height = s * 2;
    ctx.scale(2, 2);

    let progress = 0;
    const totalFrames = 50;

    function drawLogo(p: number) {
      ctx.clearRect(0, 0, s, s);
      const t = Math.min(p, 1);

      // Rounded square background with gradient
      const pad = 20;
      const size = s - pad * 2;
      const radius = 36;
      const cx = s / 2;
      const cy = s / 2;

      ctx.save();
      ctx.globalAlpha = t;

      // Green gradient background
      const grad = ctx.createLinearGradient(pad, pad, pad + size, pad + size);
      grad.addColorStop(0, "#4ade80");
      grad.addColorStop(0.5, "#22c55e");
      grad.addColorStop(1, "#15803d");

      ctx.beginPath();
      ctx.moveTo(pad + radius, pad);
      ctx.lineTo(pad + size - radius, pad);
      ctx.quadraticCurveTo(pad + size, pad, pad + size, pad + radius);
      ctx.lineTo(pad + size, pad + size - radius);
      ctx.quadraticCurveTo(pad + size, pad + size, pad + size - radius, pad + size);
      ctx.lineTo(pad + radius, pad + size);
      ctx.quadraticCurveTo(pad, pad + size, pad, pad + size - radius);
      ctx.lineTo(pad, pad + radius);
      ctx.quadraticCurveTo(pad, pad, pad + radius, pad);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Subtle glass shine
      ctx.save();
      ctx.clip();
      const shine = ctx.createLinearGradient(pad, pad, pad + size * 0.6, pad + size * 0.6);
      shine.addColorStop(0, "rgba(255,255,255,0.25)");
      shine.addColorStop(0.5, "rgba(255,255,255,0.05)");
      shine.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = shine;
      ctx.fillRect(pad, pad, size, size);
      ctx.restore();

      // Draw "e" letter
      if (t > 0.2) {
        const eAlpha = Math.min((t - 0.2) / 0.4, 1);
        ctx.globalAlpha = eAlpha;
        ctx.font = "bold 80px 'Georgia', serif";
        ctx.fillStyle = "#15503a";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("e", cx - 4, cy + 6);
      }

      // Sparkle dots (top-right area)
      if (t > 0.5) {
        const sparkleAlpha = Math.min((t - 0.5) / 0.3, 1);
        ctx.globalAlpha = sparkleAlpha;
        const dots = [
          { x: cx + 24, y: cy - 32, r: 3.5 },
          { x: cx + 34, y: cy - 38, r: 2.5 },
          { x: cx + 30, y: cy - 24, r: 2 },
          { x: cx + 40, y: cy - 30, r: 3 },
          { x: cx + 36, y: cy - 44, r: 2 },
          { x: cx + 46, y: cy - 36, r: 2.5 },
          { x: cx + 28, y: cy - 46, r: 1.8 },
        ];
        dots.forEach((dot) => {
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.9)";
          ctx.fill();
        });
      }

      ctx.restore();
    }

    function animate() {
      const t = progress / totalFrames;
      drawLogo(t);
      progress++;
      if (progress <= totalFrames) {
        requestAnimationFrame(animate);
      }
    }

    animate();
  }, []);

  // Handwriting animation for "eLekha"
  useEffect(() => {
    if (phase !== "text") return;
    const canvas = textCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const w = 400;
    const h = 80;
    canvas.width = w * 2;
    canvas.height = h * 2;
    ctx.scale(2, 2);

    // Pre-render the full text to get its image data
    ctx.font = "bold 42px 'Georgia', serif";
    ctx.fillStyle = "#ffffff";
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";

    // Measure text
    const textStr = "eLekha";
    const metrics = ctx.measureText(textStr);
    const textWidth = metrics.width;
    const startX = (w - textWidth) / 2;

    // Draw full text offscreen to capture pixel data
    ctx.clearRect(0, 0, w, h);
    ctx.fillText(textStr, startX, h / 2);
    const fullImageData = ctx.getImageData(0, 0, w * 2, h * 2);

    // Clear and animate with left-to-right reveal
    ctx.clearRect(0, 0, w, h);

    let revealX = 0;
    const totalRevealFrames = 60;
    const revealWidth = w * 2; // in canvas pixels

    function animateText() {
      ctx.clearRect(0, 0, w, h);

      // Put the full image data
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = w * 2;
      tempCanvas.height = h * 2;
      const tempCtx = tempCanvas.getContext("2d")!;
      tempCtx.putImageData(fullImageData, 0, 0);

      // Draw only the revealed portion
      const currentReveal = Math.min(revealX, revealWidth);
      if (currentReveal > 0) {
        ctx.drawImage(tempCanvas, 0, 0, currentReveal, h * 2, 0, 0, currentReveal / 2, h);
      }

      // Draw a subtle cursor/pen at the reveal edge
      if (revealX < revealWidth) {
        const cursorX = currentReveal / 2;
        ctx.beginPath();
        ctx.arc(cursorX, h / 2, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fill();
      }

      revealX += revealWidth / totalRevealFrames;

      if (revealX <= revealWidth + 10) {
        requestAnimationFrame(animateText);
      }
    }

    animateText();
  }, [phase]);

  // Phase transitions
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 1200);
    const t2 = setTimeout(() => setPhase("exit"), 3200);
    const t3 = setTimeout(onFinish, 3800);
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
      {/* Logo icon */}
      <div className="w-[100px] h-[100px] flex items-center justify-center">
        <canvas ref={logoCanvasRef} className="w-[100px] h-[100px]" />
      </div>

      {/* Handwritten text reveal */}
      <div className="mt-6">
        <canvas
          ref={textCanvasRef}
          className="w-[200px] h-[40px]"
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
