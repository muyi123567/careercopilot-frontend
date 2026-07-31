import { Link } from 'react-router-dom';
import { useEvidenceDocuments, type EvidenceDocument } from '../../shared/api/hooks';

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  processed: { label: '已解析', cls: 'bg-success-50 text-success-600' },
  pending: { label: '处理中', cls: 'bg-accent-50 text-accent-600' },
  failed: { label: '解析失败', cls: 'bg-red-50 text-red-600' },
  uploaded: { label: '已上传', cls: 'bg-ink-100 text-ink-500' },
};

function TimelineItem({ doc }: { doc: EvidenceDocument }) {
  const status = STATUS_MAP[doc.status] ?? STATUS_MAP.uploaded;
  return (
    <li className="relative flex gap-4 pb-6 last:pb-0">
      {/* Timeline line + node */}
      <div className="flex flex-col items-center">
        <span className={`z-10 h-3 w-3 shrink-0 rounded-full border-2 ${
          doc.status === 'processed' ? 'border-success-500 bg-success-50' : doc.status === 'failed' ? 'border-red-400 bg-red-50' : 'border-ink-300 bg-surface'
        }`} aria-hidden="true" />
        <span className="w-px flex-1 bg-line" aria-hidden="true" />
      </div>
      {/* Content */}
      <div className="min-w-0 flex-1 -mt-0.5">
        <div className="rounded-xl border border-line bg-surface p-3.5 transition-colors hover:border-accent-200">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink-800">{doc.filename}</p>
              <p className="mt-0.5 text-xs text-ink-400">
                {new Date(doc.uploaded_at).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                {doc.size_bytes ? ` · ${(doc.size_bytes / 1024).toFixed(0)} KB` : ''}
              </p>
            </div>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${status.cls}`}>
              {status.label}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-medium text-ink-500">
              {doc.doc_type?.toUpperCase() ?? '文件'}
            </span>
            <span className="text-[10px] text-ink-300">来源：用户上传</span>
          </div>
        </div>
      </div>
    </li>
  );
}

export function EvidenceLedgerPage() {
  const { data, isLoading, isError, refetch } = useEvidenceDocuments();

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">证据台账</h1>
          <p className="mt-1 text-sm text-ink-500">你的每一步，都有据可查</p>
        </div>
        <Link
          to="/app/documents"
          className="shrink-0 rounded-lg bg-ink-900 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-ink-700"
        >
          上传文档
        </Link>
      </section>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-3 w-3 animate-pulse rounded-full bg-ink-200" />
                <div className="w-px flex-1 bg-line" />
              </div>
              <div className="flex-1 animate-pulse rounded-xl border border-line bg-surface p-4">
                <div className="h-4 w-40 rounded bg-ink-200" />
                <div className="mt-2 h-3 w-24 rounded bg-ink-100" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-line bg-surface p-6 text-center">
          <p className="text-sm text-ink-500">加载证据文档失败，请检查网络后重试。</p>
          <button onClick={() => void refetch()} className="mt-2 text-sm font-medium text-accent-600 underline underline-offset-2 hover:text-accent-700">
            重试
          </button>
        </div>
      ) : !data?.length ? (
        <div className="rounded-xl border border-dashed border-line p-10 text-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto h-10 w-10 text-ink-300" aria-hidden="true">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-3 text-sm font-medium text-ink-600">还没有证据，没关系</p>
          <p className="mt-1 text-xs text-ink-400">从一份简历开始就够了。上传后系统会自动提取技能和经历。</p>
          <Link
            to="/app/documents"
            className="mt-4 inline-block rounded-lg bg-accent-500 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-accent-600"
          >
            上传第一份文档
          </Link>
        </div>
      ) : (
        <>
          <p className="text-xs text-ink-400">共 {data.length} 份证据，按时间倒序</p>
          <ul>
            {data.map((doc) => (
              <TimelineItem key={doc.id} doc={doc} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
