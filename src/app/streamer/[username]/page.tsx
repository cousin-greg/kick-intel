import { prisma } from '@/lib/prisma'
import { estimateVolume } from '@/lib/volume'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import StatsCard from '@/components/StatsCard'
import CasinoBadge from '@/components/CasinoBadge'
import StatusBadge from '@/components/StatusBadge'

export const dynamic = 'force-dynamic'

export default async function StreamerPage({
  params,
}: {
  params: { username: string }
}) {
  const streamer = await prisma.streamer.findUnique({
    where: { username: params.username },
    include: {
      snapshots: {
        orderBy: { capturedAt: 'desc' },
        take: 10,
      },
      leaderboard: {
        orderBy: { capturedAt: 'desc' },
        take: 20,
      },
    },
  })

  if (!streamer) return notFound()

  const latestSnap = streamer.snapshots[0]
  const latestLb = streamer.leaderboard[0]
  const avgViewers = latestSnap?.avgViewers7d ?? 0
  const peakViewers = latestSnap?.peakViewers30d ?? 0
  const lbRank = latestLb?.rank ?? null
  const estVol = estimateVolume(lbRank, avgViewers)

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm mb-6 hover:opacity-80"
        style={{ color: 'var(--text-muted)' }}
      >
        ← Back to Database
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={streamer.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${streamer.username}`}
          alt={streamer.username}
          className="w-16 h-16 rounded-full"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
        />
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{streamer.username}</h1>
            <StatusBadge isLive={streamer.isLive} lastSeenAt={streamer.lastSeenAt} />
          </div>
          <div className="flex items-center gap-3 mt-1">
            <CasinoBadge casino={streamer.casino} />
            <a
              href={streamer.kickUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:underline"
              style={{ color: 'var(--accent-blue)' }}
            >
              kick.com/{streamer.username}
            </a>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Followers" value={streamer.followersCount} />
        <StatsCard label="Avg Viewers (7d)" value={avgViewers > 0 ? avgViewers.toLocaleString() : '--'} />
        <StatsCard label="Peak Viewers (30d)" value={peakViewers > 0 ? peakViewers.toLocaleString() : '--'} />
        <StatsCard label="Est. Monthly Volume" value={estVol} />
      </div>

      {/* Leaderboard History */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Leaderboard History</h2>
        {streamer.leaderboard.length > 0 ? (
          <div
            className="rounded-lg overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
            }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                  <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>Casino</th>
                  <th className="text-right py-3 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>Rank</th>
                  <th className="text-right py-3 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>Est. Volume</th>
                  <th className="text-right py-3 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {streamer.leaderboard.map((entry) => (
                  <tr key={entry.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                    <td className="py-3 px-4">
                      <CasinoBadge casino={entry.casino} />
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums">#{entry.rank}</td>
                    <td className="py-3 px-4 text-right" style={{ color: 'var(--green-live)' }}>
                      {entry.estimatedVolume || '--'}
                    </td>
                    <td className="py-3 px-4 text-right" style={{ color: 'var(--text-muted)' }}>
                      {new Date(entry.capturedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm py-8 text-center" style={{ color: 'var(--text-muted)' }}>
            No leaderboard entries yet
          </p>
        )}
      </div>
    </div>
  )
}
