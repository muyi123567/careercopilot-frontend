import { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer]);

interface TrendChartProps {
  data: number[];
  labels?: string[];
  height?: number;
}

export function TrendChart({ data, labels, height = 180 }: TrendChartProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.init(ref.current);

    const xLabels = labels ?? data.map((_, i) => `${i + 1}`);

    chart.setOption({
      grid: { top: 10, right: 10, bottom: 24, left: 32 },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#fff',
        borderColor: 'rgba(33,29,26,0.1)',
        textStyle: { fontSize: 12, color: '#211D1A', fontFamily: 'system-ui' },
      },
      xAxis: {
        type: 'category',
        data: xLabels,
        axisLine: { lineStyle: { color: 'rgba(33,29,26,0.1)' } },
        axisLabel: { fontSize: 10, color: '#9A9088', fontFamily: 'system-ui' },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: 'rgba(33,29,26,0.05)' } },
        axisLabel: { fontSize: 10, color: '#9A9088', fontFamily: 'system-ui' },
      },
      series: [{
        type: 'line',
        data,
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#D97706', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(217,119,6,0.15)' },
            { offset: 1, color: 'rgba(217,119,6,0.01)' },
          ]),
        },
        animationDuration: 800,
        animationEasing: 'cubicOut',
      }],
    });

    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(ref.current);
    return () => { ro.disconnect(); chart.dispose(); };
  }, [data, labels]);

  return <div ref={ref} style={{ height, width: '100%' }} />;
}
