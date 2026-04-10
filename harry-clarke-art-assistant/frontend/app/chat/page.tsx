import { FaUniversalAccess } from "react-icons/fa";
import { MdExplore } from "react-icons/md";
import Button from "../component/button";
import Image from "next/image";
import ChatUI from "../component/chat";
import Background from "../component/background";

export default function ChatPage() {
  return (
    <div className="relative h-screen w-screen bg-black shadow-[inset_0_0_80px_40px_rgba(113,113,122,0.1)]">
      <Image
        src="/assets/the-wolfsonian.png"
        alt="The Wolfsonian"
        width={160}
        height={31}
        style={{
          position: "absolute",
          top: "20px",
          left: "100px",
          zIndex: 20,
        }}
      />

      <span
        style={{
          position: "absolute",
          top: "60px",
          left: "120px",
          color: "white",
          fontSize: "10px",
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
          style={{ position: "absolute", top: "20px", right: "20px" }}
        />

        <Button
          href="/panel"
          icon={<MdExplore size={32} />}
          style={{ position: "absolute", top: "20px", left: "20px" }}
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
