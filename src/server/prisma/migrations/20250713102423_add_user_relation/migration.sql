-- AddForeignKey
ALTER TABLE "Restock" ADD CONSTRAINT "Restock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
