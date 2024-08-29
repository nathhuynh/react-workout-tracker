import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import prisma from '../../../lib/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const session = await getServerSession(req, res, authOptions)
    if (!session || !session.user) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const { date, exercises, exerciseOrder, notes } = req.body

    if (!date || !exercises || !exerciseOrder) {
        return res.status(400).json({ message: 'Missing required fields' })
    }

    try {
        const workout = await prisma.workout.upsert({
            where: {
                date_userId: {
                    date: new Date(date),
                    userId: session.user.id,
                },
            },
            update: {
                exercises: exercises,
                exerciseOrder: exerciseOrder,
                notes: notes,
                workoutExercises: {
                    deleteMany: {},
                    create: exercises.map((exercise: any, index: number) => ({
                        exerciseId: exercise.id,
                        order: index,
                        sets: {
                            create: exercise.sets.map((set: any) => ({
                                weight: set.weight,
                                reps: set.reps,
                                rir: set.rir,
                            })),
                        },
                    })),
                },
            },
            create: {
                date: new Date(date),
                userId: session.user.id,
                exercises: exercises,
                exerciseOrder: exerciseOrder,
                notes: notes,
                workoutExercises: {
                    create: exercises.map((exercise: any, index: number) => ({
                        exerciseId: exercise.id,
                        order: index,
                        sets: {
                            create: exercise.sets.map((set: any) => ({
                                weight: set.weight,
                                reps: set.reps,
                                rir: set.rir,
                            })),
                        },
                    })),
                },
            },
            include: {
                workoutExercises: {
                    include: {
                        sets: true,
                        exercise: true,
                    },
                },
            },
        })

        res.status(200).json(workout)
    } catch (error) {
        console.error('Error updating workout:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}