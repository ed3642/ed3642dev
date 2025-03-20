import dotenv from 'dotenv'
import { PurpleWinGridCell } from '../models/purple-win'
import dbConnect from '../lib/mongodb/db-connect'

dotenv.config({ path: '.env.local' })

// seed a 10x10 grid of cells for the Purple Win game
async function seedPurpleWinGrid() {
  try {
    const mongoose = await dbConnect()
    console.log('MongoDB connected successfully')

    const existingCount = await PurpleWinGridCell.countDocuments()
    console.log(`Found ${existingCount} existing cells`)

    if (existingCount > 0) {
      console.log('Clearing existing grid data...')
      await PurpleWinGridCell.deleteMany({})
    }

    const gridSize = 10
    const bulkOps = []

    console.log(`Creating ${gridSize}x${gridSize} grid...`)

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const state = Math.random() > 0.5 ? 1 : 0 // coinflip the state

        bulkOps.push({
          insertOne: {
            document: {
              x,
              y,
              state,
              lastChangedBy: 'seed-script',
              flipCount: 0,
            },
          },
        })
      }
    }

    await PurpleWinGridCell.bulkWrite(bulkOps)

    await mongoose.disconnect()
    console.log('MongoDB disconnected')
    console.log('Seed operation completed successfully!')
  } catch (error) {
    console.error('Error seeding the database:', error)
    process.exit(1)
  }
}

seedPurpleWinGrid()
