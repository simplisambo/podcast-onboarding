import { NextRequest, NextResponse } from 'next/server'
import { findGuestByLastName } from '@/lib/notion'

export async function GET(
  request: NextRequest,
  { params }: { params: { lastName: string } }
) {
  try {
    const { lastName } = params
    
    if (!lastName) {
      return NextResponse.json(
        { error: 'Last name is required' },
        { status: 400 }
      )
    }

    const guestData = await findGuestByLastName(lastName)
    
    if (!guestData) {
      return NextResponse.json(
        { error: 'Guest not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(guestData)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 