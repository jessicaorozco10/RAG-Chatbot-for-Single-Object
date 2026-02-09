'use client';

import { useRouter } from 'next/navigation';
import Background from "../component/background";
import Glass from "../component/glass";

export default function Chat() {
  const router = useRouter();

  return (
    <div className="relative w-screen h-screen">
      {/*background with panel*/}
      <Background />

      {/*glass*/}
      <Glass>
        <div className="w-full h-full flex flex-col items-center justify-center p-8">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            chat
          </h1>

          <button
            onClick={() => router.push('/camera')}
            className="w-full max-w-xs mb-3 px-6 py-3 text-xl bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition backdrop-blur-sm border border-white/30"
          >
            Go to Camera
          </button>

          <button
            onClick={() => router.push('/panel')}
            className="w-full max-w-xs px-6 py-3 text-xl bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition backdrop-blur-sm border border-white/30"
          >
            Go to Panel
          </button>
        </div>
      </Glass>
    </div>
  );
}