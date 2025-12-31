import React from "react";

interface PyjamaIconProps {
  className?: string;
}

export default function PyjamaIcon({ className = "h-6 w-6" }: PyjamaIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Waistband top */}
      <line x1="6" y1="6" x2="18" y2="6" />

      {/* Left leg outer */}
      <line x1="6" y1="6" x2="6" y2="18" />

      {/* Left leg inner */}
      <line x1="11" y1="6" x2="11" y2="18" />

      {/* Right leg inner */}
      <line x1="13" y1="6" x2="13" y2="18" />

      {/* Right leg outer */}
      <line x1="18" y1="6" x2="18" y2="18" />

      {/* Left leg bottom */}
      <line x1="6" y1="18" x2="11" y2="18" />

      {/* Right leg bottom */}
      <line x1="13" y1="18" x2="18" y2="18" />
    </svg>
  );
}
