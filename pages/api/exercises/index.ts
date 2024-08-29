import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const exercises = await prisma.exercise.findMany();
      res.status(200).json(exercises);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      res.status(500).json({ message: 'Error fetching exercises' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}