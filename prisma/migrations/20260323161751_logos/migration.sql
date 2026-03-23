-- CreateTable
CREATE TABLE "Logo" (
    "id" UUID NOT NULL,
    "companyId" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "downloadUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Logo_pkey" PRIMARY KEY ("id")
);
