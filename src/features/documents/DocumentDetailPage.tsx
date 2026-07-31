import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiFetch, ApiError } from '../../shared/api/fetch';
import { useEvidenceItems } from '../../shared/api/hooks';
import { FactCandidateCard } from '../../shared/components/FactCandidateCard';

interface DocumentDetail {
  id: string;
  filename: string;
  doc_type: string;
  status: string;
  uploaded_at: string;
  size_bytes?: number;
  page_count?: number;
  parse_result?: {
    skills?: string[];
    experiences?: string[];
    education?: string[];
  };
}

export function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: doc, isLoading, isError, refetch } = useQuery<DocumentDetail, ApiError>({
    queryKey: ['evidence', 'document', id],
    queryFn: async () => {
      const res = await apiFetch(`/api/v1/evidence/documents/${id}`);
      if (!res.ok) throw new ApiError(res.status, '获取文档详情失败');
      return res.json();
    },
    enabled: !!id,
  });

  const { data: items } = useEvidenceItems();
  const relatedItems = items?.filter((i) => i.source_document_id === id) ?? [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-2">
          <div className="h-6 w-48 rounded bg-ink-200" />
          <div className="h-4 w-32 rounded bg-ink-100" />
        </div>
        <div className="animate-pulse rounded-xl border border-line bg-surface p-6">
          <div className="h-4 w-full rounded bg-ink-100" />
          <div className="mt-3 h-4 w-2/3 rounded bg-ink-100" />
        </div>
      </div>
    );
  }

  if (isError || !doc) {
    return (
      <div className="space-y-4">
        <Link to="/app/documents" className="text-xs font-medium text-accent-600 hover:text-accent-700">← 返回文档列表</Link>
        <div className="rounded-xl border border-line bg-surface p-6 text-center">
          <p className="text-sm text-ink-500">加载文档详情失败。</p>
          <button onClick={() => void refetch()} className="mt-2 text-sm font-medium text-accent-600 underline underline-offset-2">重试</button>
        </div>
      </div>
    );
  }

  const STATUS_MAP: Record<string, { label: string; cls: string }> = {
    processed: { label: '已解析', cls: 'bg-success-50 text-success-600' },
    pending: { label: '解析中', cls: 'bg-accent-50 text-accent-600' },
    parsing: { label: '解析中', cls: 'bg-accent-50 text-accent-600' },
    failed: { label: '解析失败', cls: 'bg-red-50 text-red-600' },
    uploaded: { label: '已上传', cls: 'bg-ink-100 text-ink-500' },
  };
  const st = STATUS_MAP[doc.status] ?? STATUS_MAP.uploaded;

  return (
    <div className="space-y-5">
      {/* Back link */}
      <Link to="/app/documents" className="inline-flex items-center gap-1 text-xs font-medium text-ink-400 transition-colors hover:text-ink-700">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path d="M19 12H5m7-7l-7 7 7 7" /></svg>
        返回文档列表
      </Link>

      {/* Document header */}
      <section className="rounded-xl border border-line bg-surface p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-ink-900">{doc.filename}</h1>
            <p className="mt-1 text-xs text-ink-400">
              {new Date(doc.uploaded_at).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
              {doc.size_bytes ? ` · ${(doc.size_bytes / 1024).toFixed(0)} KB` : ''}
              {doc.page_count ? ` · ${doc.page_count} 页` : ''}
            </p>
          </div>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium ${st.cls}`}>{st.label}</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-medium text-ink-500">{doc.doc_type?.toUpperCase()}</span>
        </div>
      </section>

      {/* Parse result summary */}
      {doc.status === 'processed' && doc.parse_result && (
        <section className="rounded-xl border border-line bg-surface p-5">
          <h2 className="text-sm font-semibold text-ink-800">解析摘要</h2>
          <div className="mt-3 space-y-3">
            {doc.parse_result.skills && doc.parse_result.skills.length > 0 && (
              <div>
                <p className="text-xs font-medium text-ink-400">技能</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {doc.parse_result.skills.map((s) => (
                    <span key={s} className="rounded-full bg-accent-50 px-2.5 py-1 text-xs text-accent-700">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {doc.parse_result.experiences && doc.parse_result.experiences.length > 0 && (
              <div>
                <p className="text-xs font-medium text-ink-400">经历</p>
                <ul className="mt-1.5 space-y-1">
                  {doc.parse_result.experiences.map((e, i) => (
                    <li key={i} className="text-sm text-ink-700">{e}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Related evidence items */}
      {relatedItems.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-ink-800">提取的证据条目</h2>
          <div className="space-y-3">
            {relatedItems.map((item) => (
              <FactCandidateCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Parsing state */}
      {(doc.status === 'pending' || doc.status === 'parsing') && (
        <div className="rounded-xl border border-accent-200 bg-accent-50/50 p-6 text-center">
          <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-accent-200 border-t-accent-500" />
          <p className="text-sm font-medium text-ink-700">正在解析中...</p>
          <p className="mt-1 text-xs text-ink-400">解析完成后会自动提取技能和经历</p>
        </div>
      )}

      {/* Failed state */}
      {doc.status === 'failed' && (
        <div className="rounded-xl border border-red-200 bg-red-50/50 p-6 text-center">
          <p className="text-sm font-medium text-red-700">解析失败</p>
          <p className="mt-1 text-xs text-red-600">请检查文件格式是否正确，或重新上传</p>
          <Link to="/app/documents" className="mt-3 inline-block rounded-lg bg-ink-900 px-4 py-2 text-xs font-medium text-white hover:bg-ink-700">
            重新上传
          </Link>
        </div>
      )}
    </div>
  );
}
