import { useState, useEffect, useRef } from "react";


// Fixed color scheme that follows highest to lowest contribution order
// These colors are in order of visual prominence
const lightColors = [
  'fill-indigo-500', // Most prominent first (highest contribution)
  'fill-amber-400',
  'fill-teal-400',
  'fill-pink-400',
  'fill-emerald-400',
  'fill-purple-400',
  'fill-rose-400',
  'fill-cyan-400',
  'fill-blue-500',
  'fill-orange-400',
  'fill-lime-500',
  'fill-fuchsia-400',
  'fill-sky-400',
  'fill-red-400',
  'fill-green-500',
  'fill-violet-400',
  'fill-yellow-400',
  'fill-slate-400',
  'fill-blue-400',
  'fill-orange-500'
];

const darkColors = [
  'fill-indigo-400', // Most prominent first (highest contribution)
  'fill-amber-300',
  'fill-teal-400',
  'fill-pink-400',
  'fill-emerald-300',
  'fill-purple-300',
  'fill-rose-300',
  'fill-cyan-300',
  'fill-blue-300',
  'fill-orange-300',
  'fill-lime-400',
  'fill-fuchsia-300',
  'fill-sky-300',
  'fill-red-300',
  'fill-green-400',
  'fill-violet-300',
  'fill-yellow-300',
  'fill-slate-300',
  'fill-blue-200',
  'fill-orange-400'
];

