import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
        return res.status(401).json({ error: 'Unauthorised' });
    }

    const { name } = req.query;

    if (typeof name !== 'string') {
        return res.status(400).json({ error: 'Invalid mesocycle name' });
    }

    if (req.method === 'PUT') {
        try {
            const { name: newName, templateName, days } = req.body;
            const updatedMesocycle = await prisma.mesocycle.update({
                where: {
                    name_userId: {
                        name: name,
                        userId: session.user.id
                    }
                },
                data: {
                    name: newName,
                    templateName,
                    days: {
                        deleteMany: {},
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
                        orderBy: {
                            order: 'asc',
                        },
                    },
                },
            });
            res.status(200).json(updatedMesocycle);
        } catch (error) {
            console.error('Error updating mesocycle:', error);
            res.status(500).json({ error: 'Failed to update mesocycle', details: error instanceof Error ? error.message : 'Unknown error' });
        }
    } else if (req.method === 'DELETE') {
        try {
            const deletedMesocycle = await prisma.mesocycle.delete({
                where: {
                    name_userId: {
                        name: name,
                        userId: session.user.id
                    }
                },
            });

            res.status(204).end();
        } catch (error) {
            console.error('Error in DELETE /mesocycles/:name:', error);
            if (error instanceof Error && error.name === 'PrismaClientKnownRequestError' && (error as any).code === 'P2025') {
                return res.status(404).json({ error: 'Mesocycle not found' });
            }
            res.status(500).json({ 
                error: 'An error occurred while deleting the mesocycle', 
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    } else {
        res.setHeader('Allow', ['PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
