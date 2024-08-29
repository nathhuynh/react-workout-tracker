import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('API route called');
  console.log('Request method:', req.method);
  console.log('Request body:', req.body);

  try {
    console.log('Attempting to get session');
    const session = await getServerSession(req, res, authOptions);
    console.log('Session:', session);

    if (!session || !session.user?.id) {
      console.log('No session found or user ID missing, returning 401');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = session.user.id;
    console.log('User ID:', userId);

    if (req.method === 'GET') {
      try {
        console.log('Fetching custom exercises');
        const customExercises = await prisma.customExercise.findMany({
          where: { userId: userId },
        });
        console.log('Custom exercises fetched:', customExercises);
        res.status(200).json(customExercises);
      } catch (error) {
        console.error('Error fetching custom exercises:', error);
        res.status(500).json({ error: 'Failed to fetch custom exercises' });
      }
    } else if (req.method === 'POST') {
      try {
        console.log('Attempting to create custom exercise');
        const { name, equipment, primaryMuscles, category } = req.body;
        console.log('Received data:', { name, equipment, primaryMuscles, category, userId });

        const customExercise = await prisma.customExercise.create({
          data: {
            name,
            equipment,
            primaryMuscles,
            category,
            userId: userId
          },
        });
        console.log('Custom exercise created:', customExercise);
        res.status(201).json(customExercise);
      } catch (error) {
        console.error('Error creating custom exercise:', error);
        res.status(500).json({ error: 'Failed to create custom exercise' });
      }
    } else {
      console.log('Method not allowed');
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Unexpected error in custom exercises API route:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}