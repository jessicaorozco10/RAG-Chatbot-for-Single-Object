export default function Background() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#080808]">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, #000000 0%, #141414 30%, #000000 100%)`,
        }}
      />

      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
