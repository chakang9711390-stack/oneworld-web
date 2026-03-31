-- CreateEnum
CREATE TYPE "SceneAutomationLevel" AS ENUM ('A1', 'A2', 'A3');

-- CreateEnum
CREATE TYPE "SceneRiskLevel" AS ENUM ('R1', 'R2', 'R3');

-- CreateEnum
CREATE TYPE "SceneFrequencyLevel" AS ENUM ('S', 'A', 'B');

-- CreateEnum
CREATE TYPE "ScenePriorityLevel" AS ENUM ('P0', 'P1', 'P2');

-- CreateEnum
CREATE TYPE "SceneSourceType" AS ENUM ('standard', 'custom');

-- AlterTable
ALTER TABLE "Industry" ADD COLUMN     "businessGoals" TEXT,
ADD COLUMN     "commonMetrics" TEXT,
ADD COLUMN     "commonOrgStructure" TEXT,
ADD COLUMN     "commonTools" TEXT,
ADD COLUMN     "complianceNotes" TEXT,
ADD COLUMN     "glossary" TEXT,
ADD COLUMN     "maturityLevel" TEXT,
ADD COLUMN     "riskNotes" TEXT;

-- AlterTable
ALTER TABLE "WorkflowRole" ADD COLUMN     "responsibility" TEXT;

-- CreateTable
CREATE TABLE "WorkflowTemplate" (
    "id" TEXT NOT NULL,
    "industryId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "businessGoal" TEXT,
    "cadence" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "CommonStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SceneDefinition" (
    "id" TEXT NOT NULL,
    "sceneId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT,
    "detailedDescription" TEXT,
    "businessGoal" TEXT,
    "painPoint" TEXT,
    "inputMaterials" TEXT,
    "outputResult" TEXT,
    "triggerType" TEXT,
    "cadence" TEXT,
    "automationLevel" "SceneAutomationLevel",
    "riskLevel" "SceneRiskLevel",
    "frequencyLevel" "SceneFrequencyLevel",
    "reusableLevel" TEXT,
    "commercialValue" TEXT,
    "launchPriority" "ScenePriorityLevel",
    "status" "CommonStatus" NOT NULL DEFAULT 'active',
    "displayTitle" TEXT,
    "displaySubtitle" TEXT,
    "marketingSummary" TEXT,
    "directPurchase" BOOLEAN NOT NULL DEFAULT false,
    "customizationRequired" BOOLEAN NOT NULL DEFAULT false,
    "industryId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "workflowTemplateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SceneDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SceneExecutionConfig" (
    "id" TEXT NOT NULL,
    "sceneDefinitionId" TEXT NOT NULL,
    "toolchainList" TEXT,
    "dependencyServices" TEXT,
    "environmentRequirements" TEXT,
    "modelRequirements" TEXT,
    "preloadedKnowledge" TEXT,
    "executionStepsSummary" TEXT,
    "promptStrategyRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SceneExecutionConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SceneAuthConfig" (
    "id" TEXT NOT NULL,
    "sceneDefinitionId" TEXT NOT NULL,
    "authRequiredList" TEXT,
    "accountTypesRequired" TEXT,
    "loginStateRequired" TEXT,
    "fileAccessRequired" TEXT,
    "externalPlatformAccessRequired" TEXT,
    "minimalPermissionScope" TEXT,
    "sensitivePermissions" TEXT,
    "authorizationNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SceneAuthConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SceneRiskRule" (
    "id" TEXT NOT NULL,
    "sceneDefinitionId" TEXT NOT NULL,
    "humanConfirmationPoints" TEXT,
    "forbiddenActions" TEXT,
    "exceptionRules" TEXT,
    "rollbackSupported" BOOLEAN NOT NULL DEFAULT false,
    "rollbackNotes" TEXT,
    "alertingRequired" BOOLEAN NOT NULL DEFAULT false,
    "alertingChannels" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SceneRiskRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SceneVersion" (
    "id" TEXT NOT NULL,
    "sceneDefinitionId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "sourceType" "SceneSourceType",
    "maturityLevel" TEXT,
    "validatedCustomersCount" INTEGER NOT NULL DEFAULT 0,
    "owner" TEXT,
    "releaseNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SceneVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowTemplate_code_key" ON "WorkflowTemplate"("code");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowTemplate_slug_key" ON "WorkflowTemplate"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SceneDefinition_sceneId_key" ON "SceneDefinition"("sceneId");

-- CreateIndex
CREATE UNIQUE INDEX "SceneDefinition_slug_key" ON "SceneDefinition"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SceneExecutionConfig_sceneDefinitionId_key" ON "SceneExecutionConfig"("sceneDefinitionId");

-- CreateIndex
CREATE UNIQUE INDEX "SceneAuthConfig_sceneDefinitionId_key" ON "SceneAuthConfig"("sceneDefinitionId");

-- CreateIndex
CREATE UNIQUE INDEX "SceneRiskRule_sceneDefinitionId_key" ON "SceneRiskRule"("sceneDefinitionId");

-- CreateIndex
CREATE UNIQUE INDEX "SceneVersion_sceneDefinitionId_version_key" ON "SceneVersion"("sceneDefinitionId", "version");

-- AddForeignKey
ALTER TABLE "WorkflowTemplate" ADD CONSTRAINT "WorkflowTemplate_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowTemplate" ADD CONSTRAINT "WorkflowTemplate_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "WorkflowRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SceneDefinition" ADD CONSTRAINT "SceneDefinition_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SceneDefinition" ADD CONSTRAINT "SceneDefinition_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "WorkflowRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SceneDefinition" ADD CONSTRAINT "SceneDefinition_workflowTemplateId_fkey" FOREIGN KEY ("workflowTemplateId") REFERENCES "WorkflowTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SceneExecutionConfig" ADD CONSTRAINT "SceneExecutionConfig_sceneDefinitionId_fkey" FOREIGN KEY ("sceneDefinitionId") REFERENCES "SceneDefinition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SceneAuthConfig" ADD CONSTRAINT "SceneAuthConfig_sceneDefinitionId_fkey" FOREIGN KEY ("sceneDefinitionId") REFERENCES "SceneDefinition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SceneRiskRule" ADD CONSTRAINT "SceneRiskRule_sceneDefinitionId_fkey" FOREIGN KEY ("sceneDefinitionId") REFERENCES "SceneDefinition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SceneVersion" ADD CONSTRAINT "SceneVersion_sceneDefinitionId_fkey" FOREIGN KEY ("sceneDefinitionId") REFERENCES "SceneDefinition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
