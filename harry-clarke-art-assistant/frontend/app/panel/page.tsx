import Background from "../component/background";
import Glass from "../component/glass";
import Button from "../component/button";
import { IoChatboxEllipses } from "react-icons/io5";

export default function PanelPage() {
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
          Panel Explorer
        </span>

        <div className="h-full w-full">
          <Button
            href="/chat"
            icon={<IoChatboxEllipses size={32} />}
            style={{ position: "absolute", top: "20px", left: "20px" }}
          />
          <div className="flex h-full items-center justify-center px-8 text-center text-white">
            <p className="max-w-xl text-lg text-white/80">
              Panel exploration content has not been added to this route yet.
            </p>
          </div>
        </div>
      </Glass>
    </div>
  );
}
