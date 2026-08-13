import React from 'react';

export default function DeskSurface({ children }) {
  return (
    <div 
      className="relative w-full"
      style={{
        // Minimum height naturally scrollable, not forced to 1.25x viewport.
        minHeight: 'max(760px, calc(100vh - 64px))', // Assuming header is ~64px
        // Extra bottom padding to act as the "desk edge" and prevent clipping
        paddingBottom: '80px',
        // Warm walnut surface
        backgroundColor: '#9A7958',
        backgroundImage: `
          radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.15) 100%),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")
        `,
        backgroundSize: '100% 100%, 250px 250px'
      }}
    >
      {/* Desk edge shadow to ground the entire workspace */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col h-full">
        {children}
      </div>
    </div>
  );
}
