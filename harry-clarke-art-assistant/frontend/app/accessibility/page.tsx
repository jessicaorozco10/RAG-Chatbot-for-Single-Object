"use client";

import { IoChatboxEllipses } from "react-icons/io5";
import Background from "../component/background";
import Button from "../component/button";
import { useState } from "react";
import {
  setAccessibilitySettings,
  getAccessibilitySettings,
} from "@/lib/accesabilityStorage";

/**
 * Accessibility settings page
 * Allows users to adjust text size and letter spacing with a preview
 * and apply changes explicitly to persist them.
 */
export default function Accessibility() {
  const savedSettings = getAccessibilitySettings();
  const [textSize, setTextSize] = useState(savedSettings?.textScale ?? 16);
  const [spacing, setSpacing] = useState(savedSettings?.letterSpacing ?? 0);
  const [applied, setApplied] = useState(false);

  const MIN_TEXT = 16;
  const MAX_TEXT = 32;
  const MIN_SPACE = 0;
  const MAX_SPACE = 1;

  /**
   * Persist accessibility settings to storage and show confirmation feedback.
   */
  const handleApply = () => {
    setAccessibilitySettings({
      textScale: textSize,
      letterSpacing: spacing,
    });
    setApplied(true);
    setTimeout(() => setApplied(false), 2000);
  };

  /**
   * Update text size locally and reset applied state
   * to indicate unsaved changes exist.
   */
  const handleTextSizeChange = (newValue: number) => {
    setTextSize(newValue);
    setApplied(false);
  };

  /**
   * Update letter spacing locally and reset applied state
   * to indicate unsaved changes exist.
   */
  const handleSpacingChange = (newValue: number) => {
    setSpacing(newValue);
    setApplied(false);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white shadow-[inset_0_0_80px_40px_rgba(113,113,122,0.1)]">
      <Background />

      <div className="relative z-10 h-full w-full">
        <Button
          href="/chat"
          icon={<IoChatboxEllipses size={32} />}
          style={{ position: "absolute", top: "20px", left: "20px" }}
        />
        <span
          style={{
            position: "absolute",
            top: "20px",
            left: "100px",
            color: "white",
            fontSize: "30px",
            fontWeight: 500,
            zIndex: 20,
          }}
        >
          Accessibility
        </span>

        <hr className="absolute top-[80px] left-5 right-5 border-white/30" />

        <div className="absolute top-[85px] bottom-0 left-0 right-0 flex flex-col gap-10 overflow-y-auto px-8 py-6">
          <div className="max-w-[560px] rounded-[28px] border border-white/10 bg-black/15 p-6 backdrop-blur-md">
            <p className="mb-2 text-lg">Text Size</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  handleTextSizeChange(Math.max(MIN_TEXT, textSize - 2))
                }
                className="h-10 w-10 rounded-xl bg-white/80 text-black shadow-md backdrop-blur-md"
              >
                -
              </button>

              <div className="w-16 text-center text-xl">{textSize}</div>

              <button
                onClick={() =>
                  handleTextSizeChange(Math.min(MAX_TEXT, textSize + 2))
                }
                className="h-10 w-10 rounded-xl bg-white/80 text-black shadow-md backdrop-blur-md"
              >
                +
              </button>
            </div>
          </div>

          <div className="max-w-[560px] rounded-[28px] border border-white/10 bg-black/15 p-6 backdrop-blur-md">
            <p className="mb-2 text-lg">Letter Spacing</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  handleSpacingChange(
                    Math.max(MIN_SPACE, Number((spacing - 0.2).toFixed(1)))
                  )
                }
                className="h-10 w-10 rounded-xl bg-white/80 text-black shadow-md backdrop-blur-md"
              >
                -
              </button>

              <div className="w-16 text-center text-xl">
                {spacing.toFixed(1)}
              </div>

              <button
                onClick={() =>
                  handleSpacingChange(
                    Math.min(MAX_SPACE, Number((spacing + 0.2).toFixed(1)))
                  )
                }
                className="h-10 w-10 rounded-xl bg-white/80 text-black shadow-md backdrop-blur-md"
              >
                +
              </button>
            </div>
          </div>

          <div className="max-w-[560px] rounded-[28px] border border-white/10 bg-black/15 p-6 backdrop-blur-md">
            <p className="mb-3 text-lg">Preview</p>
            <hr className="my-3 border-t border-gray-300/40" />
            <div className="max-w-[500px]">
              <p className="mb-1 ml-1 text-lg">Art Assistant</p>

              <div
                className="rounded-xl bg-white/90 p-3 text-black"
                style={{
                  fontSize: `${textSize}px`,
                  letterSpacing: `${spacing}px`,
                }}
              >
                Welcome to FIU Wolfsonian. How can I help you today?
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleApply}
              className="rounded-xl bg-white/80 px-6 py-2 text-sm font-medium text-black shadow-md backdrop-blur-md transition-all hover:bg-white/90 active:scale-95"
            >
              Apply
            </button>

            {applied && (
              <span className="text-sm text-green-400 transition-opacity">
                Settings applied
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