const PieChart = ({ data, platform, handle, darkMode }) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hoverSegment, setHoverSegment] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);


  useEffect(() => {
    console.log("Rendering piechart again");
    // Reset animation state when data changes
    setAnimationProgress(0);
    setHoverSegment(null);

    // Start animation after a short delay
    const startDelay = setTimeout(() => {
      // Animate progress from 0 to 1 over 800ms 
      const duration = 800;
      const startTime = Date.now();

      const animateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        setAnimationProgress(progress);

        if (progress < 1) {
          requestAnimationFrame(animateProgress);
        }
      };

      requestAnimationFrame(animateProgress);
    }, 100);

    return () => clearTimeout(startDelay);
  }, [data]); // Re-run animation when data changes


  // Generate SVG path for pie segments with progressive reveal
  const generatePieSegments = () => {
    let startAngle = 0;
    const sweepAngle = 360 * animationProgress; // Current angle of the sweep line (0 to 360)
    const animationComplete = animationProgress >= 0.99;

    return data.map((item, index) => {
      const { percentage } = item;
      const fullAngle = (percentage / 100) * 360;

      // Calculate how much of this segment should be visible
      let visibleEndAngle;

      if (sweepAngle <= startAngle) {
        // Sweep line hasn't reached this segment yet
        visibleEndAngle = startAngle;
      } else if (sweepAngle >= startAngle + fullAngle) {
        // Sweep line has passed this segment completely
        visibleEndAngle = startAngle + fullAngle;
      } else {
        // Sweep line is currently within this segment
        visibleEndAngle = sweepAngle;
      }

      // Calculate visible portion of the segment
      const x1 = 100 + 80 * Math.cos((Math.PI * startAngle) / 180);
      const y1 = 100 + 80 * Math.sin((Math.PI * startAngle) / 180);
      const x2 = 100 + 80 * Math.cos((Math.PI * visibleEndAngle) / 180);
      const y2 = 100 + 80 * Math.sin((Math.PI * visibleEndAngle) / 180);

      const visibleAngle = visibleEndAngle - startAngle;
      const largeArcFlag = visibleAngle > 180 ? 1 : 0;

      // For zero or very small angles, return empty or minimal path
      const pathData = visibleAngle < 0.1 ?
        (sweepAngle <= startAngle ? '' : `M 100 100 L ${x1} ${y1} Z`) :
        [
          `M 100 100`,
          `L ${x1} ${y1}`,
          `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
          'Z'
        ].join(' ');

      // Choose color based on theme and index - now using the index from the sorted array
      const fillColor = darkMode ? darkColors[index % darkColors.length] : lightColors[index % lightColors.length];

      // Calculate the midpoint angle for percentage label positioning
      const midAngle = startAngle + (fullAngle / 2);

      // Check if this segment is being hovered
      const isHovered = hoverSegment === index;

      // Hover effect - segment extends outward
      const hoverScale = isHovered ? 1.08 : 1; // 8% larger on hover
      const radius = 80 * hoverScale;

      // Shift segment outward when hovered (after animation completes)
      const midAngleRad = midAngle * (Math.PI / 180);
      const shiftX = isHovered && animationComplete ? 8 * Math.cos(midAngleRad) : 0;
      const shiftY = isHovered && animationComplete ? 8 * Math.sin(midAngleRad) : 0;

      // Adjusted path data for hover effect
      const hoverPathData = animationComplete ?
        (() => {
          const hx1 = 100 + shiftX + 80 * Math.cos((Math.PI * startAngle) / 180);
          const hy1 = 100 + shiftY + 80 * Math.sin((Math.PI * startAngle) / 180);
          const hx2 = 100 + shiftX + 80 * Math.cos((Math.PI * (startAngle + fullAngle)) / 180);
          const hy2 = 100 + shiftY + 80 * Math.sin((Math.PI * (startAngle + fullAngle)) / 180);

          return [
            `M ${100 + shiftX} ${100 + shiftY}`,
            `L ${hx1} ${hy1}`,
            `A 80 80 0 ${fullAngle > 180 ? 1 : 0} 1 ${hx2} ${hy2}`,
            'Z'
          ].join(' ');
        })()
        : pathData;

      // Final path to use
      const finalPathData = animationComplete && isHovered ? hoverPathData : pathData;

      // Add hover effect class only after animation is complete
      const interactivityClass = animationComplete ?
        'cursor-pointer transition-all duration-200 ease-out' : '';

      // Add shadow filter for hover effect
      const hoverFilter = isHovered && animationComplete ? 'filter: url(#hover-shadow)' : '';

      // Create segment with hover effect
      const result = (
        <g key={`segment-${index}`} className="segment-group">
          <path
            d={finalPathData}
            className={`${fillColor} ${interactivityClass} ${isHovered ? 'brightness-110' : ''}`}
            stroke={darkMode ? "rgb(31, 41, 55)" : "white"}
            strokeWidth="1"
            style={{ ...(hoverFilter && { filter: 'url(#hover-shadow)' }) }}
            onMouseEnter={(e) => {
              if (animationComplete) {
                setHoverSegment(index);

                // Calculate position for external tooltip
                if (svgRef.current) {
                  const svgRect = svgRef.current.getBoundingClientRect();
                  const centerX = svgRect.width / 2;
                  const centerY = svgRect.height / 2;

                  // FIXED TOOLTIP POSITIONING: Use consistent distance from center
                  // Define a fixed distance from center for all tooltips
                  const tooltipDistance = Math.min(centerX, centerY) * 0.95; // 95% of the smallest dimension

                  // Calculate tooltip position using the fixed distance
                  const tooltipX = centerX + tooltipDistance * Math.cos(midAngle * (Math.PI / 180));
                  const tooltipY = centerY + tooltipDistance * Math.sin(midAngle * (Math.PI / 180));

                  setTooltipPosition({ x: tooltipX, y: tooltipY });
                }
              }
            }}
            onMouseLeave={() => animationComplete && setHoverSegment(null)}
          />

          {/* Show percentage for all segments that are large enough */}
          {animationComplete && percentage >= 4 && !isHovered && (
            <text
              x={100 + (radius - 30) * Math.cos(midAngle * (Math.PI / 180))}
              y={100 + (radius - 30) * Math.sin(midAngle * (Math.PI / 180))}
              textAnchor="middle"
              dominantBaseline="middle"
              className='text-xs font-semibold fill-gray-800'
              style={{
                pointerEvents: 'none',
                opacity: 0.9
              }}
            >
              {Math.round(percentage)}%
            </text>
          )}
        </g>
      );

      // Update start angle for next segment
      startAngle += fullAngle;
      return result;
    });
  };

  // Generate the sweeping radius line animation
  const generateSweepLine = () => {
    // Calculate the sweep angle (0 to 360 degrees)
    const sweepAngle = 360 * animationProgress;

    // Calculate end point of the sweep line
    const x = 100 + 80 * Math.cos((Math.PI * sweepAngle) / 180);
    const y = 100 + 80 * Math.sin((Math.PI * sweepAngle) / 180);

    return (
      <line
        x1="100"
        y1="100"
        x2={x}
        y2={y}
        stroke={darkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.3)"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    );
  };

  return (
    data?.length === 0 ? (<div className="w-full h-full flex items-center justify-center text-gray-700 dark:text-gray-200 font-medium text-center">
      {!handle ? "Add your coding handles to enable data fetching." : platform === 'codechef' ? "Codechef currently doesn't provide public access to submission data via API." : "No submission data available"}
    </div>) : (<div className="relative w-full h-full flex justify-center items-center">

      <>
        <svg ref={svgRef} viewBox="0 0 200 200" className="w-full h-full">
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke={darkMode ? "#374151" : "#f3f4f6"}
            strokeWidth="1"
          />
          <defs>
            <filter id="hover-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="2"
                floodColor={darkMode ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.3)"}
              />
            </filter>
          </defs>
          {generatePieSegments()}
          {animationProgress < 1 && generateSweepLine()}
        </svg>

        {/* External tooltip - always visible and positioned at consistent distance */}
        {hoverSegment !== null && animationProgress >= 0.99 && (
          <div
            className={`absolute px-3 py-2 rounded-md text-sm pointer-events-none z-10 ${darkMode
              ? "bg-gray-800 text-white"
              : "bg-white text-gray-800 shadow-md"
              }`}
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: "translate(-50%, -50%)",
              transition: "all 0.15s ease-out",
              border: darkMode ? "1px solid #4B5563" : "1px solid #E5E7EB",
            }}
          >
            <div className="font-bold">
              {data[hoverSegment].percentage}%
            </div>
            <div className={darkMode ? "text-gray-300" : "text-gray-600"}>
              {data[hoverSegment].tag}: {data[hoverSegment].count}
            </div>
          </div>
        )}
      </>
    </div>
    ));
};

export default PieChart;
