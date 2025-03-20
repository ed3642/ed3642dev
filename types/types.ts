export interface CellMetadata {
  lastChangedBy: string
  flipCount: number
  updatedAt: string
}

export interface CellData extends CellMetadata {
  x: number
  y: number
  state: number
  _id: string
}
