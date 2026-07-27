import { afterEach, describe, expect, it } from 'vitest';
import { getRuntimeConfig } from './client';

afterEach(() => {
  delete (globalThis as { window?: Window }).window;
});

describe('getRuntimeConfig', () => {
  it('does not disable the safe mock fallback when VITE_USE_MOCK is absent', () => {
    expect(getRuntimeConfig().useMock).toBeUndefined();
  });

  it('gives an injected runtime setting priority over the build-time setting', () => {
    (globalThis as { window?: Window }).window = {
      CAREERCOPILOT_CONFIG: { useMock: true, apiBase: 'https://example.test' },
    } as Window;

    expect(getRuntimeConfig()).toMatchObject({
      useMock: true,
      apiBase: 'https://example.test',
    });
  });
});
