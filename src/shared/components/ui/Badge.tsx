import type {
  EvidenceGrade,
  PathType,
  ResponseStatus,
  UncertaintyLevel,
} from '../../api/contract';
import {
  classificationLabel,
  evidenceGradeLabel,
  evidenceGradeReason,
  pathTypeHint,
  pathTypeLabel,
  statusLabel,
  uncertaintyLevelLabel,
} from '../../api/labels';

const GRADE_CLASS: Record<EvidenceGrade, string> = {
  A: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  B: 'bg-sky-100 text-sky-800 border-sky-200',
  C: 'bg-amber-100 text-amber-800 border-amber-200',
  D: 'bg-red-100 text-red-800 border-red-200',
  U: 'bg-slate-100 text-slate-600 border-slate-200',
};

export function EvidenceGradeBadge({ grade }: { grade: EvidenceGrade }) {
  return (
    <span
      title={evidenceGradeReason[grade]}
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${GRADE_CLASS[grade]}`}
    >
      {evidenceGradeLabel[grade]}
    </span>
  );
}

const PATH_CLASS: Record<PathType, string> = {
  deepen: 'bg-brand-50 text-brand-700 border-brand-200',
  adjacent: 'bg-teal-50 text-teal-700 border-teal-200',
  explore: 'bg-ink-900/5 text-ink-700 border-ink-900/10',
};

export function PathTypeChip({ type }: { type: PathType }) {
  return (
    <span
      title={pathTypeHint[type]}
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${PATH_CLASS[type]}`}
    >
      {pathTypeLabel[type]}
    </span>
  );
}

const UNC_CLASS: Record<UncertaintyLevel, string> = {
  low: 'bg-emerald-50 text-emerald-700',
  medium: 'bg-amber-50 text-amber-700',
  high: 'bg-red-50 text-red-700',
  very_high: 'bg-red-100 text-red-800',
  unknown: 'bg-slate-100 text-slate-600',
};

export function UncertaintyPill({ level }: { level: UncertaintyLevel }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${UNC_CLASS[level]}`}>
      {uncertaintyLevelLabel[level]}
    </span>
  );
}

const STATUS_CLASS: Record<ResponseStatus, string> = {
  ok: 'bg-emerald-100 text-emerald-800',
  data_insufficient: 'bg-amber-100 text-amber-800',
  service_failure: 'bg-red-100 text-red-800',
};

export function StatusPill({ status }: { status: ResponseStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CLASS[status]}`}>
      {statusLabel[status]}
    </span>
  );
}

const CLASS_CLASS: Record<'fact' | 'inference' | 'recommendation', string> = {
  fact: 'bg-ink-900/5 text-ink-700',
  inference: 'bg-brand-50 text-brand-700',
  recommendation: 'bg-brand-100 text-brand-800',
};

export function ClassificationTag({ kind }: { kind: 'fact' | 'inference' | 'recommendation' }) {
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium ${CLASS_CLASS[kind]}`}>
      {classificationLabel[kind]}
    </span>
  );
}
