-- CreateEnum
CREATE TYPE "public"."ClassMode" AS ENUM ('ONLINE', 'PHYSICAL', 'HYBRID');

-- CreateEnum
CREATE TYPE "public"."CohortStatus" AS ENUM ('OPEN', 'UPCOMING', 'FULL', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."BookingStatus" AS ENUM ('NEW', 'CONFIRMED', 'WAITLIST', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."Cohort" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "mode" "public"."ClassMode" NOT NULL DEFAULT 'PHYSICAL',
    "startText" TEXT NOT NULL,
    "scheduleText" TEXT NOT NULL,
    "location" TEXT,
    "ageRange" TEXT,
    "priceKes" TEXT,
    "capacity" INTEGER,
    "summary" TEXT NOT NULL,
    "status" "public"."CohortStatus" NOT NULL DEFAULT 'OPEN',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cohort_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CohortBooking" (
    "id" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "learnerName" TEXT,
    "learnerAge" TEXT,
    "notes" TEXT,
    "status" "public"."BookingStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CohortBooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Cohort_published_status_order_idx" ON "public"."Cohort"("published", "status", "order");

-- CreateIndex
CREATE INDEX "CohortBooking_cohortId_status_idx" ON "public"."CohortBooking"("cohortId", "status");

-- CreateIndex
CREATE INDEX "CohortBooking_createdAt_idx" ON "public"."CohortBooking"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."CohortBooking" ADD CONSTRAINT "CohortBooking_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "public"."Cohort"("id") ON DELETE CASCADE ON UPDATE CASCADE;
