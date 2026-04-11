import { FaUniversalAccess } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import Button from "../component/button";
import Image from "next/image";
import ChatUI from "../component/chat";
import Background from "../component/background";

export default function ChatPage() {
  return (
    <div className="relative h-screen w-screen bg-black shadow-[inset_0_0_80px_40px_rgba(113,113,122,0.1)]">
      <Background />
      <Image
        src="/assets/the-wolfsonian.png"
        alt="The Wolfsonian"
        width={160}
        height={31}
        style={{
          position: "absolute",
          top: "20px",
          left: "65px",
          zIndex: 20,
        }}
      />

      <span
        style={{
          position: "absolute",
          top: "60px",
          left: "85px",
          color: "white",
          fontSize: "11px",
          fontWeight: 500,
          zIndex: 20,
        }}
      >
        Harry Clarke Art Assistant
      </span>

      <div className="h-full w-full">
        <Button
          href="/accessibility"
          icon={<FaUniversalAccess size={32} />}
          style={{ position: "absolute", top: "20px", right: "15px" }}
        />
        <p style={{ position: "absolute", top: "75px", right: "10px", color: "white", fontSize: "11px", fontWeight: 500, zIndex: 50}}> Accessibility </p>
        <Button
          href="/panel"
          icon={<FaRegEye size={32} />}
          style={{ position: "absolute", top: "20px", right: "90px" }}
        />
        <p style={{ position: "absolute", top: "75px", right: "87px", color: "white", fontSize: "11px", fontWeight: 500, zIndex: 50}}> See Panels </p>

          <Image src="/assets/HARRYCLARK_GENEVA WINDOW.jpg"
                 alt="Harry Clarke Geneva Window"
                 height= {88}
                 width={50}
                 style={{
                     position: "absolute",
                     top: "10px",
                     left: "9px",
                     zIndex: 20,
                 }}
          />
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
