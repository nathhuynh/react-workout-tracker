import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

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
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
