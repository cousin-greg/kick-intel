import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const streamers = await prisma.streamer.findMany({
    include: {
      snapshots: {
        orderBy: { capturedAt: 'desc' },
        take: 1,
      },
      leaderboard: {
        orderBy: { capturedAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { followersCount: 'desc' },
  })

  return NextResponse.json(streamers)
}
