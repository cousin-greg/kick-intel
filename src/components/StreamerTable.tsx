'use client'

import { useState, useMemo } from 'react'
import StreamerRow from './StreamerRow'

interface StreamerData {
  username: string
  avatarUrl: string | null
  casino: string | null
  followersCount: number
  avgViewers: number
  peakViewers: number
  estVolume: string
  lbRank: number | null
  isLive: boolean
  lastSeenAt: string | null
}

type SortKey = 'username' | 'casino' | 'followersCount' | 'avgViewers' | 'peakViewers' | 'lbRank'

interface Props {
  data: StreamerData[]
  casinos: string[]
}

export default function StreamerTable({ data, casinos }: Props) {
  const [search, setSearch] = useState('')
  const [casinoFilter, setCasinoFilter] = useState('')
  const [minFollowers, setMinFollowers] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('followersCount')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const filtered = useMemo(() => {
    let result = data

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(s => s.username.toLowerCase().includes(q))
    }

    if (casinoFilter) {
      result = result.filter(s => s.casino === casinoFilter)
    }

    if (minFollowers) {
      const min = parseInt(minFollowers)
      if (!isNaN(min)) {
        result = result.filter(s => s.followersCount >= min)
      }
    }

    result = [...result].sort((a, b) => {
      const av = a[sortKey] ?? 0
      const bv = b[sortKey] ?? 0
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [data, search, casinoFilter, minFollowers, sortKey, sortDir])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return ''
    return sortDir === 'asc' ? ' ↑' : ' ↓'
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 rounded-md text-sm outline-none"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
        />
        <select
          value={casinoFilter}
          onChange={e => setCasinoFilter(e.target.value)}
          className="px-3 py-2 rounded-md text-sm outline-none"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
        >
          <option value="">All Casinos</option>
          {casinos.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Min followers"
          value={minFollowers}
          onChange={e => setMinFollowers(e.target.value)}
          className="px-3 py-2 rounded-md text-sm outline-none w-32"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      {/* Table */}
      <div
        className="rounded-lg overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-tertiary)',
          border: '1px solid var(--border)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                <th className="text-left py-3 px-4 font-medium cursor-pointer select-none" style={{ color: 'var(--text-muted)' }} onClick={() => handleSort('username')}>
                  Streamer{sortIcon('username')}
                </th>
                <th className="text-left py-3 px-4 font-medium cursor-pointer select-none" style={{ color: 'var(--text-muted)' }} onClick={() => handleSort('casino')}>
                  Casino{sortIcon('casino')}
                </th>
                <th className="text-right py-3 px-4 font-medium cursor-pointer select-none" style={{ color: 'var(--text-muted)' }} onClick={() => handleSort('followersCount')}>
                  Followers{sortIcon('followersCount')}
                </th>
                <th className="text-right py-3 px-4 font-medium cursor-pointer select-none" style={{ color: 'var(--text-muted)' }} onClick={() => handleSort('avgViewers')}>
                  Avg Viewers{sortIcon('avgViewers')}
                </th>
                <th className="text-right py-3 px-4 font-medium cursor-pointer select-none" style={{ color: 'var(--text-muted)' }} onClick={() => handleSort('peakViewers')}>
                  Peak Viewers{sortIcon('peakViewers')}
                </th>
                <th className="text-right py-3 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>
                  Est. Volume
                </th>
                <th className="text-right py-3 px-4 font-medium cursor-pointer select-none" style={{ color: 'var(--text-muted)' }} onClick={() => handleSort('lbRank')}>
                  LB Rank{sortIcon('lbRank')}
                </th>
                <th className="py-3 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <StreamerRow
                  key={s.username}
                  {...s}
                  lastSeenAt={s.lastSeenAt ? new Date(s.lastSeenAt) : null}
                />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center" style={{ color: 'var(--text-muted)' }}>
                    No streamers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
