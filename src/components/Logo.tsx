import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

export interface LogoProps {
  className?: string;
  variant?: 'full' | 'horizontal' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  inverted?: boolean;
  src?: string; // Optional direct src override
  alt?: string;
  style?: React.CSSProperties;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  inverted = false,
  src,
  alt,
  style
}) => {
  // Safely access store settings for custom uploaded logo and store name
  let customLogoUrl = '';
  let storeName = 'Lotus Clothing Brand';
  let customLogoHeight: number | undefined;

  try {
    const store = useStore();
    if (store?.settings?.logoUrl) {
      customLogoUrl = store.settings.logoUrl;
    }
    if (store?.settings?.storeName) {
      storeName = store.settings.storeName;
    }
    if (store?.settings?.logoHeight) {
      customLogoHeight = store.settings.logoHeight;
    }
  } catch {
    // If rendered outside StoreProvider, fallback gracefully to default
  }

  // Active logo source: explicitly passed src > customLogoUrl from settings > default site logo
  const defaultLogo = inverted ? '/logo-white.svg' : '/logo.svg';
  const targetLogoSrc = src || customLogoUrl || defaultLogo;

  const [hasError, setHasError] = useState(false);

  // Reset error state when logo source changes
  useEffect(() => {
    setHasError(false);
  }, [targetLogoSrc]);

  // Keep favicon synced if custom logo is set
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const faviconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (faviconLink && targetLogoSrc) {
        faviconLink.href = targetLogoSrc;
      }
    }
  }, [targetLogoSrc]);

  // Height presets for the unified logo (keeping 600:560 ratio) - Prominent and scalable
  const sizeClasses: Record<string, string> = {
    sm: 'h-12 sm:h-14',
    md: 'h-20 sm:h-24 md:h-28',
    lg: 'h-28 sm:h-34 md:h-40',
    xl: 'h-36 sm:h-44 md:h-52',
    '2xl': 'h-48 sm:h-60 md:h-72'
  };

  const containerStyle: React.CSSProperties = {
    ...style,
    ...(customLogoHeight && !style?.maxHeight ? { maxHeight: `${customLogoHeight}px` } : {})
  };

  // If image loaded without error, render standard <img> element
  if (!hasError) {
    return (
      <div
        className={`inline-flex items-center justify-center shrink-0 ${sizeClasses[size] || ''} ${className}`}
        style={containerStyle}
        title={`${storeName} - We Trust In Quality`}
      >
        <img
          src={targetLogoSrc}
          alt={alt || storeName}
          onError={() => setHasError(true)}
          data-logo-image="site-logo"
          data-logo-src={targetLogoSrc}
          data-testid="site-logo-img"
          className={`h-full w-auto max-w-full object-contain ${
            inverted ? 'brightness-110 drop-shadow-sm' : 'drop-shadow-xs'
          }`}
        />
      </div>
    );
  }

  // Fallback vector render if external image fails to load
  const primaryPetalColor = inverted ? '#FFFFFF' : '#111111';
  const textColor = inverted ? '#FFFFFF' : '#111111';
  const taglineColor = inverted ? '#E5E7EB' : '#111111';
  const diamondColor = inverted ? '#FBBF24' : '#111111';
  const dropletInnerColor = inverted ? '#1A1A1A' : '#FFFFFF';
  const gradIdSuffix = inverted ? 'Inv' : 'Std';

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${sizeClasses[size] || ''} ${className}`}
      style={containerStyle}
      title={`${storeName} - We Trust In Quality`}
    >
      <svg
        viewBox="0 0 600 560"
        className="h-full w-auto max-w-full drop-shadow-xs select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`lotusFlameGrad_${gradIdSuffix}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>
          <linearGradient id={`lotusWingGrad_${gradIdSuffix}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>
          <linearGradient id={`lotusWingGradRight_${gradIdSuffix}`} x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>
        </defs>

        <g id="lotus-flower-emblem">
          <path
            d="M300 15 C265 85 225 170 300 248 C375 170 335 85 300 15 Z"
            fill={`url(#lotusFlameGrad_${gradIdSuffix})`}
          />
          <path
            d="M300 75 C282 120 262 165 300 215 C338 165 318 120 300 75 Z"
            fill={dropletInnerColor}
          />
          <path
            d="M300 102 C290 135 278 165 300 195 C322 165 310 135 300 102 Z"
            fill={`url(#lotusFlameGrad_${gradIdSuffix})`}
          />
          <path
            d="M282 248 C248 195 220 130 248 78 C252 120 260 178 282 248 Z"
            fill={primaryPetalColor}
          />
          <path
            d="M318 248 C352 195 380 130 352 78 C348 120 340 178 318 248 Z"
            fill={primaryPetalColor}
          />
          <path
            d="M272 254 C195 218 135 125 202 85 C185 142 220 212 272 254 Z"
            fill={primaryPetalColor}
          />
          <path
            d="M328 254 C405 218 465 125 398 85 C415 142 380 212 328 254 Z"
            fill={primaryPetalColor}
          />
          <path
            d="M215 230 C132 208 102 142 165 148 C132 184 172 220 215 230 Z"
            fill={primaryPetalColor}
          />
          <path
            d="M385 230 C468 208 498 142 435 148 C468 184 428 220 385 230 Z"
            fill={primaryPetalColor}
          />
          <path
            d="M178 222 C98 210 82 160 138 175 C102 206 142 226 178 222 Z"
            fill={primaryPetalColor}
          />
          <path
            d="M422 222 C502 210 518 160 462 175 C498 206 458 226 422 222 Z"
            fill={primaryPetalColor}
          />
          <path
            d="M300 282 C225 282 135 210 140 265 C185 325 272 296 300 282 Z"
            fill={`url(#lotusWingGrad_${gradIdSuffix})`}
          />
          <path
            d="M300 282 C375 282 465 210 460 265 C415 325 328 296 300 282 Z"
            fill={`url(#lotusWingGradRight_${gradIdSuffix})`}
          />
        </g>

        <g id="lotus-wordmark">
          <text
            x="300"
            y="382"
            textAnchor="middle"
            fontFamily="'Playfair Display', Georgia, serif"
            fontSize="94"
            fontWeight="900"
            letterSpacing="18"
            fill={textColor}
          >
            LOTUS
          </text>
          <path
            d="M72 388 C 112 396 150 376 175 390 C 135 408 85 402 62 391 Z"
            fill={`url(#lotusFlameGrad_${gradIdSuffix})`}
          />
          <path
            d="M232 334 C 223 350 221 364 232 374 C 243 364 241 350 232 334 Z"
            fill={`url(#lotusFlameGrad_${gradIdSuffix})`}
          />
          <path
            d="M482 365 C 496 360 512 376 488 391 C 504 380 492 366 482 365 Z"
            fill={`url(#lotusFlameGrad_${gradIdSuffix})`}
          />
        </g>

        <g id="lotus-divider">
          <line x1="80" y1="418" x2="278" y2="418" stroke="#EA580C" strokeWidth="2.2" strokeLinecap="round" />
          <polygon points="300,409 309,418 300,427 291,418" fill={diamondColor} />
          <line x1="322" y1="418" x2="520" y2="418" stroke="#EA580C" strokeWidth="2.2" strokeLinecap="round" />
        </g>

        <g id="lotus-subtitles">
          <text
            x="300"
            y="456"
            textAnchor="middle"
            fontFamily="'Montserrat', 'Poppins', sans-serif"
            fontSize="24"
            fontWeight="800"
            letterSpacing="11"
            fill={inverted ? '#F59E0B' : '#EA580C'}
          >
            CLOTHING BRAND
          </text>
          <text
            x="300"
            y="488"
            textAnchor="middle"
            fontFamily="'Montserrat', 'Poppins', sans-serif"
            fontSize="16"
            fontWeight="800"
            letterSpacing="8"
            fill={taglineColor}
          >
            WE TRUST IN QUALITY
          </text>
        </g>
      </svg>
    </div>
  );
};
