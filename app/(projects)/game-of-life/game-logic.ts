import { isInBounds } from '@/lib/simple-grid/utils'

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
]

export const getLiveNeighbors = (
  grid: number[][],
  x: number,
  y: number,
  numRows: number,
  numCols: number
): number => {
  let count = 0
  for (const [dx, dy] of directions) {
    const nX = x + dx
    const nY = y + dy
    if (isInBounds(nX, nY, numRows, numCols) && grid[nX][nY] === 1) {
      count += 1
    }
  }
  return count
}

export const tickGrid = (grid: number[][], numRows: number, numCols: number): number[][] => {
  const newGrid = grid.map((row) => [...row])
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      const neighborCount = getLiveNeighbors(grid, i, j, numRows, numCols)
      if (grid[i][j] === 1) {
        if (neighborCount < 2 || neighborCount > 3) {
          newGrid[i][j] = 0
        }
      } else {
        if (neighborCount === 3) {
          newGrid[i][j] = 1
        }
      }
    }
  }
  return newGrid
}
