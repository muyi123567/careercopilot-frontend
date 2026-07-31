import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { useEvidenceDocuments } from '../../shared/api/hooks';
import { Link } from 'react-router-dom';

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  processed: { label: '已解析', cls: 'bg-success-50 text-success-600' },
  pending: { label: '处理中', cls: 'bg-accent-50 text-accent-600' },
  failed: { label: '解析失败', cls: 'bg-red-50 text-red-600' },
  uploaded: { label: '已上传', cls: 'bg-ink-100 text-ink-500' },
};

export function DocumentsPage() {
  const { data, isLoading, isError, refetch } = useEvidenceDocuments();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) void handleUpload(f);
  }
  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) void handleUpload(f);
  }
  async function handleUpload(_file: File) {
    // TODO: implement actual upload via apiFetch POST /api/v1/evidence/documents
    void refetch();
  }

  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">文档管理</h1>
        <p className="mt-1 text-sm text-ink-500">上传简历、项目报告、证书，系统自动提取证据</p>
      </section>

      {/* Upload zone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`flex w-full flex-col items-center justify-center gap-3 rounded-xl border-[1.5px] border-dashed py-12 transition-all duration-200 ${
          dragOver ? 'border-accent-400 bg-accent-50/50' : 'border-line hover:border-accent-300 hover:bg-accent-50/30'
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9 text-ink-400" aria-hidden="true">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><path d="M17 8l-5-5-5 5" /><path d="M12 3v12" />
        </svg>
        <span className="text-sm font-medium text-ink-700">拖入文件，或点击选择</span>
        <span className="text-xs text-ink-400">支持 PDF、DOCX、TXT、MD（最大 5MB）</span>
      </button>
      <input ref={inputRef} className="sr-only" type="file" accept=".pdf,.docx,.txt,.md" onChange={onFileChange} />

      {/* Document list */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-line bg-surface p-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-ink-200" />
                <div className="flex-1"><div className="h-3.5 w-36 rounded bg-ink-200" /><div className="mt-1.5 h-3 w-20 rounded bg-ink-100" /></div>
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-line bg-surface p-6 text-center">
          <p className="text-sm text-ink-500">加载文档列表失败。</p>
          <button onClick={() => void refetch()} className="mt-2 text-sm font-medium text-accent-600 underline underline-offset-2">重试</button>
        </div>
      ) : !data?.length ? (
        <div className="rounded-xl border border-dashed border-line p-8 text-center">
          <p className="text-sm text-ink-500">还没有文档，没关系 — 上传第一份简历就够了。</p>
          <Link to="/app/profile/evidence" className="mt-2 inline-block text-xs text-ink-400 hover:text-ink-600">查看证据台账</Link>
        </div>
      ) : (
        <ul className="divide-y divide-line rounded-xl border border-line bg-surface">
          {data.map((doc) => {
            const st = STATUS_MAP[doc.status] ?? STATUS_MAP.uploaded;
            return (
              <li key={doc.id} className="flex items-center gap-3 px-4 py-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-[10px] font-bold text-ink-500">
                  {doc.doc_type?.slice(0, 4).toUpperCase() ?? 'FILE'}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-800">{doc.filename}</p>
                  <p className="text-xs text-ink-400">
                    {new Date(doc.uploaded_at).toLocaleDateString('zh-CN')}
                    {doc.size_bytes ? ` · ${(doc.size_bytes / 1024).toFixed(0)} KB` : ''}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${st.cls}`}>{st.label}</span>
                {doc.status === 'failed' && (
                  <button className="shrink-0 text-xs font-medium text-accent-600 hover:text-accent-700">重试</button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
