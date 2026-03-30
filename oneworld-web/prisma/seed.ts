export const industries = [
  { name: '内容创业', slug: 'content-creation', type: 'opc', description: '围绕内容、IP、社群、知识表达建立一人公司路径。', sortOrder: 1 },
  { name: '咨询顾问', slug: 'consulting', type: 'opc', description: '适合输出策略、方案、诊断与顾问式交付的业务模型。', sortOrder: 2 },
  { name: '教育培训', slug: 'education', type: 'both', description: '覆盖课程、训练营、教学服务与知识陪跑等方向。', sortOrder: 3 },
  { name: '软件服务', slug: 'software-service', type: 'both', description: '适合轻 SaaS、工具产品、自动化服务与技术型个体业务。', sortOrder: 4 },
  { name: '电商与零售', slug: 'ecommerce', type: 'opc', description: '围绕选品、渠道、内容转化与私域经营搭建变现模型。', sortOrder: 5 },
  { name: '本地与专业服务', slug: 'local-service', type: 'opc', description: '面向本地经营、专业服务、小团队外包与轻服务交付场景。', sortOrder: 6 },
  { name: '互联网产品', slug: 'internet-product', type: 'workflow', description: '覆盖产品规划、需求管理、项目推进与跨团队协作等工作场景。', sortOrder: 7 },
  { name: '内容与运营', slug: 'content-ops', type: 'workflow', description: '围绕选题、内容生产、活动运营、增长转化与用户维护展开。', sortOrder: 8 },
  { name: '咨询与服务', slug: 'consulting-service', type: 'workflow', description: '适用于方案咨询、客户服务、交付推进与顾问型业务协同。', sortOrder: 9 },
  { name: '品牌营销', slug: 'brand-marketing', type: 'workflow', description: '适用于品牌策划、营销投放、传播执行与内容协同等任务。', sortOrder: 10 }
] as const;

export const opcProjectTemplates = [
  { industrySlug: 'content-creation', title: '创建我的 OPC', slug: 'create-my-opc', description: '从当前行业出发，创建属于我自己的 OPC 项目结构。', isCreateEntry: true, sortOrder: 1 },
  { industrySlug: 'content-creation', title: '知识 IP 变现型 OPC', slug: 'knowledge-ip-opc', description: '通过内容输出、知识产品和私域承接形成持续变现闭环。', sortOrder: 2 },
  { industrySlug: 'content-creation', title: '高客单咨询成交型 OPC', slug: 'high-ticket-consulting-opc', description: '围绕认知输出、咨询诊断与方案交付构建成交路径。', sortOrder: 3 }
] as const;

export const workflowRoles = [
  { industrySlug: 'internet-product', name: '产品经理', slug: 'product-manager', description: '负责需求梳理、产品方案设计、项目协同与版本推进。', sortOrder: 1 },
  { industrySlug: 'internet-product', name: '产品运营', slug: 'product-operations', description: '负责活动推进、数据跟踪、用户触达与运营策略落地。', sortOrder: 2 },
  { industrySlug: 'internet-product', name: '用户研究', slug: 'user-research', description: '负责用户访谈、反馈整理、洞察分析与需求提炼。', sortOrder: 3 },
  { industrySlug: 'internet-product', name: '项目协同', slug: 'project-coordination', description: '负责跨团队推进、进度对齐、风险跟踪与任务闭环。', sortOrder: 4 }
] as const;

export const workflowScenes = [
  { roleSlug: 'product-manager', title: '生成我的工作流', slug: 'generate-my-workflow', description: '根据当前行业与职位，生成适合我的专属工作流结构。', isGenerateEntry: true, sortOrder: 1 },
  { roleSlug: 'product-manager', title: '需求澄清', slug: 'requirement-clarification', description: '用于整理需求背景、目标、约束条件与关键决策问题。', sortOrder: 2 },
  { roleSlug: 'product-manager', title: 'PRD 生成', slug: 'prd-generation', description: '基于已有输入快速生成结构化 PRD 初稿与核心模块内容。', sortOrder: 3 },
  { roleSlug: 'product-manager', title: '开发拆解', slug: 'development-breakdown', description: '把需求转化为研发可执行的任务拆解、模块分工与优先级。', sortOrder: 4 },
  { roleSlug: 'product-manager', title: '用户访谈整理', slug: 'user-interview-summary', description: '整理访谈纪要、提炼洞察、归纳用户问题与机会点。', sortOrder: 5 }
] as const;
