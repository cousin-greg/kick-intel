import { NextResponse } from 'next/server'

export async function POST() {
  // TODO: Implement scraping endpoint
  // This will trigger scraping of Kick streamer data
  // and update the database
  return NextResponse.json(
    { error: 'Not implemented' },
    { status: 501 }
  )
}
