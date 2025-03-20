import mongoose from 'mongoose'

export interface IPurpleWinGridCell extends mongoose.Document {
  x: number
  y: number
  state: number // 0 = green, 1 = purple
  lastChangedBy: string // string representing who last changed the cell
  flipCount: number
  updatedAt: Date
  createdAt: Date
}

const purpleWinSchema = new mongoose.Schema(
  {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    state: {
      type: Number,
      required: true,
      enum: [0, 1], // 0 = green, 1 = purple
      default: 0,
    },
    lastChangedBy: {
      type: String,
    },
    flipCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true, // add createdAt and updatedAt fields
  }
)

purpleWinSchema.index({ x: 1, y: 1 }, { unique: true })

// singleton export of model
export const PurpleWinGridCell =
  mongoose.models.PurpleWinGridCell ||
  mongoose.model<IPurpleWinGridCell>('PurpleWinGridCell', purpleWinSchema)
