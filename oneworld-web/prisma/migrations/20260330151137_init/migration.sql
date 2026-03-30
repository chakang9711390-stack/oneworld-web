-- CreateEnum
CREATE TYPE "IndustryType" AS ENUM ('opc', 'workflow', 'both');

-- CreateEnum
CREATE TYPE "CommonStatus" AS ENUM ('active', 'disabled', 'archived');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('email', 'google', 'apple');

-- CreateEnum
CREATE TYPE "WorkspaceProjectStatus" AS ENUM ('active', 'paused', 'draft', 'archived');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "nickname" TEXT,
    "avatarUrl" TEXT,
    "authProvider" "AuthProvider" NOT NULL DEFAULT 'email',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Industry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "IndustryType" NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "CommonStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Industry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpcProjectTemplate" (
    "id" TEXT NOT NULL,
    "industryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isCreateEntry" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "CommonStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpcProjectTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowRole" (
    "id" TEXT NOT NULL,
    "industryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "CommonStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowScene" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isGenerateEntry" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "CommonStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowScene_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceProject" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "projectType" TEXT,
    "sourceType" TEXT,
    "summary" TEXT,
    "status" "WorkspaceProjectStatus" NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkspaceProject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Industry_slug_key" ON "Industry"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "OpcProjectTemplate_slug_key" ON "OpcProjectTemplate"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowRole_slug_key" ON "WorkflowRole"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowScene_slug_key" ON "WorkflowScene"("slug");

-- AddForeignKey
ALTER TABLE "OpcProjectTemplate" ADD CONSTRAINT "OpcProjectTemplate_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowRole" ADD CONSTRAINT "WorkflowRole_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowScene" ADD CONSTRAINT "WorkflowScene_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "WorkflowRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceProject" ADD CONSTRAINT "WorkspaceProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
