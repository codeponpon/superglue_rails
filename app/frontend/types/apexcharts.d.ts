declare module "react-apexcharts" {
  import React from "react";

  interface ApexOptions {
    chart?: {
      type?: string;
      height?: number;
      toolbar?: {
        show?: boolean;
      };
    };
    dataLabels?: {
      enabled?: boolean;
    };
    stroke?: {
      curve?: string;
      width?: number;
    };
    xaxis?: {
      categories?: string[];
      type?: string;
    };
    yaxis?: {
      title?: {
        text?: string;
      };
      labels?: {
        formatter?: (val: number) => string;
      };
    };
    tooltip?: {
      x?: {
        format?: string;
      };
      y?: {
        formatter?: (val: number) => string;
      };
    };
    grid?: {
      show?: boolean;
      strokeDashArray?: number;
      position?: string;
    };
    colors?: string[];
    markers?: {
      size?: number;
      colors?: string[];
      strokeColors?: string;
      strokeWidth?: number;
      hover?: {
        size?: number;
      };
    };
    fill?: {
      type?: string;
      gradient?: {
        shadeIntensity?: number;
        opacityFrom?: number;
        opacityTo?: number;
        stops?: number[];
      };
    };
  }

  interface ApexSeries {
    name: string;
    data: number[];
  }

  interface ChartProps {
    options: ApexOptions;
    series: ApexSeries[];
    type: string;
    height?: number;
  }

  const Chart: React.ComponentType<ChartProps>;
  export default Chart;
}
