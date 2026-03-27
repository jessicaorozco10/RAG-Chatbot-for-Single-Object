import Button from "../component/button";
import Background from "../component/background";
import Glass from "../component/glass";
import { IoChatboxEllipses } from "react-icons/io5";

export default function AccessibilityPage() {
  return (
    <div className="relative h-screen w-screen">
      <Background />
      <Glass>
        <span
          style={{
            position: "absolute",
            top: "20px",
            left: "100px",
            color: "white",
            fontSize: "30px",
            fontWeight: 500,
            zIndex: 20,
          }}
        >
          Accessibility
        </span>

        <div className="h-full w-full">
          <Button
            href="/chat"
            icon={<IoChatboxEllipses size={32} />}
            style={{ position: "absolute", top: "20px", left: "20px" }}
          />
          <hr
            className="absolute border-white/50"
            style={{
              top: "80px",
              left: "20px",
              right: "20px",
            }}
          />
        </div>
      </Glass>
    </div>
  );
}
