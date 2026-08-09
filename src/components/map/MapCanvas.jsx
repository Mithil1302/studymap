
export default function MapCanvas({ children }) {
  return (
    <div className="flex-1 w-full min-w-0 overflow-auto pb-32">
      {/* 
        This inner div represents the large canvas.
        Dimensions are fixed to give enough room for the deterministic layout to sprawl 
        without squishing, and allowing horizontal scroll locally on this container.
      */}
      <div className="relative w-[1400px] h-[1200px] mx-auto mt-12">
        {children}
      </div>
    </div>
  );
}
