# oneworld-web

一世界 V1 前端 / 轻后端一体化骨架项目。

## 启动

```bash
npm install
npm run dev
```

## 质量检查

```bash
npm run lint
npm run build
```

## Prisma（当前为起步草案）

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

> 当前已内置 `prisma/schema.prisma` 与 `prisma/seed.ts` 起步稿，后续可继续接 PostgreSQL 实库。

## 当前 API 路由草案

- `GET /api/opc/industries`
- `GET /api/opc/industries/:industrySlug/projects`
- `GET /api/workflow/industries`
- `GET /api/workflow/industries/:industrySlug/roles`
- `GET /api/workflow/roles/:roleSlug/scenes`
- `GET /api/workspace/overview`
- `GET /api/auth/me`

## 环境变量

复制 `.env.example` 为 `.env.local` 后填写：

```bash
cp .env.example .env.local
```
