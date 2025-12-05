-- CreateTable
CREATE TABLE "Coupon" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" TEXT NOT NULL,
    "discountPercentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(6) NOT NULL,
    "endDate" TIMESTAMP(6) NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "couponCode" TEXT;
