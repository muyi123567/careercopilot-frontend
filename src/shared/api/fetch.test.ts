import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiFetch } from './fetch';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('apiFetch', () => {
  it('includes credentials when calling the backend', async () => {
    const fetchMock = vi.fn(async () => new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await apiFetch('/api/v1/health');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v1/health',
      expect.objectContaining({ credentials: 'include' }),
    );
  });

  it('returns a timeout-specific error after 20 seconds', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn((_url: string, options: RequestInit) => new Promise<Response>((_resolve, reject) => {
      options.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
    })));

    // Writes are intentionally not replayed, so this exercises the timeout
    // path without waiting for the safe-read retry budget.
    const request = apiFetch('/api/v1/slow', { method: 'POST', body: '{}' });
    const assertion = expect(request).rejects.toMatchObject({ status: 0, message: '请求超时，请稍后重试' });
    await vi.advanceTimersByTimeAsync(20_000);

    await assertion;
  });

  it('retries transient gateway failures for safe reads and then succeeds', async () => {
    vi.useFakeTimers();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('', { status: 502 }))
      .mockResolvedValueOnce(new Response('', { status: 503 }))
      .mockResolvedValueOnce(new Response('{"ok":true}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const request = apiFetch('/api/v1/health');
    await vi.runOnlyPendingTimersAsync();
    await vi.advanceTimersByTimeAsync(250);
    await vi.advanceTimersByTimeAsync(500);
    const response = await request;

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('never retries a write request after a transient gateway failure', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('', { status: 502 }));
    vi.stubGlobal('fetch', fetchMock);

    const response = await apiFetch('/api/v1/navigation', { method: 'POST', body: '{}' });

    expect(response.status).toBe(502);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
