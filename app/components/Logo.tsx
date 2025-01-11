import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function Logo({ className = '', width = 101, height = 100 }: LogoProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 101 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M100.889 0H0.888885V100H100.889V0ZM36.9167 27.7778V72.2222H53.4246C59.7738 72.2222 64.8532 67.1429 64.8532 60.7937V58.254C64.8532 54.6349 63.2024 51.4603 60.6627 49.3651C62.504 47.3968 63.5833 44.6667 63.5833 41.746V39.2063C63.5833 32.8571 58.504 27.7778 52.1548 27.7778H36.9167ZM53.4246 65.873H43.2659V53.1746H53.4246C56.2817 53.1746 58.504 55.3968 58.504 58.254V60.7937C58.504 63.6508 56.2817 65.873 53.4246 65.873ZM52.1548 46.8254H43.2659V34.127H52.1548C55.0119 34.127 57.2341 36.3492 57.2341 39.2063V41.746C57.2341 44.6032 55.0119 46.8254 52.1548 46.8254Z" 
        fill="#F03603"
      />
    </svg>
  );
} 