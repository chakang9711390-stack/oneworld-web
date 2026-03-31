import {
  CommonStatus,
  IndustryType,
  PrismaClient,
  SceneAutomationLevel,
  SceneFrequencyLevel,
  ScenePriorityLevel,
  SceneRiskLevel,
  SceneSourceType,
} from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required for prisma seed");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type SceneSeedItem = {
  sceneId: string;
  name: string;
  slug: string;
  industrySlug: string;
  roleSlug: string;
  workflowSlug: string;
  shortDescription: string;
  businessGoal?: string;
  painPoint?: string;
  inputMaterials?: string;
  outputResult?: string;
  triggerType: string;
  cadence: string;
  automationLevel: SceneAutomationLevel;
  riskLevel: SceneRiskLevel;
  frequencyLevel: SceneFrequencyLevel;
  reusableLevel: string;
  commercialValue: string;
  launchPriority: ScenePriorityLevel;
  directPurchase?: boolean;
  customizationRequired?: boolean;
  toolchainList?: string;
  authRequiredList?: string;
  humanConfirmationPoints?: string;
  exceptionRules?: string;
  sourceType?: SceneSourceType;
};

async function main() {
  await prisma.sceneVersion.deleteMany();
  await prisma.sceneRiskRule.deleteMany();
  await prisma.sceneAuthConfig.deleteMany();
  await prisma.sceneExecutionConfig.deleteMany();
  await prisma.sceneDefinition.deleteMany();
  await prisma.workflowTemplate.deleteMany();
  await prisma.workflowScene.deleteMany();
  await prisma.workflowRole.deleteMany();
  await prisma.opcProjectTemplate.deleteMany();
  await prisma.industry.deleteMany();
  await prisma.workspaceProject.deleteMany();
  await prisma.user.deleteMany();

  const industries = await Promise.all([
    prisma.industry.create({
      data: {
        name: "内容创业",
        slug: "content-creation",
        type: IndustryType.opc,
        description: "围绕内容、IP、社群、知识表达建立一人公司路径。",
        sortOrder: 1,
      },
    }),
    prisma.industry.create({
      data: {
        name: "咨询顾问",
        slug: "consulting",
        type: IndustryType.opc,
        description: "适合输出策略、方案、诊断与顾问式交付的业务模型。",
        sortOrder: 2,
      },
    }),
    prisma.industry.create({
      data: {
        name: "教育培训",
        slug: "education",
        type: IndustryType.both,
        description: "覆盖课程、训练营、教学服务与知识陪跑等方向。",
        sortOrder: 3,
        businessGoals: "课程交付、学员转化、复购续费",
        commonMetrics: "试听转化率、完课率、续费率",
      },
    }),
    prisma.industry.create({
      data: {
        name: "软件服务",
        slug: "software-service",
        type: IndustryType.both,
        description: "适合轻 SaaS、工具产品、自动化服务与技术型个体业务。",
        sortOrder: 4,
        businessGoals: "拉新、激活、留存、续费",
        commonMetrics: "激活率、留存率、续费率、MRR",
      },
    }),
    prisma.industry.create({
      data: {
        name: "互联网产品",
        slug: "internet-product",
        type: IndustryType.workflow,
        description: "覆盖产品规划、需求管理、项目推进与跨团队协作等工作场景。",
        sortOrder: 5,
        businessGoals: "需求交付、体验优化、版本推进",
        commonMetrics: "交付效率、需求吞吐、缺陷率",
      },
    }),
    prisma.industry.create({
      data: {
        name: "电商零售",
        slug: "ecommerce-retail",
        type: IndustryType.workflow,
        description: "覆盖店铺经营、商品运营、活动提报、数据监控与经营复盘。",
        sortOrder: 6,
        businessGoals: "商品经营增长、活动转化、库存健康",
        commonMetrics: "曝光、点击、加购、支付、退款、库存周转",
      },
    }),
    prisma.industry.create({
      data: {
        name: "短视频内容/新媒体",
        slug: "content-media",
        type: IndustryType.workflow,
        description: "覆盖选题、内容生产、发布、数据复盘与评论反馈整理。",
        sortOrder: 7,
        businessGoals: "内容增长、互动增长、账号运营效率提升",
        commonMetrics: "播放、点赞、评论、收藏、转发",
      },
    }),
    prisma.industry.create({
      data: {
        name: "招聘/人力资源服务",
        slug: "recruitment-hr",
        type: IndustryType.workflow,
        description: "覆盖招聘发布、简历初筛、邀约排期、反馈汇总与漏斗复盘。",
        sortOrder: 8,
        businessGoals: "提高招聘效率与到面/Offer 转化",
        commonMetrics: "投递量、筛选率、邀约率、到面率、Offer 率",
      },
    }),
  ]);

  const industryMap = Object.fromEntries(industries.map((item) => [item.slug, item]));

  const contentIndustry = industryMap["content-creation"];
  if (!contentIndustry) throw new Error("Missing content industry");

  await prisma.opcProjectTemplate.createMany({
    data: [
      {
        industryId: contentIndustry.id,
        title: "创建我的 OPC",
        slug: "create-my-opc",
        description: "从当前行业出发，创建属于我自己的 OPC 项目结构。",
        isCreateEntry: true,
        sortOrder: 1,
      },
      {
        industryId: contentIndustry.id,
        title: "知识 IP 变现型 OPC",
        slug: "knowledge-ip-opc",
        description: "通过内容输出、知识产品和私域承接形成持续变现闭环。",
        sortOrder: 2,
      },
      {
        industryId: contentIndustry.id,
        title: "高客单咨询成交型 OPC",
        slug: "high-ticket-consulting-opc",
        description: "围绕认知输出、咨询诊断与方案交付构建成交路径。",
        sortOrder: 3,
      },
    ],
  });

  const roles = await Promise.all([
    prisma.workflowRole.create({
      data: {
        industryId: industryMap["internet-product"].id,
        name: "产品经理",
        slug: "product-manager",
        description: "负责需求梳理、产品方案设计、项目协同与版本推进。",
        responsibility: "需求、方案、协同、推进",
        sortOrder: 1,
      },
    }),
    prisma.workflowRole.create({
      data: {
        industryId: industryMap["internet-product"].id,
        name: "UI设计师",
        slug: "ui-designer",
        description: "负责设计输入整理、页面方案设计、反馈收敛与交付。",
        responsibility: "设计输入、界面方案、反馈收敛、设计交付",
        sortOrder: 2,
      },
    }),
    prisma.workflowRole.create({
      data: {
        industryId: industryMap["software-service"].id,
        name: "软件工程师",
        slug: "software-engineer",
        description: "负责页面实现、低风险功能开发、工程协同和质量补全。",
        responsibility: "页面实现、功能开发、协同交付、质量补全",
        sortOrder: 1,
      },
    }),
    prisma.workflowRole.create({
      data: {
        industryId: industryMap["software-service"].id,
        name: "客户成功",
        slug: "customer-success",
        description: "负责客户问题响应、活跃维护、续费风险识别与客户汇报。",
        responsibility: "客户问题、活跃维护、续费推进",
        sortOrder: 2,
      },
    }),
    prisma.workflowRole.create({
      data: {
        industryId: industryMap["software-service"].id,
        name: "销售顾问/AE",
        slug: "sales-ae",
        description: "负责线索采集、客户推进、会议纪要与成交协同。",
        responsibility: "线索推进、客户跟进、方案协同",
        sortOrder: 3,
      },
    }),
    prisma.workflowRole.create({
      data: {
        industryId: industryMap["education"].id,
        name: "课程主理人",
        slug: "course-lead",
        description: "负责课程设计、教学交付、训练营内容组织与用户学习效果承接。",
        responsibility: "课程策划、教学交付、学习效果",
        sortOrder: 1,
      },
    }),
    prisma.workflowRole.create({
      data: {
        industryId: industryMap["education"].id,
        name: "教研运营",
        slug: "education-operations",
        description: "负责课程排期、学员运营、班级服务、转化和复购链路推进。",
        responsibility: "班级运营、学员服务、转化复购",
        sortOrder: 2,
      },
    }),
    prisma.workflowRole.create({
      data: {
        industryId: industryMap["ecommerce-retail"].id,
        name: "电商运营",
        slug: "ecommerce-operator",
        description: "负责活动提报、经营数据监控、差评反馈整理与复盘。",
        responsibility: "活动运营、经营监控、复盘优化",
        sortOrder: 1,
      },
    }),
    prisma.workflowRole.create({
      data: {
        industryId: industryMap["content-media"].id,
        name: "新媒体运营",
        slug: "content-operator",
        description: "负责热点搜集、内容发布、数据回收与评论反馈整理。",
        responsibility: "内容发布、数据复盘、评论反馈",
        sortOrder: 1,
      },
    }),
    prisma.workflowRole.create({
      data: {
        industryId: industryMap["recruitment-hr"].id,
        name: "招聘专员/招聘顾问",
        slug: "recruiter",
        description: "负责简历获取、初筛、邀约排期、反馈汇总与漏斗复盘。",
        responsibility: "招聘发布、筛选邀约、反馈复盘",
        sortOrder: 1,
      },
    }),
  ]);

  const roleMap = Object.fromEntries(roles.map((item) => [item.slug, item]));

  await prisma.workflowScene.createMany({
    data: [
      { roleId: roleMap["product-manager"].id, title: "生成我的工作流", slug: "generate-my-workflow", description: "根据当前行业与职位，生成适合我的专属工作流结构。", isGenerateEntry: true, sortOrder: 1 },
      { roleId: roleMap["product-manager"].id, title: "需求澄清", slug: "requirement-clarification", description: "用于整理需求背景、目标、约束条件与关键决策问题。", sortOrder: 2 },
      { roleId: roleMap["product-manager"].id, title: "PRD 生成", slug: "prd-generation", description: "基于已有输入快速生成结构化 PRD 初稿与核心模块内容。", sortOrder: 3 },
      { roleId: roleMap["product-manager"].id, title: "开发拆解", slug: "development-breakdown", description: "把需求转化为研发可执行的任务拆解、模块分工与优先级。", sortOrder: 4 },

      { roleId: roleMap["course-lead"].id, title: "生成我的工作流（课程主理人）", slug: "generate-course-lead-workflow", description: "根据课程型业务目标，生成课程主理人的完整工作流。", isGenerateEntry: true, sortOrder: 1 },
      { roleId: roleMap["course-lead"].id, title: "课程策划", slug: "course-planning", description: "梳理课程主题、学习目标、章节结构与交付方式。", sortOrder: 2 },
      { roleId: roleMap["course-lead"].id, title: "训练营交付", slug: "bootcamp-delivery", description: "组织训练营节奏、作业点评、答疑与学习追踪。", sortOrder: 3 },
      { roleId: roleMap["course-lead"].id, title: "课程复盘", slug: "course-retrospective", description: "复盘课程满意度、完课率、转化率与后续优化方向。", sortOrder: 4 },

      { roleId: roleMap["education-operations"].id, title: "生成我的工作流（教研运营）", slug: "generate-education-operations-workflow", description: "根据课程运营目标，生成教研运营专属工作流。", isGenerateEntry: true, sortOrder: 1 },
      { roleId: roleMap["education-operations"].id, title: "班级运营", slug: "cohort-operations", description: "管理学员通知、社群运营、学习跟踪与续费转化。", sortOrder: 2 },
      { roleId: roleMap["education-operations"].id, title: "开营准备", slug: "cohort-launch-prep", description: "完成开营资料、助教协同、直播排期和流程校验。", sortOrder: 3 },
      { roleId: roleMap["education-operations"].id, title: "复购转化", slug: "education-renewal-conversion", description: "围绕学习结果设计复购与高客单转化流程。", sortOrder: 4 },

      { roleId: roleMap["software-engineer"].id, title: "生成我的工作流（软件工程师）", slug: "generate-software-engineer-workflow", description: "生成适合软件工程师的标准场景与工作流结构。", isGenerateEntry: true, sortOrder: 1 },
      { roleId: roleMap["software-engineer"].id, title: "基础页面实现", slug: "foundation-page-delivery", description: "围绕页面骨架、列表页、表单页、详情页的标准实现。", sortOrder: 2 },
      { roleId: roleMap["software-engineer"].id, title: "低风险功能开发", slug: "low-risk-feature-development", description: "围绕基础 CRUD、状态补全、常规接口层代码等低风险场景。", sortOrder: 3 },
      { roleId: roleMap["software-engineer"].id, title: "工程协同辅助", slug: "engineering-collaboration-support", description: "围绕 issue 拆解、PR 描述、上线检查等协同型场景。", sortOrder: 4 },

      { roleId: roleMap["customer-success"].id, title: "生成我的工作流（客户成功）", slug: "generate-customer-success-workflow", description: "根据 SaaS 客户成功目标，生成专属工作流。", isGenerateEntry: true, sortOrder: 1 },
      { roleId: roleMap["customer-success"].id, title: "问题响应与跟进", slug: "customer-issue-response", description: "围绕客户问题分级、响应草稿、会议纪要和跟进处理。", sortOrder: 2 },
      { roleId: roleMap["customer-success"].id, title: "活跃与续费风险识别", slug: "customer-risk-detection", description: "识别低活跃客户和续费风险节点。", sortOrder: 3 },
      { roleId: roleMap["customer-success"].id, title: "客户汇报", slug: "customer-reporting", description: "围绕周报、月报、QBR 草稿生成。", sortOrder: 4 },

      { roleId: roleMap["sales-ae"].id, title: "生成我的工作流（销售顾问）", slug: "generate-sales-ae-workflow", description: "根据销售顾问工作目标，生成销售推进工作流。", isGenerateEntry: true, sortOrder: 1 },
      { roleId: roleMap["sales-ae"].id, title: "线索采集与录入", slug: "sales-lead-capture", description: "汇总表单、活动、私信等来源线索并录入 CRM。", sortOrder: 2 },
      { roleId: roleMap["sales-ae"].id, title: "客户分层与推进", slug: "sales-pipeline-advance", description: "围绕客户沟通纪要、跟进建议、沉默客户回访等推进销售。", sortOrder: 3 },
      { roleId: roleMap["sales-ae"].id, title: "方案协同与复盘", slug: "sales-proposal-and-review", description: "输出方案草稿、周报与复盘。", sortOrder: 4 },

      { roleId: roleMap["ui-designer"].id, title: "生成我的工作流（UI设计师）", slug: "generate-ui-designer-workflow", description: "生成适合 UI 设计师的首批标准场景工作流。", isGenerateEntry: true, sortOrder: 1 },
      { roleId: roleMap["ui-designer"].id, title: "设计输入整理", slug: "design-input-structuring", description: "从 PRD、群聊、会议纪要中提炼设计输入。", sortOrder: 2 },
      { roleId: roleMap["ui-designer"].id, title: "设计反馈收敛", slug: "design-feedback-consolidation", description: "收敛设计反馈并生成修改清单与评审纪要。", sortOrder: 3 },
      { roleId: roleMap["ui-designer"].id, title: "页面初稿辅助", slug: "design-first-draft-support", description: "补页面状态文案并基于设计系统生成初稿。", sortOrder: 4 },

      { roleId: roleMap["ecommerce-operator"].id, title: "生成我的工作流（电商运营）", slug: "generate-ecommerce-operator-workflow", description: "根据店铺经营目标生成电商运营工作流。", isGenerateEntry: true, sortOrder: 1 },
      { roleId: roleMap["ecommerce-operator"].id, title: "活动提报与经营监控", slug: "ecommerce-activity-monitoring", description: "围绕活动节点整理、经营数据抓取与异常识别。", sortOrder: 2 },
      { roleId: roleMap["ecommerce-operator"].id, title: "差评与用户反馈整理", slug: "ecommerce-feedback-consolidation", description: "汇总差评、客服问题并分类归因。", sortOrder: 3 },
      { roleId: roleMap["ecommerce-operator"].id, title: "经营复盘", slug: "ecommerce-business-review", description: "生成活动与经营复盘简报。", sortOrder: 4 },

      { roleId: roleMap["content-operator"].id, title: "生成我的工作流（新媒体运营）", slug: "generate-content-operator-workflow", description: "根据内容运营目标生成新媒体工作流。", isGenerateEntry: true, sortOrder: 1 },
      { roleId: roleMap["content-operator"].id, title: "选题与样本搜集", slug: "content-topic-research", description: "搜集热点和对标账号内容，沉淀选题池。", sortOrder: 2 },
      { roleId: roleMap["content-operator"].id, title: "多平台发布", slug: "content-multi-platform-publish", description: "自动跨平台发布内容并记录发布时间和链接。", sortOrder: 3 },
      { roleId: roleMap["content-operator"].id, title: "数据回收与复盘", slug: "content-performance-review", description: "抓取播放互动数据并输出内容周报。", sortOrder: 4 },

      { roleId: roleMap["recruiter"].id, title: "生成我的工作流（招聘专员）", slug: "generate-recruiter-workflow", description: "根据招聘目标生成招聘工作流。", isGenerateEntry: true, sortOrder: 1 },
      { roleId: roleMap["recruiter"].id, title: "简历获取与初筛", slug: "recruiter-resume-screening", description: "抓取简历、初筛排序、候选人点评。", sortOrder: 2 },
      { roleId: roleMap["recruiter"].id, title: "邀约排期与面试协同", slug: "recruiter-interview-coordination", description: "发送面试邀约、同步面试安排。", sortOrder: 3 },
      { roleId: roleMap["recruiter"].id, title: "反馈汇总与招聘复盘", slug: "recruiter-feedback-review", description: "汇总面试反馈并生成招聘日报/周报。", sortOrder: 4 },
    ],
  });

  const templates = await Promise.all([
    prisma.workflowTemplate.create({ data: { industryId: industryMap["ecommerce-retail"].id, roleId: roleMap["ecommerce-operator"].id, code: "wf_ecom_activity_monitoring", name: "活动提报与经营监控", slug: "wf-ecom-activity-monitoring", description: "围绕活动提报、经营数据与异常监控的标准工作流。", businessGoal: "提升经营监控效率与活动执行效率", cadence: "daily", sortOrder: 1 } }),
    prisma.workflowTemplate.create({ data: { industryId: industryMap["content-media"].id, roleId: roleMap["content-operator"].id, code: "wf_content_publish", name: "多平台发布", slug: "wf-content-publish", description: "围绕多平台内容发布与回收的标准工作流。", businessGoal: "提升发布效率与内容数据闭环效率", cadence: "daily", sortOrder: 1 } }),
    prisma.workflowTemplate.create({ data: { industryId: industryMap["recruitment-hr"].id, roleId: roleMap["recruiter"].id, code: "wf_recruit_resume", name: "简历获取与初筛", slug: "wf-recruit-resume", description: "围绕简历抓取、初筛、邀约排期的标准工作流。", businessGoal: "提升招聘效率与筛选转化效率", cadence: "daily", sortOrder: 1 } }),
    prisma.workflowTemplate.create({ data: { industryId: industryMap["software-service"].id, roleId: roleMap["customer-success"].id, code: "wf_cs_issue_response", name: "客户问题响应与跟进", slug: "wf-cs-issue-response", description: "围绕客户问题分级、会议纪要与风险识别的标准工作流。", businessGoal: "提升客户响应效率与续费留存能力", cadence: "daily", sortOrder: 1 } }),
    prisma.workflowTemplate.create({ data: { industryId: industryMap["software-service"].id, roleId: roleMap["sales-ae"].id, code: "wf_sales_lead_capture", name: "线索采集与录入", slug: "wf-sales-lead-capture", description: "围绕线索采集、客户推进与回访提醒的标准工作流。", businessGoal: "提升线索处理效率与销售推进效率", cadence: "realtime", sortOrder: 1 } }),
    prisma.workflowTemplate.create({ data: { industryId: industryMap["internet-product"].id, roleId: roleMap["ui-designer"].id, code: "wf_ui_design_input", name: "设计输入整理", slug: "wf-ui-design-input", description: "围绕设计输入整理、反馈收敛与页面初稿辅助的标准工作流。", businessGoal: "提升设计协同效率与初稿产出效率", cadence: "realtime", sortOrder: 1 } }),
    prisma.workflowTemplate.create({ data: { industryId: industryMap["software-service"].id, roleId: roleMap["software-engineer"].id, code: "wf_se_foundation_delivery", name: "基础页面实现", slug: "wf-se-foundation-delivery", description: "围绕页面骨架、CRUD、样式修复与工程协同的标准工作流。", businessGoal: "提升低风险开发交付效率", cadence: "ondemand", sortOrder: 1 } }),
  ]);

  const templateMap = Object.fromEntries(templates.map((item) => [item.code, item]));

  const scenes: SceneSeedItem[] = [
    {
      sceneId: "SCN-EC-001",
      name: "自动整理平台活动要求与节点",
      slug: "scene-auto-collect-activity-rules",
      industrySlug: "ecommerce-retail",
      roleSlug: "ecommerce-operator",
      workflowSlug: "wf-ecom-activity-monitoring",
      shortDescription: "抓取活动时间、门槛、素材要求并形成执行清单",
      businessGoal: "提升活动准备效率",
      painPoint: "活动规则分散、时间节点容易遗漏",
      inputMaterials: "平台活动页、店铺后台",
      outputResult: "活动执行清单",
      triggerType: "scheduled",
      cadence: "daily",
      automationLevel: SceneAutomationLevel.A1,
      riskLevel: SceneRiskLevel.R1,
      frequencyLevel: SceneFrequencyLevel.A,
      reusableLevel: "high",
      commercialValue: "high",
      launchPriority: ScenePriorityLevel.P0,
      toolchainList: "browser,docs,reminder",
      authRequiredList: "shop_backend_account",
      exceptionRules: "page_structure_error,login_invalid",
      sourceType: SceneSourceType.standard,
    },
    {
      sceneId: "SCN-EC-002",
      name: "自动抓店铺经营数据",
      slug: "scene-auto-fetch-store-metrics",
      industrySlug: "ecommerce-retail",
      roleSlug: "ecommerce-operator",
      workflowSlug: "wf-ecom-activity-monitoring",
      shortDescription: "定时抓取曝光、点击、加购、支付、退款、库存等数据",
      businessGoal: "建立经营监控底座",
      painPoint: "手工抄报表耗时且易漏",
      inputMaterials: "店铺后台报表",
      outputResult: "经营数据台账",
      triggerType: "scheduled",
      cadence: "daily",
      automationLevel: SceneAutomationLevel.A1,
      riskLevel: SceneRiskLevel.R1,
      frequencyLevel: SceneFrequencyLevel.S,
      reusableLevel: "high",
      commercialValue: "high",
      launchPriority: ScenePriorityLevel.P0,
      toolchainList: "browser,sheet,data_fetch",
      authRequiredList: "shop_data_permission",
      exceptionRules: "data_page_error,fetch_failed",
      sourceType: SceneSourceType.standard,
    },
    {
      sceneId: "SCN-CM-003",
      name: "自动跨平台发布内容",
      slug: "scene-auto-multi-platform-publish",
      industrySlug: "content-media",
      roleSlug: "content-operator",
      workflowSlug: "wf-content-publish",
      shortDescription: "将已确认内容发布到多个账号",
      businessGoal: "提升发布执行效率",
      painPoint: "多平台重复发布、容易漏记录",
      inputMaterials: "成片、文案、发布时间",
      outputResult: "发布结果",
      triggerType: "manual_or_scheduled",
      cadence: "daily",
      automationLevel: SceneAutomationLevel.A2,
      riskLevel: SceneRiskLevel.R2,
      frequencyLevel: SceneFrequencyLevel.S,
      reusableLevel: "high",
      commercialValue: "high",
      launchPriority: ScenePriorityLevel.P0,
      toolchainList: "browser,scheduler,publisher",
      authRequiredList: "platform_login_state",
      humanConfirmationPoints: "confirm_before_publish",
      exceptionRules: "login_invalid,upload_failed",
      sourceType: SceneSourceType.standard,
    },
    {
      sceneId: "SCN-HR-003",
      name: "自动抓取候选人简历",
      slug: "scene-auto-fetch-candidate-resumes",
      industrySlug: "recruitment-hr",
      roleSlug: "recruiter",
      workflowSlug: "wf-recruit-resume",
      shortDescription: "汇总多个招聘平台的投递简历",
      businessGoal: "提升招聘信息收集效率",
      painPoint: "简历来源分散、整理耗时",
      inputMaterials: "招聘平台简历列表",
      outputResult: "简历台账",
      triggerType: "scheduled",
      cadence: "daily",
      automationLevel: SceneAutomationLevel.A1,
      riskLevel: SceneRiskLevel.R1,
      frequencyLevel: SceneFrequencyLevel.S,
      reusableLevel: "high",
      commercialValue: "high",
      launchPriority: ScenePriorityLevel.P0,
      toolchainList: "browser,sheet,archive",
      authRequiredList: "recruit_platform_permission",
      exceptionRules: "platform_limited,login_invalid",
      sourceType: SceneSourceType.standard,
    },
    {
      sceneId: "SCN-HR-006",
      name: "自动发送面试邀约",
      slug: "scene-auto-send-interview-invite",
      industrySlug: "recruitment-hr",
      roleSlug: "recruiter",
      workflowSlug: "wf-recruit-resume",
      shortDescription: "给候选人发邀约信息并记录状态",
      businessGoal: "提升邀约执行效率",
      painPoint: "重复邀约沟通耗时、状态记录不统一",
      inputMaterials: "候选人信息、邀约模板",
      outputResult: "邀约发送记录",
      triggerType: "manual_or_event",
      cadence: "daily",
      automationLevel: SceneAutomationLevel.A2,
      riskLevel: SceneRiskLevel.R2,
      frequencyLevel: SceneFrequencyLevel.S,
      reusableLevel: "high",
      commercialValue: "high",
      launchPriority: ScenePriorityLevel.P0,
      toolchainList: "mail,im,browser",
      authRequiredList: "recruit_platform_permission,mail_or_im_permission",
      humanConfirmationPoints: "sample_confirm_before_send",
      exceptionRules: "send_failed,address_invalid",
      sourceType: SceneSourceType.standard,
    },
    {
      sceneId: "SCN-SAAS-CS-002",
      name: "自动整理客户问题并分级",
      slug: "scene-auto-classify-customer-issues",
      industrySlug: "software-service",
      roleSlug: "customer-success",
      workflowSlug: "wf_cs_issue_response",
      shortDescription: "汇总群聊、工单、邮件中的客户问题并按紧急度分类",
      businessGoal: "提升客户响应与问题分级效率",
      painPoint: "问题来源多、优先级判断混乱",
      inputMaterials: "群聊、工单、邮件",
      outputResult: "问题分级清单",
      triggerType: "scheduled",
      cadence: "daily",
      automationLevel: SceneAutomationLevel.A1,
      riskLevel: SceneRiskLevel.R1,
      frequencyLevel: SceneFrequencyLevel.S,
      reusableLevel: "high",
      commercialValue: "high",
      launchPriority: ScenePriorityLevel.P0,
      toolchainList: "fetch,classifier,ticket_or_sheet",
      authRequiredList: "chat_permission,ticket_permission,mail_permission",
      exceptionRules: "permission_invalid,fetch_failed",
      sourceType: SceneSourceType.standard,
    },
    {
      sceneId: "SCN-SAAS-SALES-001",
      name: "自动收集销售线索并录入",
      slug: "scene-auto-capture-sales-leads",
      industrySlug: "software-service",
      roleSlug: "sales-ae",
      workflowSlug: "wf-sales-lead-capture",
      shortDescription: "汇总表单、活动、私信等来源线索并录入 CRM/台账",
      businessGoal: "提升线索处理效率",
      painPoint: "线索来源多、录入重复劳动重",
      inputMaterials: "表单、活动名单、私信",
      outputResult: "线索台账/CRM记录",
      triggerType: "event",
      cadence: "realtime",
      automationLevel: SceneAutomationLevel.A1,
      riskLevel: SceneRiskLevel.R1,
      frequencyLevel: SceneFrequencyLevel.S,
      reusableLevel: "high",
      commercialValue: "high",
      launchPriority: ScenePriorityLevel.P0,
      toolchainList: "form,fetch,crm_write",
      authRequiredList: "crm_permission,channel_permission",
      exceptionRules: "field_mapping_failed",
      sourceType: SceneSourceType.standard,
    },
    {
      sceneId: "SCN-UI-001",
      name: "自动整理设计需求输入",
      slug: "scene-auto-structure-design-input",
      industrySlug: "internet-product",
      roleSlug: "ui-designer",
      workflowSlug: "wf-ui-design-input",
      shortDescription: "从 PRD、群聊、会议纪要中提炼设计输入",
      businessGoal: "提升设计输入准备效率",
      painPoint: "设计输入分散、理解成本高",
      inputMaterials: "PRD、会议纪要、聊天记录",
      outputResult: "结构化设计输入摘要",
      triggerType: "event",
      cadence: "realtime_or_ondemand",
      automationLevel: SceneAutomationLevel.A1,
      riskLevel: SceneRiskLevel.R1,
      frequencyLevel: SceneFrequencyLevel.S,
      reusableLevel: "high",
      commercialValue: "high",
      launchPriority: ScenePriorityLevel.P0,
      toolchainList: "docs,chat_summary,knowledge",
      authRequiredList: "docs_permission,meeting_note_permission",
      exceptionRules: "insufficient_input",
      sourceType: SceneSourceType.standard,
    },
    {
      sceneId: "SCN-SE-001",
      name: "自动生成页面骨架",
      slug: "scene-auto-generate-page-scaffold",
      industrySlug: "software-service",
      roleSlug: "software-engineer",
      workflowSlug: "wf-se-foundation-delivery",
      shortDescription: "快速生成页面基础结构和目录框架",
      businessGoal: "提升低风险页面开发效率",
      painPoint: "基础页面搭建重复且耗时",
      inputMaterials: "需求说明、项目上下文",
      outputResult: "页面骨架代码",
      triggerType: "manual",
      cadence: "ondemand",
      automationLevel: SceneAutomationLevel.A3,
      riskLevel: SceneRiskLevel.R1,
      frequencyLevel: SceneFrequencyLevel.S,
      reusableLevel: "high",
      commercialValue: "high",
      launchPriority: ScenePriorityLevel.P0,
      toolchainList: "code_model,editor,project_context",
      authRequiredList: "repo_permission,local_project_permission",
      humanConfirmationPoints: "confirm_before_commit",
      exceptionRules: "missing_project_context",
      sourceType: SceneSourceType.standard,
    },
    {
      sceneId: "SCN-SE-003",
      name: "自动搭建基础 CRUD 页面",
      slug: "scene-auto-build-crud-pages",
      industrySlug: "software-service",
      roleSlug: "software-engineer",
      workflowSlug: "wf-se-foundation-delivery",
      shortDescription: "根据数据结构快速生成增删改查页面",
      businessGoal: "提升典型后台页面交付效率",
      painPoint: "CRUD 页面开发重复劳动多",
      inputMaterials: "数据库结构、字段说明、页面需求",
      outputResult: "CRUD代码初版",
      triggerType: "manual",
      cadence: "ondemand",
      automationLevel: SceneAutomationLevel.A3,
      riskLevel: SceneRiskLevel.R1,
      frequencyLevel: SceneFrequencyLevel.S,
      reusableLevel: "high",
      commercialValue: "high",
      launchPriority: ScenePriorityLevel.P0,
      toolchainList: "code_model,component_lib,schema_doc",
      authRequiredList: "repo_permission,schema_doc_permission",
      humanConfirmationPoints: "confirm_before_commit",
      exceptionRules: "missing_schema_doc",
      sourceType: SceneSourceType.standard,
    },
    {
      sceneId: "SCN-SE-005",
      name: "自动生成 PR 描述和变更说明",
      slug: "scene-auto-generate-pr-description",
      industrySlug: "software-service",
      roleSlug: "software-engineer",
      workflowSlug: "wf-se-foundation-delivery",
      shortDescription: "根据 diff 和任务背景生成 PR 说明",
      businessGoal: "提升工程协同效率",
      painPoint: "PR 描述与变更说明重复劳动重",
      inputMaterials: "代码 diff、任务说明",
      outputResult: "PR 描述",
      triggerType: "event",
      cadence: "realtime",
      automationLevel: SceneAutomationLevel.A1,
      riskLevel: SceneRiskLevel.R1,
      frequencyLevel: SceneFrequencyLevel.S,
      reusableLevel: "high",
      commercialValue: "medium_high",
      launchPriority: ScenePriorityLevel.P0,
      toolchainList: "git_diff,doc_template",
      authRequiredList: "repo_permission",
      exceptionRules: "missing_diff",
      sourceType: SceneSourceType.standard,
    },
  ];

  for (const item of scenes) {
    const industry = industryMap[item.industrySlug];
    const role = roleMap[item.roleSlug];
    const workflowTemplate = Object.values(templateMap).find((template) => template.slug === item.workflowSlug || template.code === item.workflowSlug);

    if (!industry || !role || !workflowTemplate) {
      throw new Error(`Missing relation for scene ${item.sceneId} (industry=${item.industrySlug}, role=${item.roleSlug}, workflow=${item.workflowSlug})`);
    }

    const scene = await prisma.sceneDefinition.create({
      data: {
        sceneId: item.sceneId,
        name: item.name,
        slug: item.slug,
        shortDescription: item.shortDescription,
        businessGoal: item.businessGoal,
        painPoint: item.painPoint,
        inputMaterials: item.inputMaterials,
        outputResult: item.outputResult,
        triggerType: item.triggerType,
        cadence: item.cadence,
        automationLevel: item.automationLevel,
        riskLevel: item.riskLevel,
        frequencyLevel: item.frequencyLevel,
        reusableLevel: item.reusableLevel,
        commercialValue: item.commercialValue,
        launchPriority: item.launchPriority,
        status: CommonStatus.active,
        displayTitle: item.name,
        marketingSummary: item.shortDescription,
        directPurchase: item.directPurchase ?? false,
        customizationRequired: item.customizationRequired ?? false,
        industryId: industry.id,
        roleId: role.id,
        workflowTemplateId: workflowTemplate.id,
      },
    });

    await prisma.sceneExecutionConfig.create({
      data: {
        sceneDefinitionId: scene.id,
        toolchainList: item.toolchainList,
      },
    });

    await prisma.sceneAuthConfig.create({
      data: {
        sceneDefinitionId: scene.id,
        authRequiredList: item.authRequiredList,
      },
    });

    await prisma.sceneRiskRule.create({
      data: {
        sceneDefinitionId: scene.id,
        humanConfirmationPoints: item.humanConfirmationPoints,
        exceptionRules: item.exceptionRules,
        rollbackSupported: false,
        alertingRequired: true,
      },
    });

    await prisma.sceneVersion.create({
      data: {
        sceneDefinitionId: scene.id,
        version: "v1",
        sourceType: item.sourceType ?? SceneSourceType.standard,
        maturityLevel: "draft",
        validatedCustomersCount: 0,
      },
    });
  }

  const user = await prisma.user.create({
    data: {
      email: "akang@example.com",
      nickname: "阿康",
    },
  });

  await prisma.workspaceProject.createMany({
    data: [
      {
        userId: user.id,
        title: "一世界 V1 产品研发包",
        projectType: "platform",
        sourceType: "opc",
        summary: "当前主项目",
        status: "active",
      },
      {
        userId: user.id,
        title: "场景 AGENT 资产库",
        projectType: "workflow",
        sourceType: "workflow",
        summary: "首批标准场景沉淀",
        status: "active",
      },
      {
        userId: user.id,
        title: "待启动项目",
        projectType: "project",
        sourceType: "workspace",
        summary: "预留项目",
        status: "draft",
      },
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
