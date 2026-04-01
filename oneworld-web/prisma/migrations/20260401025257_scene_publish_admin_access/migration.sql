-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "WorkflowScene" ADD COLUMN     "sceneDefinitionId" TEXT,
ADD COLUMN     "sourceType" TEXT DEFAULT 'seed';

-- CreateIndex
CREATE INDEX "WorkflowScene_sceneDefinitionId_idx" ON "WorkflowScene"("sceneDefinitionId");

-- AddForeignKey
ALTER TABLE "WorkflowScene" ADD CONSTRAINT "WorkflowScene_sceneDefinitionId_fkey" FOREIGN KEY ("sceneDefinitionId") REFERENCES "SceneDefinition"("id") ON DELETE SET NULL ON UPDATE CASCADE;
