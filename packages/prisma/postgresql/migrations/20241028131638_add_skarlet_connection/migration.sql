-- CreateTable
CREATE TABLE "SkarletConnection" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url_backend" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "SkarletConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SkarletConnection_workspaceId_idx" ON "SkarletConnection"("workspaceId");

-- AddForeignKey
ALTER TABLE "SkarletConnection" ADD CONSTRAINT "SkarletConnection_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
