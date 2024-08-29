import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const templates = await prisma.mesocycleTemplate.findMany({
        include: {
          days: {
            include: {
              exercises: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      });
      res.status(200).json(templates);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch mesocycle templates' });
    }
  } else if (req.method === 'POST') {
    try {
      const { label, value, days } = req.body;
      const template = await prisma.mesocycleTemplate.create({
        data: {
          label,
          value,
          days: {
            create: days.map((day: any, dayIndex: number) => ({
              name: day.name,
              order: dayIndex,
              exercises: {
                create: day.exercises.map((exercise: any, exerciseIndex: number) => ({
                  muscleGroup: exercise.muscleGroup,
                  order: exerciseIndex,
                })),
              },
            })),
          },
        },
        include: {
          days: {
            include: {
              exercises: true,
            },
          },
        },
      });
      res.status(201).json(template);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create mesocycle template' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}