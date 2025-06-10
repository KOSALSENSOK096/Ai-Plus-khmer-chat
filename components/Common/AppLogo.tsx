// Code Complete Review: 20240815120000
import React from 'react';

// SVG Logo Component - Theme Aware
// Extracted from HomePage.tsx to be reusable.
// It uses inline <style> within the SVG for theme-specific class definitions,
// ensuring the logo adapts correctly to light and dark modes.
const AppLogo = ({ className = "h-auto w-full" }: { className?: string }) => (
  <svg
    viewBox="0 0 280 120"
    xmlns="http://www.w3.org/2000/svg"
    className={className} // Apply passed className for sizing
    aria-labelledby="appLogoTitle appLogoDesc"
  >
    <title id="appLogoTitle">AI Plus Khmer Chat Logo</title>
    <desc id="appLogoDesc">Logo for AI Plus Khmer Chat: a stylized chat bubble containing "AI+", with "ខ្មែរ CHAT" text alongside, and abstract AI elements.</desc>
    <defs>
      <linearGradient id="aiTextGradientAppLogo" x1="0%" y1="0%" x2="100%" y2="0%">
        {/* These stopColors are fixed for the gradient as per original design.
            If theme-specific gradient colors are needed, this definition would need to be more complex
            or use CSS custom properties that are dynamically updated by the theme.
            Current approach: fixed gradient, other parts of logo are theme-aware via CSS classes.
        */}
        <stop offset="0%" stopColor="#1D4ED8" /> {/* Fallback primary from original logo */}
        <stop offset="100%" stopColor="#10B981" /> {/* Fallback accent from original logo */}
      </linearGradient>
      <style>{`
        .logo-font-main-app { font-family: 'Inter', sans-serif; font-weight: 900; }
        .logo-font-khmer-app { font-family: 'Kantumruy Pro', 'Inter', sans-serif; font-weight: 700; }
        
        /* Dynamic fill classes for theme awareness */
        .fill-primary-dynamic { fill: #1D4ED8; } /* Blue-700 */
        .dark .fill-primary-dynamic { fill: #60A5FA; } /* Blue-400 for dark mode */

        .fill-text-main-dynamic { fill: #1F2937; } /* Gray-800 */
        .dark .fill-text-main-dynamic { fill: #F3F4F6; } /* Gray-100 for dark mode */
        
        .fill-bubble-bg-dynamic { fill: #DBEAFE; } /* Blue-100 */
        .dark .fill-bubble-bg-dynamic { fill: #374151; } /* Gray-700 for dark mode */
        
        .stroke-bubble-border-dynamic { stroke: #3B82F6; } /* Blue-500 */
        .dark .stroke-bubble-border-dynamic { stroke: #2563EB; } /* Blue-600 for dark mode */

        .stroke-decorative-dynamic { stroke: #D1D5DB; } /* Gray-300 */
        .dark .stroke-decorative-dynamic { stroke: #4B5563; } /* Gray-600 for dark mode */

        .fill-secondary-dynamic { fill: #F97316; } /* Orange-500 */
        .dark .fill-secondary-dynamic { fill: #FB923C; } /* Orange-400 for dark mode */

        .fill-accent-dynamic { fill: #10B981; } /* Emerald-500 */
        .dark .fill-accent-dynamic { fill: #34D399; } /* Emerald-400 for dark mode */
      `}</style>
    </defs>
    <path
      d="M30 25 C15 25 10 40 10 55 C10 70 15 85 30 85 L70 85 L80 95 L80 85 L100 85 C115 85 120 70 120 55 C120 40 115 25 100 25 Z"
      className="fill-bubble-bg-dynamic stroke-bubble-border-dynamic" strokeWidth="1.5"
    />
    <text
      x="65" y="57"
      textAnchor="middle"
      className="logo-font-main-app"
      fontSize="36"
      fill="url(#aiTextGradientAppLogo)"
    >
      AI+
    </text>
    <text
      x="205" y="45"
      textAnchor="middle"
      className="logo-font-khmer-app fill-text-main-dynamic"
      fontSize="28"
    >
      ខ្មែរ
    </text>
    <text
      x="205" y="78"
      textAnchor="middle"
      className="logo-font-main-app fill-primary-dynamic"
      fontSize="26"
    >
      CHAT
    </text>
    <circle cx="150" cy="20" r="5" className="fill-secondary-dynamic opacity-80 dark:opacity-70" />
    <circle cx="170" cy="98" r="7" className="fill-accent-dynamic opacity-80 dark:opacity-70" />
    <line x1="125" y1="55" x2="145" y2="30" className="stroke-decorative-dynamic" strokeWidth="1.5" />
    <line x1="125" y1="58" x2="155" y2="88" className="stroke-decorative-dynamic" strokeWidth="1.5" />
  </svg>
);

export default AppLogo;