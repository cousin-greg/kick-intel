interface StatsCardProps {
  label: string
  value: string | number
  subtext?: string
}

export default function StatsCard({ label, value, subtext }: StatsCardProps) {
  return (
    <div
      className="rounded-lg p-4"
      style={{
        backgroundColor: 'var(--bg-tertiary)',
        border: '1px solid var(--border)',
      }}
    >
      <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
      <p className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {subtext && (
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          {subtext}
        </p>
      )}
    </div>
  )
}
