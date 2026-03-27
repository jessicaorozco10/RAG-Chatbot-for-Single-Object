import type { ReactNode } from "react";

interface GlassProps {
  children: ReactNode;
}

export default function Glass({ children }: GlassProps) {
  return (
    <div className="absolute inset-4 z-10 rounded-[28px] border border-white/20 bg-white/8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      {children}
    </div>
  );
}
