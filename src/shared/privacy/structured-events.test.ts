import { describe, expect, it } from 'vitest';
import { extractStructuredEvents } from './structured-events';

describe('local structured-event extraction', () => {
  it('keeps compact signals and never forwards direct identifiers', () => {
    const events = extractStructuredEvents('技能：Python 数据分析\n项目：搭建运营看板\n邮箱：alice@example.com\n电话：13800138000');
    expect(events).toEqual([
      expect.objectContaining({ kind: 'skill', label: 'Python 数据分析' }),
      expect.objectContaining({ kind: 'experience', label: '搭建运营看板' }),
    ]);
  });

  it('limits the event envelope to twelve items', () => {
    const events = extractStructuredEvents(Array.from({ length: 20 }, (_, index) => `技能：能力 ${index}`).join('\n'));
    expect(events).toHaveLength(12);
  });
});
