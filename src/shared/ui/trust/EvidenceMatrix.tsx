import { memo } from 'react'

/**
 * V2 §8.4 可信组件：EvidenceMatrix
 * 各层独立等级，不算总分。
 * V2 §8.5：不使用雷达图面积暗示“综合更优”。
 */
type EvidenceGrade = 'A' | 'B' | 'C' | 'D' | 'U'

interface LayerGrade {
  name: string
  grade: EvidenceGrade
  coverage: string
}

interface EvidenceMatrixProps {
  layers: LayerGrade[]
}

const GRADE_STYLES: Record<EvidenceGrade, string> = {
  A: 'text-(--success)',
  B: 'text-(--fact)',
  C: 'text-(--warning)',
  D: 'text-(--danger)',
  U: 'text-(--unknown)',
}

export const EvidenceMatrix = memo(function EvidenceMatrix({ layers }: EvidenceMatrixProps) {
  return (
    <div className="overflow-hidden rounded-[12px] border border-(--border)">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-(--border) bg-(--canvas)">
            <th className="px-4 py-2 text-left text-xs font-medium text-(--muted)">证据层</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-(--muted)">等级</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-(--muted)">覆盖</th>
          </tr>
        </thead>
        <tbody>
          {layers.map((layer) => (
            <tr key={layer.name} className="border-b border-(--border) last:border-0">
              <td className="px-4 py-2 text-(--ink)">{layer.name}</td>
              <td className={`px-4 py-2 text-center font-mono font-semibold ${GRADE_STYLES[layer.grade] ?? 'text-(--unknown)'}`}>
                {layer.grade}
              </td>
              <td className="px-4 py-2 text-center text-xs text-(--muted)">{layer.coverage}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-(--border) bg-(--canvas) px-4 py-2 text-xs text-(--muted)">
        各层独立评估，不合成为总分或成功概率。
      </p>
    </div>
  )
})
