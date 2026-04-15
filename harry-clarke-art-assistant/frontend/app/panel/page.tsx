import Background from "../component/background";
import Button from "../component/button";
import { IoChatboxEllipses } from "react-icons/io5";
import GlassScene from "../component/GlassScene";

export default function PanelPage() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black shadow-[inset_0_0_80px_40px_rgba(113,113,122,0.1)]">
      <Background />

      <div className="relative z-10 h-full w-full">
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

        <hr
          className="absolute top-[80px] left-5 right-5 border-white/30"
          style={{ zIndex: 1200 }}
        />

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

        <div className="absolute top-[80px] left-0 right-0 bottom-0 p-4">
          <div className="h-full w-full rounded-[28px] border border-white/10 bg-black/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-[2px]">
            <GlassScene width="100%" height="100%" />
          </div>
        </div>
      </div>
    </div>
  );
}
