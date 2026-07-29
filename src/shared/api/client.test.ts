import { afterEach, describe, expect, it } from 'vitest';
import { getRuntimeConfig, postNavigation } from './client';

afterEach(() => {
  delete (globalThis as { window?: Window }).window;
});

describe('getRuntimeConfig', () => {
  it('returns no backend URL when none is configured', () => {
    expect(getRuntimeConfig().apiBase).toBeUndefined();
  });

  it('uses an injected backend URL', () => {
    (globalThis as { window?: Window }).window = {
      EVIDWAY_CONFIG: { apiBase: 'https://example.test' },
    } as Window;

    expect(getRuntimeConfig()).toMatchObject({
      apiBase: 'https://example.test',
    });
  });

  it('does not create a mock path when the backend is absent', async () => {
    await expect(
      postNavigation(
        { current_occupation: { occupation_id: 'fixture:role', name: '测试职业' } },
        {},
      ),
    ).rejects.toThrow('尚未配置职业导航后端地址');
  });
});


