import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const event = await request.json()
    
    // In production, forward to real analytics service
    // For now, just log it
    console.log('📊 Analytics Event:', event)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

