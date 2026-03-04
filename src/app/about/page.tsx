export default function AboutPage() {
  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">About</h1>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        kick-intel is a public database of Kick gambling streamers. Data includes
        follower counts, estimated viewer averages, casino affiliations, and
        leaderboard standings. All data is collected from public sources.
      </p>
    </div>
  )
}
