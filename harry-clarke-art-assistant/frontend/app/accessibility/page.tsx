import { CiSettings } from "react-icons/ci";
import { FaUniversalAccess } from "react-icons/fa";
import { CiCamera } from "react-icons/ci";
import { MdExplore } from "react-icons/md";
import Button from "../component/button";
import Background from "../component/background";
import Glass from "../component/glass";
import Image from "next/image";
import ChatUI from "../component/chat";
import { IoChatboxEllipses } from "react-icons/io5";

export default function Chat() {
  return (
    <div className="relative w-screen h-screen">
      <Background />

      <Glass>
        

        <div className="w-full h-full">


          {/*accesability button*/}
          <Button
            href="/chat"
            icon={<IoChatboxEllipses size={32}/>}
            style={{ position: 'absolute', top: '20px', left: '20px' }}
          />


          
        </div>
        
      </Glass>
    </div>
  );
}