import React from 'react';
import logoImg from '../assets/images/where2park_logo_1790912770223.jpg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconDimensions = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl',
  }[size];

  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  }[size];

  const subtextSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Designed Logo Badge */}
      <div
        className={`relative ${iconDimensions} overflow-hidden shadow-xs ring-1 ring-black/5 flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}
      >
        <img
          src={logoImg}
          alt="Where2Park Logo"
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Subtle overlay gradient to blend with interface */}
        <div className="absolute inset-0 ring-1 ring-inset ring-white/15 rounded-[inherit]" />
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center">
            <span
              className={`font-black text-slate-900 tracking-tight leading-none ${titleSizes}`}
            >
              Where
              <span className="inline-flex items-center justify-center bg-gradient-to-r from-[#3525cd] to-[#6366f1] text-white px-1 py-0.5 mx-0.5 rounded-sm shadow-2xs font-extrabold text-[0.85em] leading-none">
                2
              </span>
              Park
            </span>
          </div>
          <span
            className={`font-bold text-slate-500 tracking-wider uppercase block mt-0.5 ${subtextSizes}`}
          >
            SINGAPORE CIVIC MOBILITY
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
