import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'horizontal' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  inverted?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'horizontal',
  size = 'md',
  inverted = false
}) => {
  // Dimension presets
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const leafColor = inverted ? '#E5E7EB' : '#111111';

  const LotusIcon = () => (
    <svg
      viewBox="0 0 500 380"
      className="w-full h-full drop-shadow-xs"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="lotusFlameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#EA580C" />
          <stop offset="50%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
        <linearGradient id="lotusWingGrad" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#EA580C" />
          <stop offset="50%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
      </defs>

      {/* TOP CENTRAL LOTUS FLAME */}
      {/* Outer center petal */}
      <path
        d="M250 50 C230 110 200 170 250 240 C300 170 270 110 250 50 Z"
        fill="url(#lotusFlameGrad)"
      />
      {/* Inner drop core */}
      <path
        d="M250 110 C240 145 228 180 250 215 C272 180 260 145 250 110 Z"
        fill="#FFFFFF"
      />
      <path
        d="M250 130 C244 152 236 175 250 198 C264 175 256 152 250 130 Z"
        fill="url(#lotusFlameGrad)"
      />

      {/* INNER LAYER BLACK/WHITE PETALS */}
      {/* Inner Left Leaf */}
      <path
        d="M235 240 C210 200 185 145 205 105 C208 140 215 185 235 240 Z"
        fill={leafColor}
      />
      {/* Inner Right Leaf */}
      <path
        d="M265 240 C290 200 315 145 295 105 C292 140 285 185 265 240 Z"
        fill={leafColor}
      />

      {/* MID LAYER PETALS */}
      {/* Mid Left Petal */}
      <path
        d="M225 242 C165 210 115 130 170 100 C155 145 180 205 225 242 Z"
        fill={leafColor}
      />
      {/* Mid Right Petal */}
      <path
        d="M275 242 C335 210 385 130 330 100 C345 145 320 205 275 242 Z"
        fill={leafColor}
      />

      {/* OUTER ACCENT PETALS */}
      {/* Far Left Petal */}
      <path
        d="M175 220 C110 200 90 140 140 145 C115 175 145 205 175 220 Z"
        fill={leafColor}
      />
      {/* Far Right Petal */}
      <path
        d="M325 220 C390 200 410 140 360 145 C385 175 355 205 325 220 Z"
        fill={leafColor}
      />

      {/* BOTTOM BASE WING PETALS (GRADIENT ORANGE) */}
      {/* Left Wing */}
      <path
        d="M250 270 C180 270 110 210 115 260 C150 315 225 285 250 270 Z"
        fill="url(#lotusWingGrad)"
      />
      {/* Right Wing */}
      <path
        d="M250 270 C320 270 390 210 385 260 C350 315 275 285 250 270 Z"
        fill="url(#lotusWingGrad)"
      />
    </svg>
  );

  // Variant: Icon Only
  if (variant === 'icon') {
    return (
      <div className={`${iconSizes[size]} ${className} inline-flex items-center justify-center shrink-0`}>
        <LotusIcon />
      </div>
    );
  }

  // Variant: Full Stacked (Symbol + Wordmark + Taglines)
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {/* Lotus Symbol */}
        <div className="w-24 h-20 mb-2">
          <LotusIcon />
        </div>

        {/* Brand Name "LOTUS" with decorative elements */}
        <div className="relative flex items-center justify-center">
          <span className={`font-serif-title font-black text-4xl tracking-[0.08em] leading-none ${
            inverted ? 'text-white' : 'text-neutral-900'
          }`}>
            L
            <span className="relative inline-block mx-0.5">
              O
              {/* Petal flame inside O */}
              <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="w-2 h-4 rounded-full bg-gradient-to-t from-orange-600 to-amber-400"></span>
              </span>
            </span>
            TUS
          </span>
        </div>

        {/* Divider with Center Diamond */}
        <div className="w-full max-w-[220px] flex items-center justify-center gap-2 my-1.5">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-orange-500 flex-1"></div>
          <span className={`w-1.5 h-1.5 rotate-45 shrink-0 ${inverted ? 'bg-amber-400' : 'bg-neutral-900'}`}></span>
          <div className="h-[1px] bg-gradient-to-l from-transparent via-orange-500 to-orange-500 flex-1"></div>
        </div>

        {/* Subtitles matching uploaded logo */}
        <span className="text-[11px] font-extrabold tracking-[0.28em] text-orange-500 uppercase font-sans">
          CLOTHING BRAND
        </span>
        <span className={`text-[8.5px] font-bold tracking-[0.25em] uppercase font-sans mt-0.5 ${
          inverted ? 'text-gray-300' : 'text-neutral-800'
        }`}>
          WE TRUST IN QUALITY
        </span>
      </div>
    );
  }

  // Variant: Horizontal (Default - Ideal for Navbar & Header)
  return (
    <div className={`flex items-center gap-3 ${className} text-left select-none`}>
      {/* Lotus Symbol */}
      <div className={`${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        <LotusIcon />
      </div>

      {/* Brand Typography matching user's uploaded logo */}
      <div className="flex flex-col justify-center">
        {/* Main "LOTUS" wordmark */}
        <div className="flex items-center">
          <span className={`font-serif-title font-black text-2xl tracking-[0.06em] leading-none ${
            inverted ? 'text-white' : 'text-neutral-900'
          }`}>
            L
            <span className="relative inline-block mx-0.5">
              O
              {/* Small Petal inside O */}
              <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="w-1.5 h-3 rounded-full bg-gradient-to-t from-orange-600 to-amber-400"></span>
              </span>
            </span>
            TUS
          </span>
          <span className="ml-1.5 text-[9px] font-bold bg-rose-600 text-white px-1 py-0.2 rounded uppercase tracking-wider">
            BD
          </span>
        </div>

        {/* Decorative Divider */}
        <div className="w-full flex items-center gap-1.5 my-0.5">
          <div className="h-[1px] bg-orange-400 flex-1"></div>
          <span className={`w-1 h-1 rotate-45 shrink-0 ${inverted ? 'bg-amber-400' : 'bg-neutral-900'}`}></span>
          <div className="h-[1px] bg-orange-400 flex-1"></div>
        </div>

        {/* Brand Tagline */}
        <div className="flex flex-col -space-y-0.5">
          <span className="text-[7.5px] font-extrabold tracking-[0.24em] text-orange-500 uppercase leading-tight font-sans">
            CLOTHING BRAND
          </span>
          <span className={`text-[6px] font-bold tracking-[0.22em] uppercase leading-tight font-sans ${
            inverted ? 'text-gray-300' : 'text-neutral-700'
          }`}>
            WE TRUST IN QUALITY
          </span>
        </div>
      </div>
    </div>
  );
};
