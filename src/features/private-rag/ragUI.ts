// C-EDU-01: private curriculum RAG UI logic.
// Private RAG is off by default and requires an explicit owner action.
// Every answer contribution identifies the user-uploaded document and
// page/chunk source.  Delete/disable stop future private retrieval without
// changing public search.

export interface PrivateDocSummary {
  documentId: string;
  enabled: boolean;
  chunkCount: number;
  revision: string;
  byteHash: string;
}

export interface PrivateCitationView {
  documentId: string;
  chunkId: string;
  page: string;
  byteHash: string;
}

export interface RAGUiState {
  documents: PrivateDocSummary[];
  enabledIds: string[];
  citations: PrivateCitationView[];
  publicSearchChanged: boolean;
}

const FORBIDDEN_PUBLIC_TOKENS = ["private_chunk", "private_embedding", "private_summary"];

export function initialState(): RAGUiState {
  return { documents: [], enabledIds: [], citations: [], publicSearchChanged: false };
}

export function toggleEnable(state: RAGUiState, documentId: string): RAGUiState {
  const enabled = state.enabledIds.includes(documentId)
    ? state.enabledIds.filter((id) => id !== documentId)
    : [...state.enabledIds, documentId];
  return { ...state, enabledIds: enabled };
}

export function defaultIsOff(doc: PrivateDocSummary): boolean {
  return doc.enabled === false;
}

export function citationLabels(citation: PrivateCitationView): string {
  // Every answer contribution identifies document + page/chunk source.
  return `doc:${citation.documentId} page:${citation.page} chunk:${citation.chunkId}`;
}

export function deleteDocument(state: RAGUiState, documentId: string): RAGUiState {
  return {
    ...state,
    documents: state.documents.filter((d) => d.documentId !== documentId),
    enabledIds: state.enabledIds.filter((id) => id !== documentId),
    citations: state.citations.filter((c) => c.documentId !== documentId),
    publicSearchChanged: false, // deletion never changes public search
  };
}

export function neverPresentPrivateAsPublic(blob: string): boolean {
  return !FORBIDDEN_PUBLIC_TOKENS.some((token) => blob.includes(token));
}