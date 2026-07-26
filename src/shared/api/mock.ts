import type {
  CareerNavigationResponse,
  NavigationRequestInput,
  Source,
} from './contract';

function uid(prefix: string): string {
  return `${prefix}-${(Math.random().toString(36).slice(2, 10))}`;
}

const SOURCES: Source[] = [
  {
    source_id: 'src-traj-cn-2026h1',
    source_type: 'trajectory_dataset',
    title: '全国职业流动样本（2026 上半年）',
    url: null,
    license: '研究用途授权',
    version: '2026.1',
    observed_at: '2026-06-30T00:00:00Z',
    sample_size: 184320,
    scope: {
      geographies: ['全国'],
      industries: ['多行业'],
      experience_levels: ['0-3年', '3-8年', '8年以上'],
      population: '有社保缴纳记录的城镇就业人口抽样',
      time_window: { start: '2026-01-01', end: '2026-06-30' },
    },
    methodology: {
      method_id: 'dedup_trajectory_count',
      name: '去标识轨迹聚合',
      description: '对去标识化就业变动记录按职业对聚合，k 匿名阈值 50',
      version: '2.1',
    },
  },
  {
    source_id: 'src-market-zh-2026q2',
    source_type: 'market_dataset',
    title: '中文招聘市场需求快照（2026 Q2）',
    url: null,
    license: '聚合许可',
    version: '2026.2',
    observed_at: '2026-06-15T00:00:00Z',
    sample_size: 92600,
    scope: {
      geographies: ['一线', '新一线'],
      industries: ['互联网', '专业服务'],
      experience_levels: ['0-3年', '3-8年'],
      population: '主流招聘平台公开职位（已去重）',
      time_window: { start: '2026-04-01', end: '2026-06-30' },
    },
    methodology: {
      method_id: 'dedup_job_posting_count',
      name: '去重职位计数',
      description: '按标题与雇主去重，按城市与时间窗聚合',
      version: '1.4',
    },
  },
  {
    source_id: 'src-taxonomy-cn',
    source_type: 'official_taxonomy',
    title: '国家职业分类大典（2022 版）',
    url: 'https://www.mohrss.gov.cn/',
    license: '公开',
    version: '2022',
    observed_at: '2022-07-01T00:00:00Z',
    sample_size: null,
    scope: {
      geographies: ['全国'],
      industries: ['全部'],
      experience_levels: ['全部'],
      population: '官方职业本体',
      time_window: { start: '2022-07-01', end: '2022-07-01' },
    },
    methodology: {
      method_id: 'official_taxonomy',
      name: '官方分类',
      description: '人社部发布的职业分类本体',
      version: '2022',
    },
  },
  {
    source_id: 'src-survey-2026',
    source_type: 'survey',
    title: '职业满意度与转行意愿调研（n=3200）',
    url: null,
    license: '匿名汇总',
    version: '2026.1',
    observed_at: '2026-05-20T00:00:00Z',
    sample_size: 3200,
    scope: {
      geographies: ['全国'],
      industries: ['多行业'],
      experience_levels: ['0-3年', '3-8年', '8年以上'],
      population: '自愿参与的在职受访者',
      time_window: { start: '2026-03-01', end: '2026-05-01' },
    },
    methodology: {
      method_id: 'weighted_survey',
      name: '加权调研',
      description: '按地区与行业加权，置信区间 95%',
      version: '1.0',
    },
  },
];

