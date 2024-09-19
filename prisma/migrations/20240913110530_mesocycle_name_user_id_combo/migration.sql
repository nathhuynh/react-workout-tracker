/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Mesocycle` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Mesocycle_name_userId_key" ON "Mesocycle"("name", "userId");
