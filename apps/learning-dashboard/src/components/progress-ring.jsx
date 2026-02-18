"use client";

import clsx from "clsx";

export function ProgressRing({ value = 0, size = 44, stroke = 4, showLabel = false }) {
  const normalized = Math.max(0, Math.min(100, Number(value) || 0));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (normalized / 100) * circumference;

  return (
    <div className="progress-ring" style={{ width: size, height: size }} aria-label={`Progress ${Math.round(normalized)}%`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          className="ring-bg"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          className={clsx("ring-fg", normalized < 50 && "ring-fg-low")}
          strokeDasharray={`${dash} ${circumference - dash}`}
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          strokeLinecap="round"
        />
      </svg>
      {showLabel ? <span className="progress-ring-label">{Math.round(normalized)}</span> : null}
    </div>
  );
}
