import { Link } from 'react-router-dom';
import { useEvidenceDocuments, useEvidenceItems, type EvidenceDocument } from '../../shared/api/hooks';
import { EmptyEvidence } from '../../shared/components/illustrations/EmptyStates';
import { FactCandidateCard } from '../../shared/components/FactCandidateCard';

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
      <div className="flex flex-col items-center">
        <span className={`z-10 h-3 w-3 shrink-0 rounded-full border-2 ${
          doc.status === 'processed' ? 'border-success-500 bg-success-50' : doc.status === 'failed' ? 'border-red-400 bg-red-50' : 'border-ink-300 bg-surface'
        }`} aria-hidden="true" />
        <span className="w-px flex-1 bg-line" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1 -mt-0.5">
        <Link to={`/app/documents/${doc.id}`} className="block rounded-xl border border-line bg-surface p-3.5 transition-colors hover:border-accent-200">
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
        </Link>
      </div>
    </li>
  );
}

export function EvidenceLedgerPage() {
  const { data: documents, isLoading: docsLoading, isError: docsError, refetch } = useEvidenceDocuments();
  const { data: items, isLoading: itemsLoading } = useEvidenceItems();

  const total = documents?.length ?? 0;
  const processed = documents?.filter((d) => d.status === 'processed').length ?? 0;
  const pendingItems = items?.filter((i) => i.status === 'pending').length ?? 0;

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

      {/* Stats bar */}
      {total > 0 && (
        <section className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-line bg-surface p-3 text-center">
            <p className="text-lg font-bold text-ink-900">{total}</p>
            <p className="text-[10px] font-medium text-ink-400">总证据</p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-3 text-center">
            <p className="text-lg font-bold text-success-600">{processed}</p>
            <p className="text-[10px] font-medium text-ink-400">已解析</p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-3 text-center">
            <p className="text-lg font-bold text-accent-600">{pendingItems}</p>
            <p className="text-[10px] font-medium text-ink-400">待确认</p>
          </div>
        </section>
      )}

      {/* Pending evidence items for confirmation */}
      {!itemsLoading && items && items.filter((i) => i.status === 'pending').length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-ink-800">待确认的提取结果</h2>
          <div className="space-y-3">
            {items.filter((i) => i.status === 'pending').slice(0, 5).map((item) => (
              <FactCandidateCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Document timeline */}
      {docsLoading ? (
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
      ) : docsError ? (
        <div className="rounded-xl border border-line bg-surface p-6 text-center">
          <p className="text-sm text-ink-500">加载证据文档失败，请检查网络后重试。</p>
          <button onClick={() => void refetch()} className="mt-2 text-sm font-medium text-accent-600 underline underline-offset-2 hover:text-accent-700">
            重试
          </button>
        </div>
      ) : !documents?.length ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-line p-10 text-center">
          <EmptyEvidence />
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
          <h2 className="text-sm font-semibold text-ink-800">文档时间线</h2>
          <ul>
            {documents.map((doc) => (
              <TimelineItem key={doc.id} doc={doc} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
