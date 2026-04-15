import { FaUniversalAccess } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Button from "../component/button";
import Image from "next/image";
import ChatUI from "../component/chat";
import Background from "../component/background";

export default function ChatPage() {
  return (
    <div className="relative h-screen w-screen bg-black shadow-[inset_0_0_80px_40px_rgba(113,113,122,0.1)]">
      <Background />

      <Image
        src="/assets/HARRYCLARK_GENEVA WINDOW.jpg"
        alt="Harry Clarke Geneva Window"
        width={60}
        height={240}
        style={{
          position: "absolute",
          top: "20px",
          left: "10px",
          zIndex: 20,
          height: "auto",
        }}
      />

      <Image
        src="/assets/the-wolfsonian.png"
        alt="The Wolfsonian"
        width={160}
        height={31}
        style={{
          position: "absolute",
          top: "20px",
          left: "75px",
          zIndex: 20,
        }}
      />

      <span
        style={{
          position: "absolute",
          top: "60px",
          left: "95px",
          color: "white",
          fontSize: "11px",
          fontWeight: 500,
          zIndex: 20,
        }}
      >
        Harry Clarke Art Assistant
      </span>

      <div className="h-full w-full relative z-10">
        <Button
          href="/accessibility"
          icon={<FaUniversalAccess size={32} />}
          style={{ position: "absolute", top: "20px", right: "15px" }}
        />
        <p
          style={{
            position: "absolute",
            top: "70px",
            right: "10px",
            color: "white",
            fontSize: "11px",
            fontWeight: 500,
          }}
        >
          Accessibility
        </p>

        <Button
          href="/panel"
          icon={<FaMagnifyingGlass size={32} />}
          style={{ position: "absolute", top: "20px", right: "85px" }}
        />
        <p
          style={{
            position: "absolute",
            top: "70px",
            right: "83px",
            color: "white",
            fontSize: "11px",
            fontWeight: 500,
          }}
        >
          See Panels
        </p>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 z-10"
        style={{
          paddingTop: "20px",
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingBottom: "20px",
          height: "88vh",
        }}
      >
        <ChatUI />
      </div>
    </div>
  );
}
