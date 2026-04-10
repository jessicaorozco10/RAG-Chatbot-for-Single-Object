"use client";

import { IoChatboxEllipses } from "react-icons/io5";
import Background from "../component/background";
import Button from "../component/button";
import { useState, useEffect } from "react";
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
  const [textSize, setTextSize] = useState(16);
  const [spacing, setSpacing] = useState(0);
  const [applied, setApplied] = useState(false);

  const MIN_TEXT = 16;
  const MAX_TEXT = 40;
  const MIN_SPACE = 0;
  const MAX_SPACE = 1;

  /**
   * Load previously saved accessibility settings on mount
   * so UI reflects persisted user preferences.
   */
  useEffect(() => {
    const saved = getAccessibilitySettings();
    if (saved) {
      setTextSize(saved.textScale);
      setSpacing(saved.letterSpacing);
    }
  }, []);

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
    <div className="relative w-screen h-screen bg-black text-white overflow-hidden">
      <Background />
      <Button
        href="/chat"
        icon={<IoChatboxEllipses size={32} />}
        style={{ position: "absolute", top: "20px", left: "20px" }}
      />
      <div className="absolute top-[20px] left-[100px] text-[30px] font-medium">
        Accessibility
      </div>

      <hr className="absolute top-[80px] left-5 right-5 border-white/30" />

      <div className="absolute top-[100px] bottom-0 left-0 right-0 flex flex-col px-8 py-6 gap-10 overflow-y-auto">

        {/* Text size controls */}
        <div>
          <p className="mb-2 text-sm opacity-80">Text Size</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                handleTextSizeChange(Math.max(MIN_TEXT, textSize - 2))
              }
              className="w-10 h-10 border border-white/40 rounded"
            >
              −
            </button>

            <div className="w-16 text-center text-xl">{textSize}</div>

            <button
              onClick={() =>
                handleTextSizeChange(Math.min(MAX_TEXT, textSize + 2))
              }
              className="w-10 h-10 border border-white/40 rounded"
            >
              +
            </button>
          </div>
        </div>

        {/* Letter spacing controls */}
        <div>
          <p className="mb-2 text-sm opacity-80">Letter Spacing</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                handleSpacingChange(
                  Math.max(MIN_SPACE, Number((spacing - 0.2).toFixed(1)))
                )
              }
              className="w-10 h-10 border border-white/40 rounded"
            >
              −
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
              className="w-10 h-10 border border-white/40 rounded"
            >
              +
            </button>
          </div>
        </div>

        {/* Live preview of accessibility changes */}
        <div>
          <p className="mb-3 text-sm opacity-80">Preview</p>

          <div className="max-w-[500px]">
            <p className="text-xs opacity-60 ml-1 mb-1">Art Assistant</p>

            <div
              className="bg-white/90 text-black p-3 rounded-xl"
              style={{
                fontSize: `${textSize}px`,
                letterSpacing: `${spacing}px`,
              }}
            >
              Welcome to FIU Wolfsonian. How can I help you today?
            </div>
          </div>
        </div>

        {/* Apply settings button confirmation feedback */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleApply}
            className="px-6 py-2 rounded-lg bg-white text-black font-medium text-sm transition-all hover:bg-white/90 active:scale-95"
          >
            Apply
          </button>

          {applied && (
            <span className="text-sm text-green-400 transition-opacity">
              ✓ Settings applied
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
