export const workflowIndustries = [
  { name: '互联网产品', slug: 'internet-product', description: '覆盖产品规划、需求管理、项目推进与跨团队协作等工作场景。', roleCount: 6 },
  { name: '内容与运营', slug: 'content-ops', description: '围绕选题、内容生产、活动运营、增长转化与用户维护展开。', roleCount: 5 },
  { name: '咨询与服务', slug: 'consulting-service', description: '适用于方案咨询、客户服务、交付推进与顾问型业务协同。', roleCount: 4 },
  { name: '教育培训', slug: 'education', description: '涵盖课程设计、教学运营、班级管理与学习服务支持。', roleCount: 5 }
] as const;

export const workflowRoles = [
  { name: '产品经理', slug: 'product-manager', description: '负责需求梳理、产品方案设计、项目协同与版本推进。', sceneCount: 8 },
  { name: '产品运营', slug: 'product-operations', description: '负责活动推进、数据跟踪、用户触达与运营策略落地。', sceneCount: 7 },
  { name: '用户研究', slug: 'user-research', description: '负责用户访谈、反馈整理、洞察分析与需求提炼。', sceneCount: 6 },
  { name: '项目协同', slug: 'project-coordination', description: '负责跨团队推进、进度对齐、风险跟踪与任务闭环。', sceneCount: 6 }
] as const;

export const workflowScenes = [
  { title: '生成我的工作流', slug: 'generate-my-workflow', description: '根据当前行业与职位，生成适合我的专属工作流结构。', isGenerateEntry: true },
  { title: '需求澄清', slug: 'requirement-clarification', description: '用于整理需求背景、目标、约束条件与关键决策问题。' },
  { title: 'PRD 生成', slug: 'prd-generation', description: '基于已有输入快速生成结构化 PRD 初稿与核心模块内容。' },
  { title: '开发拆解', slug: 'development-breakdown', description: '把需求转化为研发可执行的任务拆解、模块分工与优先级。' },
  { title: '用户访谈整理', slug: 'user-interview-summary', description: '整理访谈纪要、提炼洞察、归纳用户问题与机会点。' },
  { title: '版本排期规划', slug: 'release-planning', description: '基于目标与资源制定版本节奏、排期方案与关键里程碑。' }
] as const;
