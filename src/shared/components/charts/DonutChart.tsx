import { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([PieChart, CanvasRenderer]);

interface DonutChartProps {
  value: number;
  total: number;
  label?: string;
  height?: number;
}

export function DonutChart({ value, total, label = '完成度', height = 180 }: DonutChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.init(ref.current);
    chartRef.current = chart;

    const pct = total > 0 ? Math.round((value / total) * 100) : 0;

    chart.setOption({
      series: [{
        type: 'pie',
        radius: ['65%', '85%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        silent: true,
        label: { show: false },
        data: [
          { value: pct, itemStyle: { color: '#D97706' } },
          { value: 100 - pct, itemStyle: { color: 'rgba(33,29,26,0.06)' } },
        ],
        animationDuration: 800,
        animationEasing: 'cubicOut',
      }],
      graphic: [{
        type: 'text',
        left: 'center',
        top: 'center',
        style: {
          text: `${pct}%`,
          fontSize: 20,
          fontWeight: 'bold',
          fill: '#211D1A',
          fontFamily: 'system-ui',
        },
      }],
    });

    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(ref.current);
    return () => { ro.disconnect(); chart.dispose(); };
  }, [value, total]);

  return (
    <div className="flex flex-col items-center">
      <div ref={ref} style={{ height, width: '100%' }} />
      <p className="mt-1 text-xs text-ink-400">{label}</p>
    </div>
  );
}
