import React from 'react';

interface LogoProps {
  variant?: 'primary' | 'wordmark' | 'icon';
  className?: string;
  onClick?: () => void;
}

export const IconLogo: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => {
  return (
    <svg 
      className={`${className} text-brand-charcoal`}
      viewBox="0 0 100 100" 
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Editorial Luxury Crest Monogram */}
      <path 
        d="M25 20 H75 V26 H60 V45 H75 V51 H60 V80 H52 V51 H35 V80 H27 V20 M35 45 H52 V26 H35 V45 Z" 
        fillRule="evenodd" 
        clipRule="evenodd"
      />
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.15" />
      <path d="M47 8 L50 4 L53 8 Z" fill="currentColor" />
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({ variant = 'primary', className = '', onClick }) => {
  const baseClasses = `clickable select-none flex items-center gap-3 ${className}`;

  if (variant === 'icon') {
    return (
      <div id="fc-logo-icon" className={baseClasses} onClick={onClick}>
        <IconLogo className="h-9 w-9 text-brand-charcoal" />
      </div>
    );
  }

  if (variant === 'wordmark') {
    return (
      <div id="fc-logo-wordmark" className={`${baseClasses} flex-col !gap-0 text-center`} onClick={onClick}>
        <span className="font-serif text-xl tracking-[0.25em] font-medium text-brand-charcoal">
          FITINS & CUTE
        </span>
        <span className="font-sans text-[0.65rem] tracking-[0.4em] text-brand-gray uppercase font-light">
          COLLECTIONS
        </span>
      </div>
    );
  }

  // Primary: Icon + Wordmark
  return (
    <div id="fc-logo-primary" className={baseClasses} onClick={onClick}>
      <IconLogo className="h-9 w-9 text-brand-charcoal shrink-0" />
      <div className="flex flex-col">
        <span className="font-serif text-lg md:text-xl tracking-[0.18em] font-semibold text-brand-charcoal leading-none">
          FITINS & CUTE
        </span>
        <span className="font-sans text-[0.6rem] md:text-[0.65rem] tracking-[0.35em] text-brand-gray uppercase font-medium mt-1">
          COLLECTIONS
        </span>
      </div>
    </div>
  );
};
