/*
  Warnings:

  - A unique constraint covering the columns `[date,userId]` on the table `Workout` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Workout_date_key";

-- CreateIndex
CREATE UNIQUE INDEX "Workout_date_userId_key" ON "Workout"("date", "userId");
