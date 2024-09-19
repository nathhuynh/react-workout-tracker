import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import prisma from '../../../lib/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET' && req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const session = await getServerSession(req, res, authOptions)
    if (!session || !session.user) {
        return res.status(401).json({ message: 'Unauthorised' })
    }

    const { date } = req.query

    if (!date || typeof date !== 'string') {
        return res.status(400).json({ message: 'Invalid date parameter' })
    }

    if (req.method === 'GET') {
        try {
            const workout = await prisma.workout.findUnique({
                where: {
                    date_userId: {
                        date: new Date(date),
                        userId: session.user.id,
                    },
                },
            })

            if (!workout) {
                return res.status(200).json({ exercises: {}, exerciseOrder: [], notes: '' })
            }

            res.status(200).json({
                exercises: workout.exercises,
                exerciseOrder: workout.exerciseOrder,
                notes: workout.notes || '',
            })
        } catch (error) {
            console.error('Error fetching workout:', error)
            res.status(500).json({ message: 'Internal server error' })
        }
    } else if (req.method === 'PUT') {
        const { exercises, exerciseOrder, notes } = req.body

        try {
            const workout = await prisma.workout.upsert({
                where: {
                    date_userId: {
                        date: new Date(date),
                        userId: session.user.id,
                    },
                },
                update: {
                    exercises,
                    exerciseOrder,
                    notes,
                },
                create: {
                    date: new Date(date),
                    userId: session.user.id,
                    exercises,
                    exerciseOrder,
                    notes,
                },
            })

            res.status(200).json(workout)
        } catch (error) {
            console.error('Error updating workout:', error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }
}