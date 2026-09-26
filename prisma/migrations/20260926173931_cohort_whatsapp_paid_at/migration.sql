-- AlterTable
ALTER TABLE "public"."Cohort" ADD COLUMN "whatsappGroupUrl" TEXT;

-- AlterTable
ALTER TABLE "public"."CohortBooking" ADD COLUMN "paidAt" TIMESTAMP(3);
