
/**
 * DeskSurface — Warm walnut desk surface.
 * Natural vertical scrolling. No forced min-width. No horizontal scroll.
 * Objects inside determine the height; padding ensures the bottom edge is breathable.
 */
export default function DeskSurface({ children }) {
  return (
    <div
      className="relative w-full overflow-x-hidden"
      style={{
        minHeight: 'calc(100vh - 64px)',
        paddingBottom: '100px',
        // Warm walnut surface with subtle lighting
        background: `
          radial-gradient(ellipse 70% 50% at 50% 25%, rgba(255,255,255,0.07) 0%, transparent 70%),
          radial-gradient(ellipse 100% 80% at 50% 100%, rgba(0,0,0,0.18) 0%, transparent 60%),
          linear-gradient(175deg, #A87C52 0%, #8B6239 40%, #7A5330 100%)
        `,
      }}
    >
      {/* Very subtle wood grain texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              88deg,
              rgba(255,255,255,0.012) 0px,
              rgba(255,255,255,0.012) 1px,
              transparent 1px,
              transparent 28px
            )
          `,
          opacity: 0.6,
        }}
      />

      {/* Desk edge — bottom vignette to "ground" the surface */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '60px',
          background:
            'linear-gradient(to top, rgba(0,0,0,0.22) 0%, transparent 100%)',
        }}
      />

      {/* Desk lip at very bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: '6px', background: 'rgba(0,0,0,0.3)' }}
      />

      {/* Content */}
      <div className="relative z-10 w-full h-full px-6 sm:px-10 lg:px-14 pt-10">
        {children}
      </div>
    </div>
  );
}
