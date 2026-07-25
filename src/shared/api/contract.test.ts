import { describe, it, expect } from 'vitest';
import { validateNavigationResponseSafe } from './validate';
import {
  buildOkResponse,
  buildDataInsufficientResponse,
  buildServiceFailureResponse,
} from './mock';
import type { NavigationRequestInput } from './contract';

const input: NavigationRequestInput = {
  current_occupation: { occupation_id: 'input:test', name: '测试职业' },
};

describe('consumer contract: mock 数据符合 schema 2.0.0', () => {
  it('ok 响应通过校验', () => {
    const r = validateNavigationResponseSafe(buildOkResponse(input));
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.status).toBe('ok');
      expect(r.value.data?.paths.length).toBeLessThanOrEqual(3);
      expect(r.value.data?.evidence.length).toBeGreaterThan(0);
    }
  });

  it('data_insufficient 响应通过校验', () => {
    const r = validateNavigationResponseSafe(buildDataInsufficientResponse(input));
    expect(r.ok).toBe(true);
  });

  it('service_failure 响应 data 为 null', () => {
    const r = validateNavigationResponseSafe(buildServiceFailureResponse());
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.data).toBeNull();
      expect(r.value.error?.code).toBe('UPSTREAM_UNAVAILABLE');
    }
  });
});

describe('运行时校验应拒绝非法响应', () => {
  it('拒绝错误 schema 版本', () => {
    const r = validateNavigationResponseSafe({ schema_version: '1.0.0', status: 'ok' });
    expect(r.ok).toBe(false);
  });

  it('拒绝 data_insufficient 但无 coverage_gaps', () => {
    const bad = buildDataInsufficientResponse(input);
    if (bad.data) bad.data.coverage_gaps = [];
    const r = validateNavigationResponseSafe(bad);
    expect(r.ok).toBe(false);
  });

  it('拒绝 service_failure 却带 data', () => {
    const bad = buildServiceFailureResponse();
    // @ts-expect-error 故意构造非法
    bad.data = { paths: [] };
    const r = validateNavigationResponseSafe(bad);
    expect(r.ok).toBe(false);
  });

  it('拒绝 evidence_grade 非法', () => {
    const bad = buildOkResponse(input);
    if (bad.data) {
      // @ts-expect-error 故意构造非法
      bad.data.evidence[0].evidence_grade = 'Z';
    }
    const r = validateNavigationResponseSafe(bad);
    expect(r.ok).toBe(false);
  });
});
