import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface Props {
  size?: number;
}

/**
 * Althea mascot avatar — blue water-drop character with eyes, smile, and an EKG line.
 * Uses react-native-svg so it renders crisply at any size on all platforms.
 */
export function AltheaAvatar({ size = 36 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      {/* ── Drop body ── */}
      <Path
        d="M20,2 C12,10 5,18 5,26 C5,33.7 12,38 20,38 C28,38 35,33.7 35,26 C35,18 28,10 20,2 Z"
        fill="#3AABF0"
      />

      {/* ── Soft highlight (top-left gloss) ── */}
      <Circle cx="14" cy="13" r="4" fill="rgba(255,255,255,0.28)" />

      {/* ── EKG / heart-rate line ── */}
      <Path
        d="M9,17 L12.5,17 L14.5,12 L16.5,22 L18.5,14 L20.5,17 L31,17"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={0.9}
      />

      {/* ── Left eye ── */}
      <Circle cx="15" cy="26" r="2.9" fill="white" />
      <Circle cx="15.6" cy="26.6" r="1.4" fill="#1A1A2E" />
      {/* eye-shine */}
      <Circle cx="14.8" cy="25.6" r="0.55" fill="white" />

      {/* ── Right eye ── */}
      <Circle cx="25" cy="26" r="2.9" fill="white" />
      <Circle cx="25.6" cy="26.6" r="1.4" fill="#1A1A2E" />
      <Circle cx="24.8" cy="25.6" r="0.55" fill="white" />

      {/* ── Smile ── */}
      <Path
        d="M15.5,31.5 Q20,36 24.5,31.5"
        stroke="white"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}
