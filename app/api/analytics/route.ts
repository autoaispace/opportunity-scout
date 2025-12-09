import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    let event
    try {
      const body = await request.text()
      if (!body) {
        return NextResponse.json(
          { error: 'Request body is required' },
          { status: 400 }
        )
      }
      event = JSON.parse(body)
    } catch (parseError) {
      console.error('[Analytics API] JSON parse error:', parseError)
      return NextResponse.json(
        { 
          error: 'Invalid JSON in request body',
          details: process.env.NODE_ENV === 'development' 
            ? (parseError instanceof Error ? parseError.message : 'Failed to parse JSON')
            : undefined
        },
        { status: 400 }
      )
    }
    
    // In production, forward to real analytics service
    // For now, just log it
    console.log('📊 Analytics Event:', event)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Analytics API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : 'Unknown error')
          : undefined
      },
      { status: 500 }
    )
  }
}

