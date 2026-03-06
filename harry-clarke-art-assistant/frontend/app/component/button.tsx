import React from 'react';
import Link from "next/link";

interface ButtonProps {
  icon: React.ReactNode; // use for icon
  href: string; // use for link
  size?: number; // use for button size
  label?: string; // use for label
  style?: React.CSSProperties; // use for position 
}

export default function Button({ icon, href, size = 48, label, style }: ButtonProps) {
  return (
    <Link
      href={href}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: label ? '8px' : '0', // space between icon and label
        height: `${size}px`,       // keep button height same as icon size
        minWidth: `${size}px`,     // keep button width same as icon size
        padding: label ? '0 12px' : '0', // extra horizontal space for label
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px 0 rgba(7, 11, 38, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.8)',
        border: 'none',
        cursor: 'pointer',
        color: 'black',
        textDecoration: 'none',
        zIndex: 10,
        ...style,
      }}
    >
      <div style={{
        position: 'absolute',
        inset: '-2px',
        background: 'linear-gradient(45deg, rgba(7, 11, 38, 0.4), rgba(7, 11, 38, 0.4))',
        filter: 'blur(10px)',
        borderRadius: '12px',
        zIndex: -1,
      }} />
      {icon}
      {label && (
        <span style={{ marginTop: '4px', fontSize: '14px', fontWeight: 500, color: 'black' }}>
          {label}
        </span>
      )}
    </Link>
  );
}