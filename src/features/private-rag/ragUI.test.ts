import { describe, expect, it } from "vitest";
import {
  initialState,
  toggleEnable,
  defaultIsOff,
  citationLabels,
  deleteDocument,
  neverPresentPrivateAsPublic,
  type PrivateDocSummary,
} from "./ragUI";

function doc(enabled = false): PrivateDocSummary {
  return { documentId: "doc-1", enabled, chunkCount: 2, revision: "r1", byteHash: "sha256:abc" };
}

describe("C-EDU-01 private RAG UI", () => {
  it("private RAG is off by default", () => {
    expect(defaultIsOff(doc(false))).toBe(true);
    expect(initialState().enabledIds).toEqual([]);
  });

  it("treats undefined enabled as off by default", () => {
    expect(defaultIsOff({ ...doc(), enabled: undefined as unknown as boolean })).toBe(true);
  });

  it("requires explicit owner action to enable", () => {
    let state = initialState();
    state = { ...state, documents: [doc(false)] };
    expect(state.enabledIds).toEqual([]);
    state = toggleEnable(state, "doc-1");
    expect(state.enabledIds).toEqual(["doc-1"]);
    state = toggleEnable(state, "doc-1");
    expect(state.enabledIds).toEqual([]);
  });

  it("answer contributions identify document and page/chunk source", () => {
    const label = citationLabels({ documentId: "doc-1", chunkId: "doc-1:c0", page: "3", byteHash: "sha256:abc" });
    expect(label).toContain("doc:doc-1");
    expect(label).toContain("page:3");
    expect(label).toContain("chunk:doc-1:c0");
  });

  it("delete stops future retrieval without changing public search", () => {
    let state = initialState();
    state = { ...state, documents: [doc(true)], enabledIds: ["doc-1"], citations: [{ documentId: "doc-1", chunkId: "doc-1:c0", page: "3", byteHash: "sha256:abc" }] };
    state = deleteDocument(state, "doc-1");
    expect(state.documents).toEqual([]);
    expect(state.enabledIds).toEqual([]);
    expect(state.citations).toEqual([]);
    expect(state.publicSearchChanged).toBe(false);
  });

  it("never presents private content as public evidence", () => {
    expect(neverPresentPrivateAsPublic("正常公共证据")).toBe(true);
    expect(neverPresentPrivateAsPublic('{"private_chunk":"x"}')).toBe(false);
  });
});