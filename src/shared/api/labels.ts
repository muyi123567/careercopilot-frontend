import type {
  EvidenceClassification,
  EvidenceGrade,
  PathType,
  ResponseStatus,
  SourceType,
  UncertaintyLevel,
} from './contract';

export const statusLabel: Record<ResponseStatus, string> = {
  ok: '证据就绪',
  data_insufficient: '数据不足',
  service_failure: '服务失败',
};

export const pathTypeLabel: Record<PathType, string> = {
  deepen: '本行业深化',
  adjacent: '邻近迁移',
  explore: '跨行业探索',
};

export const pathTypeHint: Record<PathType, string> = {
  deepen: '在当前赛道继续深化，利用已有积累',
  adjacent: '迁移到技能/经验邻近的方向',
  explore: '跨到差异较大的行业或职能',
};

export const evidenceGradeLabel: Record<EvidenceGrade, string> = {
  A: 'A · 强证据',
  B: 'B · 中等',
  C: 'C · 弱',
  D: 'D · 存疑',
  U: 'U · 未知',
};

export const evidenceGradeReason: Record<EvidenceGrade, string> = {
  A: '样本充足、来源权威、方法透明',
  B: '来源较可靠但覆盖有限',
  C: '证据单薄或间接',
  D: '存在明显冲突或偏差',
  U: '数据不足，无法评级',
};

export const classificationLabel: Record<EvidenceClassification, string> = {
  fact: '事实',
  inference: '推断',
  recommendation: '建议',
};

export const sourceTypeLabel: Record<SourceType, string> = {
  user_confirmed: '用户确认',
  job_posting: '招聘信息',
  official_taxonomy: '官方职业分类',
  survey: '调研',
  trajectory_dataset: '轨迹数据集',
  market_dataset: '市场数据集',
  model_output: '模型输出',
  other: '其他',
};

export const uncertaintyLevelLabel: Record<UncertaintyLevel, string> = {
  low: '不确定性低',
  medium: '不确定性中',
  high: '不确定性高',
  very_high: '不确定性极高',
  unknown: '不确定性未知',
};

/** 五维度（不合成单一成功率） */
export const evidenceDimensions = [
  { key: 'historical_reachability', label: '历史可达性' },
  { key: 'china_market_signal', label: '中文市场' },
  { key: 'personal_evidence_fit', label: '个人证据' },
  { key: 'preference_constraint_fit', label: '偏好约束' },
  { key: 'data_coverage', label: '数据覆盖' },
] as const;
