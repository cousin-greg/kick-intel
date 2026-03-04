import Link from 'next/link'
import StatusBadge from './StatusBadge'
import CasinoBadge from './CasinoBadge'

interface StreamerRowProps {
  username: string
  avatarUrl: string | null
  casino: string | null
  followersCount: number
  avgViewers: number
  peakViewers: number
  estVolume: string
  lbRank: number | null
  isLive: boolean
  lastSeenAt: Date | null
}

export default function StreamerRow({
  username,
  avatarUrl,
  casino,
  followersCount,
  avgViewers,
  peakViewers,
  estVolume,
  lbRank,
  isLive,
  lastSeenAt,
}: StreamerRowProps) {
  return (
    <tr
      className="border-b transition-colors hover:bg-[#2b2d31]"
      style={{ borderColor: 'var(--border)' }}
    >
      <td className="py-3 px-4">
        <Link href={`/streamer/${username}`} className="flex items-center gap-3 hover:opacity-80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
            alt={username}
            className="w-8 h-8 rounded-full"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          />
          <span className="font-medium" style={{ color: 'var(--accent-blue)' }}>
            {username}
          </span>
        </Link>
      </td>
      <td className="py-3 px-4">
        <CasinoBadge casino={casino} />
      </td>
      <td className="py-3 px-4 text-right tabular-nums">
        {followersCount.toLocaleString()}
      </td>
      <td className="py-3 px-4 text-right tabular-nums">
        {avgViewers > 0 ? avgViewers.toLocaleString() : '--'}
      </td>
      <td className="py-3 px-4 text-right tabular-nums">
        {peakViewers > 0 ? peakViewers.toLocaleString() : '--'}
      </td>
      <td className="py-3 px-4 text-right font-medium" style={{ color: 'var(--green-live)' }}>
        {estVolume}
      </td>
      <td className="py-3 px-4 text-right tabular-nums">
        {lbRank || '--'}
      </td>
      <td className="py-3 px-4">
        <StatusBadge isLive={isLive} lastSeenAt={lastSeenAt} />
      </td>
    </tr>
  )
}
