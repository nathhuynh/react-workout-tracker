/*
  Warnings:

  - You are about to drop the `MesocycleExercise` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Day" DROP CONSTRAINT "Day_mesocycleId_fkey";

-- DropForeignKey
ALTER TABLE "MesocycleExercise" DROP CONSTRAINT "MesocycleExercise_dayId_fkey";

-- DropForeignKey
ALTER TABLE "MesocycleExercise" DROP CONSTRAINT "MesocycleExercise_exerciseId_fkey";

-- DropTable
DROP TABLE "MesocycleExercise";

-- CreateTable
CREATE TABLE "DayExercise" (
    "id" SERIAL NOT NULL,
    "dayId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "muscleGroup" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "DayExercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DayExercise_dayId_order_key" ON "DayExercise"("dayId", "order");

-- AddForeignKey
ALTER TABLE "Day" ADD CONSTRAINT "Day_mesocycleId_fkey" FOREIGN KEY ("mesocycleId") REFERENCES "Mesocycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DayExercise" ADD CONSTRAINT "DayExercise_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Day"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DayExercise" ADD CONSTRAINT "DayExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
