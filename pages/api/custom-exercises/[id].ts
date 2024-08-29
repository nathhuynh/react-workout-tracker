import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('API route called:', req.method, req.url);
  console.log('Request body:', req.body);

  try {
    const session = await getServerSession(req, res, authOptions);
    console.log('Session:', session);

    if (!session || !session.user?.id) {
      console.log('No session found or user ID missing, returning 401');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = session.user.id;
    const { id } = req.query;

    if (req.method === 'PUT') {
      try {
        const { name, equipment, primaryMuscles, category } = req.body;
        const updatedExercise = await prisma.customExercise.updateMany({
          where: {
            id: Number(id),
            userId: userId
          },
          data: {
            name,
            equipment,
            primaryMuscles,
            category
          },
        });

        if (updatedExercise.count === 0) {
          return res.status(404).json({ error: 'Custom exercise not found or you do not have permission to modify it' });
        }

        const exercise = await prisma.customExercise.findFirst({
          where: {
            id: Number(id),
            userId: userId
          }
        });

        console.log('Updated exercise:', exercise);
        res.status(200).json(exercise);
      } catch (error) {
        console.error('Error updating custom exercise:', error);
        res.status(500).json({ error: 'Failed to update custom exercise' });
      }
    } else if (req.method === 'DELETE') {
      try {
        const deletedExercise = await prisma.customExercise.deleteMany({
          where: {
            id: Number(id),
            userId: userId
          },
        });

        if (deletedExercise.count === 0) {
          return res.status(404).json({ error: 'Custom exercise not found or you do not have permission to delete it' });
        }

        console.log('Deleted exercise with ID:', id);
        res.status(204).end();
      } catch (error) {
        console.error('Error deleting custom exercise:', error);
        res.status(500).json({ error: 'Failed to delete custom exercise' });
      }
    } else {
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Unexpected error in custom exercises API route:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}