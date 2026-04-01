import { useEffect, useState } from "react";

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [phase, setPhase] = useState<"logo" | "text" | "exit">("logo");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 600);
    const t2 = setTimeout(() => setPhase("exit"), 2200);
    const t3 = setTimeout(onFinish, 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-primary transition-opacity duration-500 ${
        phase === "exit" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Animated rings */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        <div
          className={`absolute inset-0 rounded-full border-2 border-primary-foreground/20 transition-all duration-700 ease-out ${
            phase !== "logo" ? "scale-[1.8] opacity-0" : "scale-100 opacity-100"
          }`}
        />
        <div
          className={`absolute inset-2 rounded-full border border-primary-foreground/10 transition-all duration-1000 ease-out delay-200 ${
            phase !== "logo" ? "scale-[2] opacity-0" : "scale-100 opacity-100"
          }`}
        />

        {/* Logo icon */}
        <div
          className={`relative z-10 transition-all duration-700 ease-out ${
            phase === "logo"
              ? "scale-0 opacity-0"
              : "scale-100 opacity-100"
          }`}
          style={{ animationDelay: "100ms" }}
        >
          <div className="w-24 h-24 rounded-3xl bg-primary-foreground/15 backdrop-blur-sm flex items-center justify-center border border-primary-foreground/20 shadow-2xl">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              {/* Stylized "e" for eLekha */}
              <circle cx="28" cy="28" r="18" stroke="white" strokeWidth="3" fill="none" opacity="0.9" />
              <path
                d="M18 28h20M28 18c-6 0-10 4.5-10 10s4 10 10 10c4 0 7-2 9-5"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              {/* Ledger lines */}
              <line x1="14" y1="44" x2="42" y2="44" stroke="white" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
              <line x1="18" y1="48" x2="38" y2="48" stroke="white" strokeWidth="1.5" opacity="0.25" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* App name */}
      <div
        className={`mt-8 text-center transition-all duration-700 ease-out ${
          phase === "text" ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <h1 className="text-4xl font-extrabold text-primary-foreground tracking-tight">
          e<span className="text-primary-foreground/80">Lekha</span>
        </h1>
        <p className="text-primary-foreground/60 text-sm mt-2 font-medium tracking-widest uppercase">
          Business Management
        </p>
      </div>

      {/* Loading dots */}
      <div
        className={`mt-12 flex gap-2 transition-all duration-500 ${
          phase === "text" ? "opacity-100" : "opacity-0"
        }`}
      >
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-primary-foreground/50"
            style={{
              animation: "pulse 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Bottom branding */}
      <div
        className={`absolute bottom-10 transition-all duration-500 ${
          phase === "text" ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-primary-foreground/30 text-[10px] tracking-wider">
          Powered by eLekha • v2.0
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
