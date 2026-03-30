# 一世界｜V1 后端数据表设计 Prisma 草案 v1

## 1. 目标

本文件用于为《一世界》V1 提供可直接进入后端建模阶段的数据表设计草案，并给出 Prisma schema 方向。

---

## 2. 表结构设计

### 2.1 users
用于存储用户信息。

建议字段：
- id
- email
- passwordHash
- nickname
- avatarUrl
- authProvider
- createdAt
- updatedAt

### 2.2 industries
用于存储行业分类。

建议字段：
- id
- name
- slug
- type
- description
- sortOrder
- status
- createdAt
- updatedAt

### 2.3 opc_project_templates
用于存储 OPC 项目模板卡片。

建议字段：
- id
- industryId
- title
- slug
- description
- isCreateEntry
- sortOrder
- status
- createdAt
- updatedAt

### 2.4 workflow_roles
用于存储工作流职位卡片。

建议字段：
- id
- industryId
- name
- slug
- description
- sortOrder
- status
- createdAt
- updatedAt

### 2.5 workflow_scenes
用于存储工作流场景卡片。

建议字段：
- id
- roleId
- title
- slug
- description
- isGenerateEntry
- sortOrder
- status
- createdAt
- updatedAt

### 2.6 workspace_projects
用于存储用户工作台中的项目资产。

建议字段：
- id
- userId
- title
- projectType
- sourceType
- summary
- status
- createdAt
- updatedAt

---

## 3. Prisma Schema 草案

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum IndustryType {
  opc
  workflow
  both
}

enum CommonStatus {
  active
  disabled
  archived
}

enum AuthProvider {
  email
  google
  apple
}

enum WorkspaceProjectStatus {
  active
  paused
  draft
  archived
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String?
  nickname     String?
  avatarUrl    String?
  authProvider AuthProvider @default(email)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  workspaceProjects WorkspaceProject[]
}

model Industry {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  type        IndustryType
  description String?
  sortOrder   Int      @default(0)
  status      CommonStatus @default(active)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  opcProjectTemplates OpcProjectTemplate[]
  workflowRoles       WorkflowRole[]
}

model OpcProjectTemplate {
  id            String   @id @default(cuid())
  industryId    String
  title         String
  slug          String   @unique
  description   String?
  isCreateEntry Boolean  @default(false)
  sortOrder     Int      @default(0)
  status        CommonStatus @default(active)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  industry Industry @relation(fields: [industryId], references: [id], onDelete: Cascade)
}

model WorkflowRole {
  id          String   @id @default(cuid())
  industryId  String
  name        String
  slug        String   @unique
  description String?
  sortOrder   Int      @default(0)
  status      CommonStatus @default(active)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  industry Industry @relation(fields: [industryId], references: [id], onDelete: Cascade)
  workflowScenes WorkflowScene[]
}

model WorkflowScene {
  id              String   @id @default(cuid())
  roleId          String
  title           String
  slug            String   @unique
  description     String?
  isGenerateEntry Boolean  @default(false)
  sortOrder       Int      @default(0)
  status          CommonStatus @default(active)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  role WorkflowRole @relation(fields: [roleId], references: [id], onDelete: Cascade)
}

model WorkspaceProject {
  id         String   @id @default(cuid())
  userId     String
  title      String
  projectType String?
  sourceType String?
  summary    String?
  status     WorkspaceProjectStatus @default(draft)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## 4. 建模原则

1. V1 先做轻量建模，不提前引入复杂配置表
2. 行业、职位、场景都保留 slug，便于前端路由使用
3. 状态字段统一，便于管理展示态与禁用态
4. 工作台项目先轻量承接，后续再扩成完整资产模型

---

## 5. 最终结论

这份 Prisma 草案已经足够作为 V1 首轮后端建模起点，后端可以直接据此开始建表与 migration。
