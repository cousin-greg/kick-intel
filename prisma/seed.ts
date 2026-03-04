import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const STREAMERS = [
  { username: 'xSlimousine', casino: 'Stake', followers: 645000, avgViewers: 14500, peakViewers: 38000, isLive: true, lbRank: 3 },
  { username: 'CasinoDave', casino: 'Stake', followers: 420000, avgViewers: 8200, peakViewers: 22000, isLive: false, lbRank: 8 },
  { username: 'HighRollerJake', casino: 'Rollbit', followers: 385000, avgViewers: 6800, peakViewers: 19500, isLive: true, lbRank: 12 },
  { username: 'SlotQueenLena', casino: 'Roobet', followers: 310000, avgViewers: 5500, peakViewers: 16000, isLive: false, lbRank: 18 },
  { username: 'DegenerateAndy', casino: 'Stake', followers: 275000, avgViewers: 4200, peakViewers: 12000, isLive: true, lbRank: 25 },
  { username: 'BonusHuntKing', casino: 'Duelbits', followers: 248000, avgViewers: 3800, peakViewers: 11000, isLive: false, lbRank: 34 },
  { username: 'xRoulette', casino: 'PackRush', followers: 195000, avgViewers: 3200, peakViewers: 9500, isLive: false, lbRank: 42 },
  { username: 'WagerWarrior', casino: 'Shuffle', followers: 178000, avgViewers: 2900, peakViewers: 8200, isLive: true, lbRank: 55 },
  { username: 'CryptoSlots99', casino: 'Rollbit', followers: 155000, avgViewers: 2400, peakViewers: 7000, isLive: false, lbRank: 67 },
  { username: 'LuckyLukeGambles', casino: 'Roobet', followers: 132000, avgViewers: 2100, peakViewers: 6200, isLive: false, lbRank: 88 },
  { username: 'PackDropper', casino: 'PackRush', followers: 98000, avgViewers: 1800, peakViewers: 5400, isLive: true, lbRank: null },
  { username: 'NightOwlBets', casino: 'Stake', followers: 85000, avgViewers: 1500, peakViewers: 4100, isLive: false, lbRank: null },
  { username: 'SpinToWinMax', casino: 'Duelbits', followers: 67000, avgViewers: 1200, peakViewers: 3200, isLive: false, lbRank: null },
  { username: 'AceHighRoller', casino: 'Shuffle', followers: 52000, avgViewers: 900, peakViewers: 2800, isLive: true, lbRank: null },
  { username: 'RollTheDice_', casino: 'Rollbit', followers: 38000, avgViewers: 650, peakViewers: 1900, isLive: false, lbRank: null },
  { username: 'SlotMachineSteve', casino: 'Roobet', followers: 24000, avgViewers: 420, peakViewers: 1100, isLive: false, lbRank: null },
  { username: 'MidnightGrinder', casino: 'Stake', followers: 15000, avgViewers: 280, peakViewers: 800, isLive: false, lbRank: null },
  { username: 'BabyStakesOnly', casino: 'Duelbits', followers: 8500, avgViewers: 210, peakViewers: 550, isLive: false, lbRank: null },
]

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.leaderboardEntry.deleteMany()
  await prisma.streamerSnapshot.deleteMany()
  await prisma.streamer.deleteMany()

  for (const s of STREAMERS) {
    const hoursAgo = Math.floor(Math.random() * 48) + 1
    const lastSeenAt = s.isLive ? new Date() : new Date(Date.now() - hoursAgo * 3600000)

    const streamer = await prisma.streamer.create({
      data: {
        username: s.username,
        kickUrl: `https://kick.com/${s.username.toLowerCase()}`,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.username}`,
        followersCount: s.followers,
        casino: s.casino,
        casinoSlug: s.casino.toLowerCase(),
        isLive: s.isLive,
        lastSeenAt,
      },
    })

    // Create snapshot
    await prisma.streamerSnapshot.create({
      data: {
        streamerId: streamer.id,
        followersCount: s.followers,
        avgViewers7d: s.avgViewers,
        peakViewers30d: s.peakViewers,
        estMonthlyVol: s.lbRank && s.lbRank <= 10 ? '$1M+' : s.lbRank && s.lbRank <= 50 ? '$250K+' : null,
      },
    })

    // Create leaderboard entry if ranked
    if (s.lbRank) {
      const vol = s.lbRank <= 10 ? '$1M+' : s.lbRank <= 50 ? '$250K+' : '$50K+'
      await prisma.leaderboardEntry.create({
        data: {
          streamerId: streamer.id,
          casino: s.casino,
          rank: s.lbRank,
          estimatedVolume: vol,
        },
      })
    }
  }

  console.log(`Seeded ${STREAMERS.length} streamers`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
