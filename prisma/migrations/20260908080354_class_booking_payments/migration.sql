-- AlterEnum
ALTER TYPE "public"."BookingStatus" ADD VALUE IF NOT EXISTS 'AWAITING_PAYMENT';
ALTER TYPE "public"."BookingStatus" ADD VALUE IF NOT EXISTS 'PENDING_CONFIRMATION';
ALTER TYPE "public"."BookingStatus" ADD VALUE IF NOT EXISTS 'REJECTED';

-- AlterTable
ALTER TABLE "public"."Cohort" ADD COLUMN "priceAmountKes" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."CohortBooking"
    ADD COLUMN "publicRef" TEXT,
    ADD COLUMN "mpesaCode" TEXT,
    ADD COLUMN "amountClaimedKes" INTEGER,
    ADD COLUMN "paymentClaimedAt" TIMESTAMP(3),
    ADD COLUMN "confirmedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "CohortBooking_publicRef_key" ON "public"."CohortBooking"("publicRef");
