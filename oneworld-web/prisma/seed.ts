import { PrismaClient, IndustryType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required for prisma seed");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.workflowScene.deleteMany();
  await prisma.workflowRole.deleteMany();
  await prisma.opcProjectTemplate.deleteMany();
  await prisma.industry.deleteMany();
  await prisma.workspaceProject.deleteMany();
  await prisma.user.deleteMany();

  const industries = await Promise.all([
    prisma.industry.create({ data: { name: "内容创业", slug: "content-creation", type: IndustryType.opc, description: "围绕内容、IP、社群、知识表达建立一人公司路径。", sortOrder: 1 } }),
    prisma.industry.create({ data: { name: "咨询顾问", slug: "consulting", type: IndustryType.opc, description: "适合输出策略、方案、诊断与顾问式交付的业务模型。", sortOrder: 2 } }),
    prisma.industry.create({ data: { name: "教育培训", slug: "education", type: IndustryType.both, description: "覆盖课程、训练营、教学服务与知识陪跑等方向。", sortOrder: 3 } }),
    prisma.industry.create({ data: { name: "软件服务", slug: "software-service", type: IndustryType.both, description: "适合轻 SaaS、工具产品、自动化服务与技术型个体业务。", sortOrder: 4 } }),
    prisma.industry.create({ data: { name: "互联网产品", slug: "internet-product", type: IndustryType.workflow, description: "覆盖产品规划、需求管理、项目推进与跨团队协作等工作场景。", sortOrder: 5 } }),
  ]);

  const contentIndustry = industries.find((item) => item.slug === "content-creation");
  const productIndustry = industries.find((item) => item.slug === "internet-product");

  if (!contentIndustry || !productIndustry) {
    throw new Error("Seed industries missing");
  }

  await prisma.opcProjectTemplate.createMany({
    data: [
      { industryId: contentIndustry.id, title: "创建我的 OPC", slug: "create-my-opc", description: "从当前行业出发，创建属于我自己的 OPC 项目结构。", isCreateEntry: true, sortOrder: 1 },
      { industryId: contentIndustry.id, title: "知识 IP 变现型 OPC", slug: "knowledge-ip-opc", description: "通过内容输出、知识产品和私域承接形成持续变现闭环。", sortOrder: 2 },
      { industryId: contentIndustry.id, title: "高客单咨询成交型 OPC", slug: "high-ticket-consulting-opc", description: "围绕认知输出、咨询诊断与方案交付构建成交路径。", sortOrder: 3 },
    ],
  });

  const educationIndustry = industries.find((item) => item.slug === "education");
  const softwareIndustry = industries.find((item) => item.slug === "software-service");

  if (!educationIndustry || !softwareIndustry) {
    throw new Error("Seed workflow industries missing");
  }

  const roles = await Promise.all([
    prisma.workflowRole.create({ data: { industryId: productIndustry.id, name: "产品经理", slug: "product-manager", description: "负责需求梳理、产品方案设计、项目协同与版本推进。", sortOrder: 1 } }),
    prisma.workflowRole.create({ data: { industryId: productIndustry.id, name: "产品运营", slug: "product-operations", description: "负责活动推进、数据跟踪、用户触达与运营策略落地。", sortOrder: 2 } }),
    prisma.workflowRole.create({ data: { industryId: productIndustry.id, name: "用户研究", slug: "user-research", description: "负责用户访谈、反馈整理、洞察分析与需求提炼。", sortOrder: 3 } }),
    prisma.workflowRole.create({ data: { industryId: educationIndustry.id, name: "课程主理人", slug: "course-lead", description: "负责课程设计、教学交付、训练营内容组织与用户学习效果承接。", sortOrder: 1 } }),
    prisma.workflowRole.create({ data: { industryId: educationIndustry.id, name: "教研运营", slug: "education-operations", description: "负责课程排期、学员运营、班级服务、转化和复购链路推进。", sortOrder: 2 } }),
    prisma.workflowRole.create({ data: { industryId: softwareIndustry.id, name: "独立开发者", slug: "indie-developer", description: "负责产品设计、开发迭代、发布上线与用户反馈闭环。", sortOrder: 1 } }),
    prisma.workflowRole.create({ data: { industryId: softwareIndustry.id, name: "SaaS 运营", slug: "saas-operator", description: "负责增长试验、用户转化、续费运营与产品数据监控。", sortOrder: 2 } }),
  ]);

  const roleMap = Object.fromEntries(roles.map((item) => [item.slug, item]));
  const productManagerRole = roleMap["product-manager"];
  const courseLeadRole = roleMap["course-lead"];
  const educationOperationsRole = roleMap["education-operations"];
  const indieDeveloperRole = roleMap["indie-developer"];
  const saasOperatorRole = roleMap["saas-operator"];

  if (!productManagerRole || !courseLeadRole || !educationOperationsRole || !indieDeveloperRole || !saasOperatorRole) {
    throw new Error("Seed role missing");
  }

  await prisma.workflowScene.createMany({
    data: [
      { roleId: productManagerRole.id, title: "生成我的工作流", slug: "generate-my-workflow", description: "根据当前行业与职位，生成适合我的专属工作流结构。", isGenerateEntry: true, sortOrder: 1 },
      { roleId: productManagerRole.id, title: "需求澄清", slug: "requirement-clarification", description: "用于整理需求背景、目标、约束条件与关键决策问题。", sortOrder: 2 },
      { roleId: productManagerRole.id, title: "PRD 生成", slug: "prd-generation", description: "基于已有输入快速生成结构化 PRD 初稿与核心模块内容。", sortOrder: 3 },
      { roleId: productManagerRole.id, title: "开发拆解", slug: "development-breakdown", description: "把需求转化为研发可执行的任务拆解、模块分工与优先级。", sortOrder: 4 },

      { roleId: courseLeadRole.id, title: "生成我的工作流（课程主理人）", slug: "generate-course-lead-workflow", description: "根据课程型业务目标，生成课程主理人的完整工作流。", isGenerateEntry: true, sortOrder: 1 },
      { roleId: courseLeadRole.id, title: "课程策划", slug: "course-planning", description: "梳理课程主题、学习目标、章节结构与交付方式。", sortOrder: 2 },
      { roleId: courseLeadRole.id, title: "训练营交付", slug: "bootcamp-delivery", description: "组织训练营节奏、作业点评、答疑与学习追踪。", sortOrder: 3 },
      { roleId: courseLeadRole.id, title: "课程复盘", slug: "course-retrospective", description: "复盘课程满意度、完课率、转化率与后续优化方向。", sortOrder: 4 },

      { roleId: educationOperationsRole.id, title: "生成我的工作流（教研运营）", slug: "generate-education-operations-workflow", description: "根据课程运营目标，生成教研运营专属工作流。", isGenerateEntry: true, sortOrder: 1 },
      { roleId: educationOperationsRole.id, title: "班级运营", slug: "cohort-operations", description: "管理学员通知、社群运营、学习跟踪与续费转化。", sortOrder: 2 },
      { roleId: educationOperationsRole.id, title: "开营准备", slug: "cohort-launch-prep", description: "完成开营资料、助教协同、直播排期和流程校验。", sortOrder: 3 },
      { roleId: educationOperationsRole.id, title: "复购转化", slug: "education-renewal-conversion", description: "围绕学习结果设计复购与高客单转化流程。", sortOrder: 4 },

      { roleId: indieDeveloperRole.id, title: "生成我的工作流（独立开发者）", slug: "generate-indie-developer-workflow", description: "生成适合独立开发者的产品研发与上线工作流。", isGenerateEntry: true, sortOrder: 1 },
      { roleId: indieDeveloperRole.id, title: "需求设计", slug: "indie-product-design", description: "围绕用户问题定义功能方案、交互路径与优先级。", sortOrder: 2 },
      { roleId: indieDeveloperRole.id, title: "版本发布", slug: "indie-release-management", description: "管理版本开发、测试、发布和线上验证闭环。", sortOrder: 3 },
      { roleId: indieDeveloperRole.id, title: "用户反馈处理", slug: "indie-feedback-loop", description: "收集反馈、判断优先级并推动问题迭代修复。", sortOrder: 4 },

      { roleId: saasOperatorRole.id, title: "生成我的工作流（SaaS 运营）", slug: "generate-saas-operator-workflow", description: "根据 SaaS 增长目标，生成运营专属工作流。", isGenerateEntry: true, sortOrder: 1 },
      { roleId: saasOperatorRole.id, title: "增长试验", slug: "saas-growth-experiment", description: "设计并推进拉新、激活、留存和转化试验。", sortOrder: 2 },
      { roleId: saasOperatorRole.id, title: "续费运营", slug: "saas-renewal-ops", description: "围绕订阅用户进行续费、挽回和生命周期运营。", sortOrder: 3 },
      { roleId: saasOperatorRole.id, title: "数据复盘", slug: "saas-metrics-review", description: "跟踪关键指标并输出运营复盘与优化动作。", sortOrder: 4 },
    ],
  });

  const user = await prisma.user.create({
    data: {
      email: "akang@example.com",
      nickname: "阿康",
    },
  });

  await prisma.workspaceProject.createMany({
    data: [
      { userId: user.id, title: "一世界 V1 产品研发包", projectType: "platform", sourceType: "opc", summary: "当前主项目", status: "active" },
      { userId: user.id, title: "产品经理工作流", projectType: "workflow", sourceType: "workflow", summary: "工作流沉淀", status: "active" },
      { userId: user.id, title: "待启动项目", projectType: "project", sourceType: "workspace", summary: "预留项目", status: "draft" },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
