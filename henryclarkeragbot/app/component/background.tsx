import Image from "next/image";
import React from "react";

const panels = [
  "/assets/panel1.png",
  "/assets/panel2.png",
  "/assets/panel3.png",
  "/assets/panel4.png",
  "/assets/panel5.png",
  "/assets/panel6.png",
  "/assets/panel7.png",
  "/assets/panel8.png",
];

export default function Background() {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      {/*background*/}
      <Image
        src="/assets/background.png"
        alt="Background"
        fill
        className="background"
        priority
      />

      {/*panels grid*/}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
      >
        <div
          className="grid grid-cols-2 w-full h-full"
          style={{
            maxWidth: "100vw",
            maxHeight: "100vh",
            gridTemplateRows: "repeat(4, 1fr)",
            gap: "2px",
          }}
        >
          {panels.map((panel, idx) => (
            <div key={idx} className="relative w-full h-full overflow-hidden">
              <Image
              src={panel}
              alt={`Panel ${idx + 1}`}
              fill
              className="object-cover"
              sizes="50vw"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}