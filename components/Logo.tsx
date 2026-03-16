interface LogoProps {
  size?: number;
}

export default function Logo({ size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="rounded-lg overflow-hidden"
    >
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#3b82f6", stopOpacity: "1" }} />
          <stop offset="100%" style={{ stopColor: "#1e40af", stopOpacity: "1" }} />
        </linearGradient>
      </defs>

      {/* Background gradient square */}
      <rect width="32" height="32" rx="7" fill="url(#logoGrad)" />

      {/* H letter in white */}
      <g
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* Left vertical */}
        <line x1="11" y1="12" x2="11" y2="25" />
        {/* Right vertical */}
        <line x1="21" y1="12" x2="21" y2="25" />
        {/* Horizontal middle */}
        <line x1="11" y1="18" x2="21" y2="18" />
      </g>

      {/* Green roof (upward indicator) */}
      <g
        stroke="#10b981"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* Roof left */}
        <line x1="11" y1="12" x2="16" y2="4" />
        {/* Roof right */}
        <line x1="21" y1="12" x2="16" y2="4" />
      </g>
    </svg>
  );
}
