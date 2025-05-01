/*
  Warnings:

  - You are about to alter the column `fname` on the `users_info` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `lname` on the `users_info` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `users_info` MODIFY `fname` VARCHAR(100) NULL,
    MODIFY `lname` VARCHAR(100) NULL;
