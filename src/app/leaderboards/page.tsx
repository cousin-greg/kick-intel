import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import CasinoBadge from '@/components/CasinoBadge'

export const dynamic = 'force-dynamic'

function formatVolume(vol: string | null): string {
  if (!vol) return '--'
  const num = parseInt(vol)
  if (isNaN(num)) return vol
  if (num >= 1000000) {
    const m = num / 1000000
    return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M/mo`
  }
  if (num >= 1000) {
    return `$${Math.round(num / 1000)}K/mo`
  }
  return `$${num}/mo`
}

export default async function LeaderboardsPage() {
  const entries = await prisma.leaderboardEntry.findMany({
    include: {
      streamer: true,
    },
    orderBy: { rank: 'asc' },
  })

  // Group by casino
  const byCasino: Record<string, typeof entries> = {}
  for (const entry of entries) {
    if (!byCasino[entry.casino]) byCasino[entry.casino] = []
    const existing = byCasino[entry.casino].find(e => e.streamerId === entry.streamerId)
    if (!existing) {
      byCasino[entry.casino].push(entry)
    }
  }

  const casinoNames = Object.keys(byCasino).sort()
  const totalRanked = entries.length

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Leaderboards</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          {totalRanked} ranked streamers across {casinoNames.length} casinos
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
          Data updated: March 3, 2026
        </p>
      </div>

      {casinoNames.length === 0 ? (
        <p className="text-sm py-12 text-center" style={{ color: 'var(--text-muted)' }}>
          No leaderboard data yet
        </p>
      ) : (
        <div className="space-y-8">
          {casinoNames.map(casino => (
            <div key={casino}>
              <div className="flex items-center gap-3 mb-3">
                <CasinoBadge casino={casino} />
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {byCasino[casino].length} ranked
                </span>
              </div>
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
                      <th className="text-right py-3 px-4 font-medium w-20" style={{ color: 'var(--text-muted)' }}>Rank</th>
                      <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>Streamer</th>
                      <th className="text-right py-3 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>Followers</th>
                      <th className="text-right py-3 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>Est. Monthly Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byCasino[casino].map(entry => (
                      <tr key={entry.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                        <td className="py-3 px-4 text-right tabular-nums font-medium">#{entry.rank}</td>
                        <td className="py-3 px-4">
                          <Link
                            href={`/streamer/${entry.streamer.username}`}
                            className="hover:opacity-80"
                            style={{ color: 'var(--accent-blue)' }}
                          >
                            {entry.streamer.username}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums" style={{ color: 'var(--text-muted)' }}>
                          {entry.streamer.followersCount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-medium" style={{ color: 'var(--green-live)' }}>
                          {formatVolume(entry.estimatedVolume)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
