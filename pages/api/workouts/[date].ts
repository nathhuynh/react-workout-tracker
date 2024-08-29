import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import prisma from '../../../lib/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const session = await getServerSession(req, res, authOptions)
    if (!session || !session.user) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const { date } = req.query

    if (!date || typeof date !== 'string') {
        return res.status(400).json({ message: 'Invalid date parameter' })
    }

    try {
        const workout = await prisma.workout.findUnique({
            where: {
                date_userId: {
                    date: new Date(date),
                    userId: session.user.id,
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

        if (!workout) {
            return res.status(404).json({ message: 'Workout not found' })
        }

        res.status(200).json(workout)
    } catch (error) {
        console.error('Error fetching workout:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}