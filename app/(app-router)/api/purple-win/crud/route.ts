import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb/db-connect'
import { PurpleWinGridCell } from '@/models/purple-win'
import Ably from 'ably'
import { CellData } from '@/types/types'

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { x, y, state, displayName } = body

    // Connect to database using Mongoose
    await dbConnect()

    // Update or insert the cell using Mongoose findOneAndUpdate
    const updatedCell = await PurpleWinGridCell.findOneAndUpdate(
      { x, y },
      {
        $set: {
          state,
          lastChangedBy: displayName,
          updatedAt: new Date(),
        },
        $inc: { flipCount: 1 },
        $setOnInsert: { createdAt: new Date() },
      },
      {
        upsert: true,
        new: true, // Return the updated document
        runValidators: true, // Run schema validators on update
      }
    )

    if (!updatedCell) {
      return Response.json({ success: false, message: 'Failed to update cell' }, { status: 500 })
    }

    // Publish to Ably
    const ably = new Ably.Rest(process.env.ABLY_API_KEY!)
    const channel = ably.channels.get('purple-win')

    const publishingCell: CellData = {
      x,
      y,
      state,
      lastChangedBy: displayName,
      flipCount: updatedCell.flipCount || 1,
      updatedAt: updatedCell.updatedAt || new Date(),
      _id: updatedCell._id.toString(),
    }

    await channel.publish('cell-update', {
      type: 'cell_update',
      cell: publishingCell,
    })

    return Response.json({
      success: true,
      cell: updatedCell,
    })
  } catch (error) {
    console.error('Error updating cell:', error)
    return Response.json({ success: false, message: 'Failed to update cell' }, { status: 500 })
  }
}
