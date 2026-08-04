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

    const request = apiFetch('/api/v1/slow');
    await vi.advanceTimersByTimeAsync(20_000);

    await expect(request).rejects.toMatchObject({ status: 0, message: '请求超时，请稍后重试' });
  });
});
