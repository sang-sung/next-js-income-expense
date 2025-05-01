/*
  Warnings:

  - You are about to alter the column `type` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `transactions` MODIFY `type` TINYINT NULL;
