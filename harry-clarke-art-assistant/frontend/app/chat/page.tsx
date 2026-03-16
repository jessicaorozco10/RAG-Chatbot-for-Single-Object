import { CiSettings } from "react-icons/ci";
import { FaUniversalAccess } from "react-icons/fa";
import { CiCamera } from "react-icons/ci";
import { MdExplore } from "react-icons/md";
import Button from "../component/button";
import Image from "next/image";
import ChatUI from "../component/chat";

export default function Chat() {
  return (
    <div className="relative w-screen h-screen bg-black">
      

      
        {/*fiu image*/}
        <Image
          src="/assets/the-wolfsonian.png"
          alt="The Wolfsonian"
          width={160}
          height={31}
          style={{
            position: 'absolute',
            top: '20px',
            left: '100px',
            zIndex: 20,
          }}
        />

        {/*text under image*/}
        <span
          style={{
            position: 'absolute',
            top: '60px',
            left: '120px',
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
            icon={<MdExplore size={32}/>}
            style={{ position: 'absolute', top: '20px', left: '20px' }}
          />
        </div>
        {/* Chat area */}
          <div
            className="absolute inset-x-0 bottom-0 z-10"
            style={{
              paddingTop: "20px", // space below logo/text
              paddingLeft: "20px",
              paddingRight: "20px",
              paddingBottom: "20px",
              height: "88vh",
            }}
          >
            <ChatUI
              
            />
          </div>
      
    </div>
  );
}