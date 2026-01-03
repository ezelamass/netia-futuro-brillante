import { useMemo } from 'react';

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}

export const Sparkline = ({ 
  data, 
  color = '#22C55E', 
  height = 20, 
  width = 60 
}: SparklineProps) => {
  const path = useMemo(() => {
    if (data.length < 2) return '';
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  }, [data, height, width]);

  const lastPoint = useMemo(() => {
    if (data.length < 1) return null;
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const lastValue = data[data.length - 1];
    return {
      x: width,
      y: height - ((lastValue - min) / range) * (height - 4) - 2,
    };
  }, [data, height, width]);

  if (data.length < 2) return null;

  return (
    <svg 
      width={width} 
      height={height} 
      className="overflow-visible"
      viewBox={`0 0 ${width} ${height}`}
    >
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.6}
      />
      {lastPoint && (
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r={2.5}
          fill={color}
        />
      )}
    </svg>
  );
};
