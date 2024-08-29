import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const mesocycles = await prisma.mesocycle.findMany({
        include: {
          days: {
            include: {
              exercises: {
                include: {
                  exercise: true,
                },
              },
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      });
      res.status(200).json(mesocycles);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch mesocycles' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, templateName, days } = req.body;
      const mesocycle = await prisma.mesocycle.create({
        data: {
          name,
          templateName,
          days: {
            create: days.map((day: any, dayIndex: number) => ({
              name: day.name,
              order: dayIndex,
              exercises: {
                create: day.exercises.map((exercise: any, exerciseIndex: number) => ({
                  muscleGroup: exercise.muscleGroup,
                  exerciseId: exercise.exerciseId,
                  order: exerciseIndex,
                })),
              },
            })),
          },
        },
        include: {
          days: {
            include: {
              exercises: {
                include: {
                  exercise: true,
                },
              },
            },
          },
        },
      });
      res.status(201).json(mesocycle);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create mesocycle' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}