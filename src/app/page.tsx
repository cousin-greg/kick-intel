import { prisma } from '@/lib/prisma'
import { estimateVolume } from '@/lib/volume'
import StreamerTable from '@/components/StreamerTable'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
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

  const data = streamers.map((s) => {
    const snap = s.snapshots[0]
    const lb = s.leaderboard[0]
    const avgViewers = snap?.avgViewers7d ?? 0
    const peakViewers = snap?.peakViewers30d ?? 0
    const lbRank = lb?.rank ?? null

    return {
      username: s.username,
      avatarUrl: s.avatarUrl,
      casino: s.casino,
      followersCount: s.followersCount,
      avgViewers,
      peakViewers,
      estVolume: estimateVolume(lbRank, avgViewers),
      lbRank,
      isLive: s.isLive,
      lastSeenAt: s.lastSeenAt ? s.lastSeenAt.toISOString() : null,
    }
  })

  const casinos = Array.from(new Set(streamers.map(s => s.casino).filter(Boolean))) as string[]

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Streamer Database</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          {streamers.length} streamers tracked
        </p>
      </div>
      <StreamerTable data={data} casinos={casinos} />
    </div>
  )
}
