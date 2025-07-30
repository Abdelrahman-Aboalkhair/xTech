/*
  Warnings:

  - You are about to drop the column `averageRating` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `isBestSeller` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `isFeatured` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `isNew` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `isTrending` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `reviewCount` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Attribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AttributeValue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CartEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CartItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CategoryAttribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductVariant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductVariantAttribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Report` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Restock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Section` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Shipment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StockMovement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `price` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_userId_fkey";

-- DropForeignKey
ALTER TABLE "AttributeValue" DROP CONSTRAINT "AttributeValue_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_userId_fkey";

-- DropForeignKey
ALTER TABLE "CartEvent" DROP CONSTRAINT "CartEvent_cartId_fkey";

-- DropForeignKey
ALTER TABLE "CartEvent" DROP CONSTRAINT "CartEvent_userId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_cartId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_variantId_fkey";

-- DropForeignKey
ALTER TABLE "CategoryAttribute" DROP CONSTRAINT "CategoryAttribute_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "CategoryAttribute" DROP CONSTRAINT "CategoryAttribute_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_userId_fkey";

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_chatId_fkey";

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_variantId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariantAttribute" DROP CONSTRAINT "ProductVariantAttribute_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariantAttribute" DROP CONSTRAINT "ProductVariantAttribute_valueId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariantAttribute" DROP CONSTRAINT "ProductVariantAttribute_variantId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_userId_fkey";

-- DropForeignKey
ALTER TABLE "Restock" DROP CONSTRAINT "Restock_userId_fkey";

-- DropForeignKey
ALTER TABLE "Restock" DROP CONSTRAINT "Restock_variantId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_productId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_userId_fkey";

-- DropForeignKey
ALTER TABLE "Shipment" DROP CONSTRAINT "Shipment_orderId_fkey";

-- DropForeignKey
ALTER TABLE "StockMovement" DROP CONSTRAINT "StockMovement_variantId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_orderId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "averageRating",
DROP COLUMN "isBestSeller",
DROP COLUMN "isFeatured",
DROP COLUMN "isNew",
DROP COLUMN "isTrending",
DROP COLUMN "reviewCount",
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "videoUrl" TEXT;

-- DropTable
DROP TABLE "Address";

-- DropTable
DROP TABLE "Attribute";

-- DropTable
DROP TABLE "AttributeValue";

-- DropTable
DROP TABLE "Cart";

-- DropTable
DROP TABLE "CartEvent";

-- DropTable
DROP TABLE "CartItem";

-- DropTable
DROP TABLE "CategoryAttribute";

-- DropTable
DROP TABLE "Chat";

-- DropTable
DROP TABLE "ChatMessage";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "OrderItem";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "ProductVariant";

-- DropTable
DROP TABLE "ProductVariantAttribute";

-- DropTable
DROP TABLE "Report";

-- DropTable
DROP TABLE "Restock";

-- DropTable
DROP TABLE "Review";

-- DropTable
DROP TABLE "Section";

-- DropTable
DROP TABLE "Shipment";

-- DropTable
DROP TABLE "StockMovement";

-- DropTable
DROP TABLE "Transaction";

-- DropEnum
DROP TYPE "CART_EVENT";

-- DropEnum
DROP TYPE "SECTION_TYPE";
