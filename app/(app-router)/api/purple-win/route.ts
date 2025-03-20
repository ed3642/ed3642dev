import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb/db-connect'
import { PurpleWinGridCell } from '@/models/purple-win'
import { auth } from '@/lib/authentication/auth'

export async function GET() {
  try {
    await dbConnect()

    const cells = await PurpleWinGridCell.find({}).lean()

    return NextResponse.json({ success: true, cells })
  } catch (error) {
    console.error('Error fetching purple win grid:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch grid data' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'You must be signed in to update cells' },
        { status: 401 }
      )
    }

    const { x, y, state, displayName } = await request.json()

    if (typeof x !== 'number' || typeof y !== 'number' || ![0, 1].includes(state)) {
      return NextResponse.json({ success: false, message: 'Invalid cell data' }, { status: 400 })
    }

    await dbConnect()

    const cell = await PurpleWinGridCell.findOne({ x, y })

    const userName = displayName || 'anon'

    if (cell) {
      cell.state = state
      cell.lastChangedBy = userName
      cell.flipCount += 1
      await cell.save()
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating purple win cell:', error)
    return NextResponse.json({ success: false, message: 'Failed to update cell' }, { status: 500 })
  }
}
