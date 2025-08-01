-- CreateEnum
CREATE TYPE "CART_EVENT" AS ENUM ('PENDING', 'ADD', 'CHECKOUT_STARTED', 'CHECKOUT_COMPLETED');

-- AlterTable
ALTER TABLE "Cart" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "CartEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "eventType" "CART_EVENT" NOT NULL DEFAULT 'PENDING',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CartEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CartEvent" ADD CONSTRAINT "CartEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartEvent" ADD CONSTRAINT "CartEvent_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
