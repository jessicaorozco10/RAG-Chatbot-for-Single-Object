import { CiSettings } from "react-icons/ci";
import { FaUniversalAccess } from "react-icons/fa";
import { CiCamera } from "react-icons/ci";
import { CiCompass1 } from "react-icons/ci";
import Button from "../component/button";
import Background from "../component/background";
import Glass from "../component/glass";
import Image from "next/image";
import ChatUI from "../component/chat";

export default function Chat() {
  return (
    <div className="relative w-screen h-screen">
      <Background />

      <Glass>
        {/*fiu image*/}
        <Image
          src="/assets/the-wolfsonian.png"
          alt="The Wolfsonian"
          width={160}
          height={80}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 20,
          }}
        />

        {/*text under image*/}
        <span
          style={{
            position: 'absolute',
            top: '60px',
            left: '40px',
            color: 'white',
            fontSize: '10px',
            fontWeight: 500,
            zIndex: 20,
          }}
        >
          Harry Clarke Art Assistant
        </span>

        <div className="w-full h-full">


          {/*accesability button*/}
          <Button
            href="/accessibility"
            icon={<FaUniversalAccess size={32}/>}
            style={{ position: 'absolute', top: '20px', right: '20px' }}
          />


          {/*panel button*/}
          <Button
            href="/panel"
            icon={<CiCompass1 size={32}/>}
            style={{ position: 'absolute', top: '100px', right: '20px' }}
          />
        </div>
        {/* Chat area */}
          <div
            className="absolute inset-x-0 bottom-0 z-10"
            style={{
              paddingTop: "120px", // space below logo/text
              paddingLeft: "20px",
              paddingRight: "20px",
              paddingBottom: "20px",
              height: "80vh",
            }}
          >
            <ChatUI
              userBubbleClass="bg-white/80 text-black"
              assistantBubbleClass="bg-blue-500/30 text-white"
              inputClass="bg-white/80 text-black"
              sendButtonClass="bg-white/80 text-black"
            />
          </div>
      </Glass>
    </div>
  );
}