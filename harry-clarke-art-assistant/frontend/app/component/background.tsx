export default function Background() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_35%),linear-gradient(160deg,_#050505_0%,_#141414_45%,_#1e1e1e_100%)]"
    >
      <div className="absolute inset-x-[-10%] top-[-20%] h-[45vh] rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-[-15%] right-[-10%] h-[40vh] w-[40vh] rounded-full bg-white/5 blur-3xl" />
    </div>
  );
}
