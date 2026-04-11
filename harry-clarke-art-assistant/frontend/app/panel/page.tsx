import Background from "../component/background";
import Button from "../component/button";
import { IoChatboxEllipses } from "react-icons/io5";
import GlassScene from "../component/GlassScene";

export default function PanelPage() {
  return (
    <div className="relative h-screen w-screen bg-black shadow-[inset_0_0_80px_40px_rgba(113,113,122,0.1)]">
      <Background />

      {/* title */}
      <span
        style={{
          position: "absolute",
          top: "20px",
          left: "100px",
          color: "white",
          fontSize: "30px",
          fontWeight: 500,
          zIndex: 1200,
        }}
      >
        Panel Explorer
      </span>

      {/* divider */}
      <hr
        className="absolute top-[80px] left-5 right-5 border-white/30"
        style={{ zIndex: 1200 }}
      />

      {/* chat */}
      <Button
        href="/chat"
        icon={<IoChatboxEllipses size={32} />}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 1200,
        }}
      />

      {/* glass scene */}
      <div className="absolute top-[80px] left-0 right-0 bottom-0 p-4">
        <GlassScene width="100%" height="100%" initialTime={50} />
      </div>
    </div>
  );
}

