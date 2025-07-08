import { useEffect, useState } from 'react';
import { useIsMobile } from './use-mobile';

interface ResponsiveChartConfig {
  // Screen size flags
  isXSmall: boolean;
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  isXLarge: boolean;
  
  // Chart dimensions
  chartHeight: number;
  chartWidth?: string;
  
  // Chart margins
  margins: {
    top: number;
    right: number;
    left: number;
    bottom: number;
  };
  
  // Typography
  fontSize: {
    tick: number;
    tooltip: number;
    title: number;
    legend: number;
  };
  
  // Chart elements
  strokeWidth: number;
  dotRadius: number;
  activeDotRadius: number;
  barRadius: number;
  
  // Axis configuration
  xAxisHeight: number;
  yAxisWidth: number;
  tickAngle: number;
  textAnchor: 'start' | 'middle' | 'end';
  
  // Grid and styling
  gridStroke: string;
  axisStroke: string;
  
  // Display options
  showVerticalGrid: boolean;
  maxBarSize: number;
  minTickGap: number;
  tickInterval: number | 'preserveStartEnd';
}

interface UseResponsiveChartOptions {
  baseHeight?: number;
  heightMultiplier?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  customBreakpoints?: {
    xsmall: number;
    small: number;
    medium: number;
    large: number;
  };
}

export function useResponsiveChart(options: UseResponsiveChartOptions = {}): ResponsiveChartConfig {
  const isMobile = useIsMobile();
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  const {
    baseHeight = 300,
    heightMultiplier = { mobile: 0.75, tablet: 0.9, desktop: 1 },
    customBreakpoints = { xsmall: 480, small: 640, medium: 768, large: 1024 }
  } = options;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 150); // Debounce resize events
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Screen size detection
  const isXSmall = windowWidth < customBreakpoints.xsmall;
  const isSmall = windowWidth < customBreakpoints.small;
  const isMedium = windowWidth < customBreakpoints.medium;
  const isLarge = windowWidth < customBreakpoints.large;
  const isXLarge = windowWidth >= customBreakpoints.large;

  // Calculate responsive chart height
  const getChartHeight = (): number => {
    if (isXSmall) return Math.floor(baseHeight * heightMultiplier.mobile * 0.8);
    if (isSmall) return Math.floor(baseHeight * heightMultiplier.mobile);
    if (isMedium) return Math.floor(baseHeight * heightMultiplier.tablet);
    return Math.floor(baseHeight * heightMultiplier.desktop);
  };

  // Calculate responsive margins
  const getMargins = () => {
    if (isXSmall) return { top: 5, right: 5, left: 5, bottom: 25 };
    if (isSmall) return { top: 8, right: 8, left: 8, bottom: 35 };
    if (isMobile) return { top: 10, right: 12, left: 12, bottom: 40 };
    return { top: 15, right: 20, left: 20, bottom: 45 };
  };

  // Calculate responsive font sizes
  const getFontSizes = () => {
    if (isXSmall) return { tick: 9, tooltip: 11, title: 14, legend: 10 };
    if (isSmall) return { tick: 10, tooltip: 12, title: 16, legend: 11 };
    if (isMedium) return { tick: 11, tooltip: 13, title: 17, legend: 12 };
    return { tick: 12, tooltip: 14, title: 18, legend: 13 };
  };

  // Calculate responsive element sizes
  const getElementSizes = () => {
    if (isXSmall) return {
      strokeWidth: 1.5,
      dotRadius: 2,
      activeDotRadius: 3,
      barRadius: 1,
      maxBarSize: 30
    };
    if (isSmall) return {
      strokeWidth: 2,
      dotRadius: 3,
      activeDotRadius: 4,
      barRadius: 2,
      maxBarSize: 40
    };
    if (isMedium) return {
      strokeWidth: 2.5,
      dotRadius: 3.5,
      activeDotRadius: 5,
      barRadius: 3,
      maxBarSize: 50
    };
    return {
      strokeWidth: 3,
      dotRadius: 4,
      activeDotRadius: 6,
      barRadius: 4,
      maxBarSize: 60
    };
  };

  // Calculate axis configuration
  const getAxisConfig = () => {
    const xAxisHeight = isXSmall ? 40 : isSmall ? 50 : isMedium ? 55 : 60;
    const yAxisWidth = isXSmall ? 35 : isSmall ? 45 : isMedium ? 55 : 65;
    const tickAngle = isXSmall ? -60 : isSmall ? -45 : isMedium ? -30 : 0;
    const textAnchor = (isSmall ? 'end' : 'middle') as 'start' | 'middle' | 'end';
    const minTickGap = isXSmall ? 30 : isSmall ? 20 : 10;
    const tickInterval = isXSmall ? 1 : isSmall ? 'preserveStartEnd' : 0;

    return {
      xAxisHeight,
      yAxisWidth,
      tickAngle,
      textAnchor,
      minTickGap,
      tickInterval
    };
  };

  const margins = getMargins();
  const fontSize = getFontSizes();
  const elementSizes = getElementSizes();
  const axisConfig = getAxisConfig();

  return {
    // Screen size flags
    isXSmall,
    isSmall,
    isMedium,
    isLarge,
    isXLarge,
    
    // Chart dimensions
    chartHeight: getChartHeight(),
    chartWidth: '100%',
    
    // Margins
    margins,
    
    // Typography
    fontSize,
    
    // Chart elements
    strokeWidth: elementSizes.strokeWidth,
    dotRadius: elementSizes.dotRadius,
    activeDotRadius: elementSizes.activeDotRadius,
    barRadius: elementSizes.barRadius,
    
    // Axis configuration
    xAxisHeight: axisConfig.xAxisHeight,
    yAxisWidth: axisConfig.yAxisWidth,
    tickAngle: axisConfig.tickAngle,
    textAnchor: axisConfig.textAnchor,
    
    // Grid and styling
    gridStroke: '#f0f0f0',
    axisStroke: '#e0e0e0',
    
    // Display options
    showVerticalGrid: !isXSmall,
    maxBarSize: elementSizes.maxBarSize,
    minTickGap: axisConfig.minTickGap,
    tickInterval: axisConfig.tickInterval as number | 'preserveStartEnd'
  };
}

// Utility function for formatting chart values based on screen size
export function formatChartValue(
  value: number,
  type: 'currency' | 'number' | 'percentage' = 'number',
  isCompact: boolean = false
): string {
  if (type === 'currency') {
    if (isCompact) {
      if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B VND`;
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M VND`;
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K VND`;
      return `${value} VND`;
    }
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  }
  
  if (type === 'percentage') {
    return `${value.toFixed(1)}%`;
  }
  
  if (isCompact) {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  }
  
  return value.toLocaleString('vi-VN');
}

// Predefined chart color schemes
export const chartColorSchemes = {
  default: {
    primary: 'hsl(var(--chart-1))',
    secondary: 'hsl(var(--chart-2))',
    tertiary: 'hsl(var(--chart-3))',
    quaternary: 'hsl(var(--chart-4))',
    quinary: 'hsl(var(--chart-5))',
  },
  revenue: {
    primary: '#6366f1', // Indigo
    secondary: '#8b5cf6', // Violet
    tertiary: '#06b6d4', // Cyan
  },
  status: {
    success: '#10b981', // Emerald
    warning: '#f59e0b', // Amber
    error: '#ef4444', // Red
    info: '#3b82f6', // Blue
  }
} as const; 