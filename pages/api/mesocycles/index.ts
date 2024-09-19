import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorised' });
  }

  if (req.method === 'POST') {
    try {
      const { name, templateName, days } = req.body;
      const mesocycle = await prisma.mesocycle.create({
        data: {
          name,
          templateName,
          userId: session.user.id,
          days: {
            create: days.map((day: any, index: number) => ({
              name: day.name,
              order: index,
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
              exercises: true,
            },
          },
        },
      });
      res.status(201).json(mesocycle);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create mesocycle' });
    }
  } else if (req.method === 'GET') {
    try {
      const mesocycles = await prisma.mesocycle.findMany({
        where: { userId: session.user.id },
        include: {
          days: {
            include: {
              exercises: true,
            },
          },
        },
      });
      res.status(200).json(mesocycles);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch mesocycles' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