/** 完整证据就绪响应：三条候选路径 + 证据 + 来源 */
export function buildOkResponse(input: NavigationRequestInput): CareerNavigationResponse {
  const currentName = input.current_occupation?.name || '当前职业';
  return {
    schema_version: '2.0.0',
    status: 'ok',
    request_id: uid('nav'),
    generated_at: new Date().toISOString(),
    data: {
      current_occupation: input.current_occupation ?? {
        occupation_id: `input:${currentName.toLowerCase().replace(/\s+/g, '-')}`,
        name: currentName,
      },
      paths: [
        {
          path_id: uid('path'),
          path_type: 'deepen',
          target_occupation: { occupation_id: 'occ:land-planning', name: '国土空间规划师' },
          summary: '在土地/空间治理赛道继续深化，把土地资源管理背景转为规划编制与政策落地能力。',
          benefits: ['已有专业积累可直接复用', '体制内与咨询机构需求稳定', '职业身份延续性强'],
          costs: ['晋升周期较长', '需补强 GIS 与规划编制工具'],
          key_gaps: ['缺少规划编制项目经历', '注册规划师资格尚未取得'],
          minimum_validation_actions: [
            {
              action_id: uid('act'),
              title: '独立完成一份片区用地分析',
              expected_signal: '能产出包含现状与矛盾的用地分析报告',
              timebox_days: 30,
            },
          ],
          counterevidence: ['部分城市规划编制外包收缩'],
          evidence_ids: ['ev-reach-1', 'ev-market-1'],
          source_ids: ['src-traj-cn-2026h1', 'src-market-zh-2026q2'],
          uncertainty: {
            kind: 'sample_variability',
            level: 'low',
            basis: '基于 18 万条去标识轨迹样本',
            interpretation: '该方向的历史迁移样本充足，但不表示个人一定能达成。',
          },
        },
        {
          path_id: uid('path'),
          path_type: 'adjacent',
          target_occupation: { occupation_id: 'occ:data-analyst', name: '数据分析师' },
          summary: '把资源管理中的指标与统计经验迁移到数据分析，补齐 SQL/Python 后切入业务分析。',
          benefits: ['技能邻近，转型成本低', '市场需求广', '可先在现岗做数据项目过渡'],
          costs: ['需系统学习编程与建模', '起薪可能低于原预期'],
          key_gaps: ['缺少可证明的分析项目作品', 'SQL/Python 熟练度待验证'],
          minimum_validation_actions: [
            {
              action_id: uid('act'),
              title: '用公开数据集做完一个分析项目并写报告',
              expected_signal: '产出含方法论与结论的公开分析报告',
              timebox_days: 30,
            },
          ],
          counterevidence: ['初级分析岗位竞争加剧'],
          evidence_ids: ['ev-market-2', 'ev-survey-1'],
          source_ids: ['src-market-zh-2026q2', 'src-survey-2026'],
          uncertainty: {
            kind: 'data_coverage',
            level: 'medium',
            basis: '市场数据集中在一线/新一线互联网与专业服务',
            interpretation: '岗位需求可见，但你的城市与行业覆盖度有限，需本地验证。',
          },
        },
        {
          path_id: uid('path'),
          path_type: 'explore',
          target_occupation: { occupation_id: 'occ:pm', name: '产品经理' },
          summary: '跨到产品方向，用行业理解连接用户与研发；适合沟通强、愿承担不确定性的探索。',
          benefits: ['职业天花板更高', '可调动多背景综合判断'],
          costs: ['与现专业关联弱，起点的竞争力需重建', '工作节奏与责任压力更大'],
          key_gaps: ['无产品实习/项目经历', '对研发协作流程不熟悉'],
          minimum_validation_actions: [
            {
              action_id: uid('act'),
              title: ' Shadow 一位产品经理并输出一份需求文档',
              expected_signal: '独立完成一份被团队评审通过的需求文档',
              timebox_days: 45,
            },
          ],
          counterevidence: ['部分行业产品岗缩编'],
          evidence_ids: ['ev-survey-2'],
          source_ids: ['src-survey-2026'],
          uncertainty: {
            kind: 'model_estimate',
            level: 'high',
            basis: '跨行业探索缺乏针对你背景的迁移样本',
            interpretation: '该方向可行性高度不确定，建议先做低成本验证再投入。',
          },
        },
      ],
      evidence: [
        {
          evidence_id: 'ev-reach-1',
          claim: '土地资源管理者向国土空间规划迁移在历史样本中出现频率较高。',
          classification: 'fact',
          evidence_grade: 'B',
          source_ids: ['src-traj-cn-2026h1'],
          user_confirmation: 'not_required',
          extraction_confidence: null,
          uncertainty: {
            kind: 'sample_variability',
            level: 'low',
            basis: '18 万样本',
            interpretation: '这是历史迁移频率，不等于个人成功概率。',
          },
        },
        {
          evidence_id: 'ev-market-1',
          claim: '规划编制类岗位在一线/新一线需求平稳。',
          classification: 'fact',
          evidence_grade: 'B',
          source_ids: ['src-market-zh-2026q2'],
          user_confirmation: 'not_required',
          extraction_confidence: null,
          uncertainty: {
            kind: 'data_coverage',
            level: 'medium',
            basis: '仅覆盖部分城市与行业',
            interpretation: '其他城市情况未知，不能外推。',
          },
        },
        {
          evidence_id: 'ev-market-2',
          claim: '数据分析岗位招聘量高于多数职能中位。',
          classification: 'fact',
          evidence_grade: 'A',
          source_ids: ['src-market-zh-2026q2'],
          user_confirmation: 'not_required',
          extraction_confidence: null,
          uncertainty: {
            kind: 'sample_variability',
            level: 'low',
            basis: '9.2 万去重职位',
            interpretation: '需求存在，但个人匹配度另算。',
          },
        },
        {
          evidence_id: 'ev-survey-1',
          claim: '调研中约 4 成受访者愿意转向数据分析类岗位。',
          classification: 'inference',
          evidence_grade: 'C',
          source_ids: ['src-survey-2026'],
          user_confirmation: 'not_required',
          extraction_confidence: 0.7,
          uncertainty: {
            kind: 'sample_variability',
            level: 'medium',
            basis: 'n=3200 自愿样本',
            interpretation: '意愿不等于可行性，且样本有自选择偏差。',
          },
        },
        {
          evidence_id: 'ev-survey-2',
          claim: '跨行业做产品的成功率在公开调研中缺乏针对你背景的证据。',
          classification: 'inference',
          evidence_grade: 'U',
          source_ids: ['src-survey-2026'],
          user_confirmation: 'not_required',
          extraction_confidence: null,
          uncertainty: {
            kind: 'not_available',
            level: 'unknown',
            basis: '无对应细分样本',
            interpretation: '数据不足，无法给出评级。',
          },
        },
      ],
      sources: SOURCES,
      coverage_gaps: [],
    },
    error: null,
  };
}

/** 数据不足响应（后端当前真实状态） */
export function buildDataInsufficientResponse(input: NavigationRequestInput): CareerNavigationResponse {
  const gaps: string[] = ['trajectory_path_engine_not_available'];
  if (!input.current_occupation) gaps.push('current_occupation_missing');
  return {
    schema_version: '2.0.0',
    status: 'data_insufficient',
    request_id: uid('nav'),
    generated_at: new Date().toISOString(),
    data: {
      current_occupation: input.current_occupation ?? null,
      paths: [],
      evidence: [],
      sources: [],
      coverage_gaps: gaps,
    },
    error: null,
  };
}

/** 服务失败响应 */
export function buildServiceFailureResponse(): CareerNavigationResponse {
  return {
    schema_version: '2.0.0',
    status: 'service_failure',
    request_id: uid('nav'),
    generated_at: new Date().toISOString(),
    data: null,
    error: {
      code: 'UPSTREAM_UNAVAILABLE',
      message: '职业路径服务暂时不可用，请稍后重试。',
      retryable: true,
      trace_id: uid('trace'),
    },
  };
}
