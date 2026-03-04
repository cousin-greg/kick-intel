import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface StreamerData {
  username: string
  kickUrl: string
  followersCount: number
  avgViewers: number
  peakViewers: number
  isLive: boolean
}

interface LeaderboardData {
  [casino: string]: { rank: number; username: string }[]
}

function estimatedVolume(rank: number): number {
  if (rank === 1) return 7500000
  if (rank <= 3) return 4000000
  if (rank <= 10) return 2000000
  if (rank <= 25) return 750000
  if (rank <= 50) return 350000
  if (rank <= 100) return 125000
  return 30000
}

async function main() {
  console.log('Loading source data...')

  const streamersRaw: StreamerData[] = JSON.parse(
    fs.readFileSync('/tmp/kick-slots-streamers.json', 'utf-8')
  )
  const leaderboards: LeaderboardData = JSON.parse(
    fs.readFileSync('/tmp/casino-leaderboards.json', 'utf-8')
  )

  console.log(`Loaded ${streamersRaw.length} streamers, ${Object.keys(leaderboards).length} casino leaderboards`)

  // Build lookup: username (lowercase) -> { casino, rank }
  const lbLookup = new Map<string, { casino: string; rank: number }>()
  for (const [casino, entries] of Object.entries(leaderboards)) {
    for (const entry of entries) {
      const key = entry.username.toLowerCase()
      // If streamer appears on multiple leaderboards, keep highest rank
      const existing = lbLookup.get(key)
      if (!existing || entry.rank < existing.rank) {
        lbLookup.set(key, { casino, rank: entry.rank })
      }
    }
  }

  console.log(`Leaderboard lookup: ${lbLookup.size} unique streamers across casinos`)

  // Clear existing data
  console.log('Clearing existing data...')
  await prisma.leaderboardEntry.deleteMany()
  await prisma.streamerSnapshot.deleteMany()
  await prisma.streamer.deleteMany()

  // Import streamers in batches
  console.log('Importing streamers...')
  let imported = 0
  let withLB = 0

  for (const s of streamersRaw) {
    const lb = lbLookup.get(s.username.toLowerCase())
    const casino = lb?.casino ?? null
    const casinoSlug = casino?.toLowerCase().replace(/[^a-z0-9]/g, '-') ?? null

    const hoursAgo = Math.floor(Math.random() * 72) + 1
    const lastSeenAt = s.isLive ? new Date() : new Date(Date.now() - hoursAgo * 3600000)

    const streamer = await prisma.streamer.create({
      data: {
        username: s.username,
        kickUrl: s.kickUrl,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.username}`,
        followersCount: s.followersCount,
        casino,
        casinoSlug,
        isLive: s.isLive,
        lastSeenAt,
      },
    })

    // Create snapshot
    const vol = lb ? estimatedVolume(lb.rank) : null
    await prisma.streamerSnapshot.create({
      data: {
        streamerId: streamer.id,
        followersCount: s.followersCount,
        avgViewers7d: s.avgViewers,
        peakViewers30d: s.peakViewers,
        estMonthlyVol: vol ? `$${vol}` : null,
      },
    })

    // Create leaderboard entry if ranked
    if (lb) {
      withLB++
      await prisma.leaderboardEntry.create({
        data: {
          streamerId: streamer.id,
          casino: lb.casino,
          rank: lb.rank,
          estimatedVolume: String(estimatedVolume(lb.rank)),
        },
      })
    }

    imported++
    if (imported % 100 === 0) {
      console.log(`  ${imported}/${streamersRaw.length}...`)
    }
  }

  console.log(`\nDone! Imported ${imported} streamers`)
  console.log(`  ${withLB} with casino leaderboard data`)
  console.log(`  ${imported - withLB} without leaderboard data (casino = null)`)

  // Print top 5 by estimated volume
  const top5 = await prisma.leaderboardEntry.findMany({
    include: { streamer: true },
    orderBy: { rank: 'asc' },
    take: 10,
  })

  console.log('\nTop streamers by estimated volume:')
  const seen = new Set<string>()
  let count = 0
  for (const entry of top5) {
    if (seen.has(entry.streamer.username)) continue
    seen.add(entry.streamer.username)
    const vol = estimatedVolume(entry.rank)
    const volStr = vol >= 1000000 ? `$${vol / 1000000}M` : `$${vol / 1000}K`
    console.log(`  #${entry.rank} ${entry.streamer.username} (${entry.casino}) - ${volStr}/mo`)
    count++
    if (count >= 5) break
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
