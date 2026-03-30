export const homeEntryCards = [
  { title: "OPC 方案库", href: "/opc", description: "进入行业库与 OPC 项目卡片库。" },
  { title: "工作流库", href: "/workflow", description: "进入行业、职位与工作场景库。" },
  { title: "我的工作台", href: "/workspace", description: "查看项目、OPC 与工作流状态。" },
] as const;

export const opcIndustries = [
  { name: "内容创业", slug: "content-creation", description: "围绕内容、IP、社群、知识表达建立一人公司路径。", count: 12 },
  { name: "咨询顾问", slug: "consulting", description: "适合输出策略、方案、诊断与顾问式交付的业务模型。", count: 8 },
  { name: "教育培训", slug: "education", description: "覆盖课程、训练营、教学服务与知识陪跑等方向。", count: 10 },
  { name: "软件服务", slug: "software-service", description: "适合轻 SaaS、工具产品、自动化服务与技术型个体业务。", count: 6 },
] as const;

export const opcProjects = [
  { title: "创建我的 OPC", description: "从当前行业出发，创建属于我自己的 OPC 项目结构。", status: "创建入口" },
  { title: "知识 IP 变现型 OPC", description: "通过内容输出、知识产品和私域承接形成持续变现闭环。", status: "案例卡片" },
  { title: "高客单咨询成交型 OPC", description: "围绕认知输出、咨询诊断与方案交付构建成交路径。", status: "案例卡片" },
  { title: "训练营转化型 OPC", description: "通过训练营产品、服务承接与复购链路放大收益模型。", status: "案例卡片" },
] as const;

export const workflowIndustries = [
  { name: "互联网产品", slug: "internet-product", description: "覆盖产品规划、需求管理、项目推进与跨团队协作等工作场景。", count: 6 },
  { name: "内容与运营", slug: "content-ops", description: "围绕选题、内容生产、活动运营、增长转化与用户维护展开。", count: 5 },
  { name: "咨询与服务", slug: "consulting-service", description: "适用于方案咨询、客户服务、交付推进与顾问型业务协同。", count: 4 },
] as const;

export const workflowRoles = [
  { name: "产品经理", slug: "product-manager", description: "负责需求梳理、产品方案设计、项目协同与版本推进。", count: 8 },
  { name: "产品运营", slug: "product-operations", description: "负责活动推进、数据跟踪、用户触达与运营策略落地。", count: 7 },
  { name: "用户研究", slug: "user-research", description: "负责用户访谈、反馈整理、洞察分析与需求提炼。", count: 6 },
] as const;

export const workflowScenes = [
  { title: "生成我的工作流", description: "根据当前行业与职位，生成适合我的专属工作流结构。", status: "生成入口" },
  { title: "需求澄清", description: "用于整理需求背景、目标、约束条件与关键决策问题。", status: "场景卡片" },
  { title: "PRD 生成", description: "基于已有输入快速生成结构化 PRD 初稿与核心模块内容。", status: "场景卡片" },
  { title: "开发拆解", description: "把需求转化为研发可执行的任务拆解、模块分工与优先级。", status: "场景卡片" },
] as const;

export const workspaceOverview = [
  { label: "当前 OPC 运行状态", value: "02", summary: "1 个在推进，1 个待补内容" },
  { label: "当前工作流运行状态", value: "05", summary: "最近 7 天被调用 5 次" },
  { label: "项目数量", value: "03", summary: "2 个进行中，1 个待启动" },
] as const;
