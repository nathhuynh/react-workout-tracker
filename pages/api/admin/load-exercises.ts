import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from '../../../lib/prisma';
import { Exercise } from '../../../utils/exerciseService';
import axios from 'axios';

async function fetchExercisesFromAPI(): Promise<Exercise[]> {
  const response = await axios.get<Exercise[]>('https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json');
  return response.data.map(exercise => ({ ...exercise, sets: [] }));
}

async function loadExercises(): Promise<void> {
  const exercises = await fetchExercisesFromAPI();

  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { name: exercise.name },
      update: {
        force: exercise.force,
        level: exercise.level,
        mechanic: exercise.mechanic,
        equipment: exercise.equipment,
        primaryMuscles: exercise.primaryMuscles,
        secondaryMuscles: exercise.secondaryMuscles,
        instructions: exercise.instructions,
        category: exercise.category,
        images: exercise.images,
      },
      create: {
        name: exercise.name,
        force: exercise.force,
        level: exercise.level,
        mechanic: exercise.mechanic,
        equipment: exercise.equipment,
        primaryMuscles: exercise.primaryMuscles,
        secondaryMuscles: exercise.secondaryMuscles,
        instructions: exercise.instructions,
        category: exercise.category,
        images: exercise.images,
      },
    });
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user?.email !== 'admin@email.com') {
      return res.status(401).json({ message: 'Unauthorised' });
    }

    await loadExercises();
    res.status(200).json({ message: 'Exercises loaded successfully' });
  } catch (error) {
    console.error('Error loading exercises:', error);
    res.status(500).json({ message: 'Error loading exercises', error: (error as Error).message });
  } finally {
    await prisma.$disconnect();
  }
}