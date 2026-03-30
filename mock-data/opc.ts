export const opcIndustries = [
  { name: '内容创业', slug: 'content-creation', description: '围绕内容、IP、社群、知识表达建立一人公司路径。', projectCount: 12 },
  { name: '咨询顾问', slug: 'consulting', description: '适合输出策略、方案、诊断与顾问式交付的业务模型。', projectCount: 8 },
  { name: '教育培训', slug: 'education', description: '覆盖课程、训练营、教学服务与知识陪跑等方向。', projectCount: 10 },
  { name: '软件服务', slug: 'software-service', description: '适合轻 SaaS、工具产品、自动化服务与技术型个体业务。', projectCount: 6 },
  { name: '电商与零售', slug: 'ecommerce', description: '围绕选品、渠道、内容转化与私域经营搭建变现模型。', projectCount: 9 },
  { name: '本地与专业服务', slug: 'local-service', description: '面向本地经营、专业服务、小团队外包与轻服务交付场景。', projectCount: 7 }
] as const;

export const opcProjects = [
  { title: '创建我的 OPC', slug: 'create-my-opc', description: '从当前行业出发，创建属于我自己的 OPC 项目结构。', isCreateEntry: true },
  { title: '知识 IP 变现型 OPC', slug: 'knowledge-ip-opc', description: '通过内容输出、知识产品和私域承接形成持续变现闭环。' },
  { title: '高客单咨询成交型 OPC', slug: 'high-ticket-consulting-opc', description: '围绕认知输出、咨询诊断与方案交付构建成交路径。' },
  { title: '训练营转化型 OPC', slug: 'bootcamp-conversion-opc', description: '通过训练营产品、服务承接与复购链路放大收益模型。' }
] as const;
