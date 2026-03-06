'use client';

import { useRouter } from 'next/navigation';

export default function Camera() {
  const router = useRouter();

  return (
    <div style={{ 
      backgroundColor: 'white', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center',
      gap: '20px'
    }}>
      <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '30px' }}>
        camera
      </h1>
      
      <button
        onClick={() => router.push('/chat')}
        style={{
          padding: '15px 30px',
          fontSize: '20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '500'
        }}
      >
        Go to Chat
      </button>
    </div>
  );
}