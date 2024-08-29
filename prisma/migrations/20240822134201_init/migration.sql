-- AlterTable
ALTER TABLE "CustomExercise" ADD COLUMN     "category" TEXT;

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "category" TEXT,
ADD COLUMN     "force" TEXT,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "instructions" TEXT[],
ADD COLUMN     "level" TEXT,
ADD COLUMN     "mechanic" TEXT,
ADD COLUMN     "secondaryMuscles" TEXT[];

-- CreateTable
CREATE TABLE "WorkoutExercise" (
    "id" SERIAL NOT NULL,
    "workoutId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,

    CONSTRAINT "WorkoutExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Set" (
    "id" SERIAL NOT NULL,
    "workoutExerciseId" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "reps" INTEGER NOT NULL,
    "rir" INTEGER,

    CONSTRAINT "Set_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MesocycleTemplate" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "MesocycleTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateDay" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "templateId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "TemplateDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateExercise" (
    "id" SERIAL NOT NULL,
    "muscleGroup" TEXT NOT NULL,
    "dayId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "TemplateExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mesocycle" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "templateName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mesocycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Day" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mesocycleId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Day_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MesocycleExercise" (
    "id" SERIAL NOT NULL,
    "dayId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "muscleGroup" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "MesocycleExercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MesocycleTemplate_value_key" ON "MesocycleTemplate"("value");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateDay_templateId_order_key" ON "TemplateDay"("templateId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateExercise_dayId_order_key" ON "TemplateExercise"("dayId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Day_mesocycleId_order_key" ON "Day"("mesocycleId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "MesocycleExercise_dayId_order_key" ON "MesocycleExercise"("dayId", "order");

-- AddForeignKey
ALTER TABLE "WorkoutExercise" ADD CONSTRAINT "WorkoutExercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutExercise" ADD CONSTRAINT "WorkoutExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_workoutExerciseId_fkey" FOREIGN KEY ("workoutExerciseId") REFERENCES "WorkoutExercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateDay" ADD CONSTRAINT "TemplateDay_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "MesocycleTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateExercise" ADD CONSTRAINT "TemplateExercise_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "TemplateDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Day" ADD CONSTRAINT "Day_mesocycleId_fkey" FOREIGN KEY ("mesocycleId") REFERENCES "Mesocycle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MesocycleExercise" ADD CONSTRAINT "MesocycleExercise_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Day"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MesocycleExercise" ADD CONSTRAINT "MesocycleExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
