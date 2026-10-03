/**
 * Central motion tokens — calibrate here, not in JSX.
 */

import { publicUrl } from "../lib/publicUrl";

export const MOTION_DEBUG = false;

export const motion = {
  /** animejs named easings — prefer ease-out for enter */
  easeOut: "outExpo",
  easeInOut: "inOutCubic",
  easeSoft: "outQuad",
  /** CSS cubic-bezier mirrors of Emil tokens */
  cssEaseOut: "cubic-bezier(0.23, 1, 0.32, 1)",
  cssEaseInOut: "cubic-bezier(0.77, 0, 0.175, 1)",

  fast: 200,
  medium: 420,
  /** Scroll marketing reveals may exceed UI 300ms budget */
  slow: 560,
  reveal: 720,

  pointerEase: 0.08,
  parallaxEase: 0.06,

  maxPointerMove: 32,
  maxParallax: 24,
} as const;

/**
 * About scroll choreography (progress 0 → 1 while pinned):
 * 1. Title + big image already visible → scroll scale-up (ease-in-out)
 * 2. Left copy typewriter
 * 3. Mid image scale-in & settle
 * 4. Small image scale-in & settle
 * 5. Right copy typewriter
 */
export const aboutMotion = {
  trackVh: 420,
  /** Phone only — shorter pin before Works */
  trackVhMobile: 220,

  stages: {
    bigIn: { start: 0, end: 0.22 },
    leftType: 0.24,
    midIn: { start: 0.38, end: 0.54 },
    smallIn: { start: 0.58, end: 0.74 },
    rightType: 0.78,
  },

  /** Phone: finish all images, then type copy */
  stagesMobile: {
    bigIn: { start: 0, end: 0.22 },
    midIn: { start: 0.28, end: 0.48 },
    smallIn: { start: 0.52, end: 0.72 },
    leftType: 0.78,
    rightType: 0.86,
  },

  typeSpeed: 22,

  /** Phone layout only below this width; iPad uses desktop */
  mobileMaxWidth: 767,

  images: [
    {
      src: publicUrl("images/about/big.jpg"),
      left: 52,
      top: 52,
      fromTop: 92,
      width: 28.6,
      aspect: 3 / 4,
      fromScale: 0.58,
      tone: "#e8e4de",
      visibleFromStart: true,
      mobile: { left: 52, top: 36, fromTop: 88, width: 56 },
    },
    {
      src: publicUrl("images/about/mid.jpg"),
      left: 68,
      top: 37,
      fromTop: 88,
      width: 12.75,
      aspect: 4 / 3,
      fromScale: 0.55,
      tone: "#d4cfc7",
      visibleFromStart: false,
      mobile: { left: 70, top: 48, fromTop: 92, width: 36.8 },
    },
    {
      src: publicUrl("images/about/small.png"),
      left: 36,
      top: 62,
      fromTop: 95,
      width: 11,
      aspect: 3 / 4,
      fromScale: 0.55,
      tone: "#f0ebe4",
      visibleFromStart: false,
      mobile: { left: 28, top: 58, fromTop: 90, width: 14.4 },
    },
  ] as const,
} as const;

export type AboutMotionConfig = typeof aboutMotion;
