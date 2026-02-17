import React from 'react';
// children allow you to pass in any react elements inside the glass box
interface GlassProps {
  children?: React.ReactNode;
}

export default function Glass({ children }: GlassProps) {
  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      right: '10px',
      bottom: '10px',
      background: 'rgba(7, 11, 38, 0.4)',
      backdropFilter: 'blur(10px)', // blur
      WebkitBackdropFilter: 'blur(10px)', // safari support
      borderRadius: '20px',
      boxShadow: '0 8px 32px 0 rgba(7, 11, 38, 0.4), 0 0 0 1px rgba(7, 11, 38, 0.8)', // make outline
      overflow: 'hidden',
      zIndex: 10,
    }}>
      <div style={{
        position: 'absolute',
        inset: '-2px',
        background: 'linear-gradient(45deg, rgba(7, 11, 38, 0.4), rgba(7, 11, 38, 0.4))', // make box look color
        filter: 'blur(10px)',
        borderRadius: '20px',
        zIndex: -1,
      }} />
      {children}
    </div>
  );
}