'use client';

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
        className="absolute w-full px-2"
        style={{
          top: '5%',
          bottom: '5%',
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center'
        }}
      >
        <div 
          className="grid grid-cols-2 w-full max-w-2xl"
          style={{
            height: '100%',
            gridTemplateRows: 'repeat(4, 1fr)',
            rowGap: '4px', // vertical space
            columnGap: '4px' // horizontal space
          }}
        >
          {panels.map((panel, idx) => (
            <div key={idx} className="relative w-full h-full">
              <Image
                src={panel}
                alt={`Panel ${idx + 1}`}
                fill
                className="object-cover" // fill completely
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}