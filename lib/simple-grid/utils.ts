export const calculateGridDimensions = (
  cellSize: number,
  viewWidth: number,
  viewHeight: number,
  minNumRows: number = 10
): { numCols: number; numRows: number } => {
  const numCols: number = Math.floor(viewWidth / cellSize) - 1
  const numRows: number = Math.max(Math.floor(viewHeight / cellSize), minNumRows)

  return { numCols, numRows }
}

export const getCellSize = ({
  defaultSize,
  phoneSize,
}: {
  defaultSize: number
  phoneSize: number
}): number => {
  const viewportWidth: number = window.innerWidth
  return viewportWidth < 768 ? phoneSize : defaultSize // use bigger cells on phone
}

export const isInBounds = (i: number, j: number, maxI: number, maxJ: number): boolean => {
  return i >= 0 && i < maxI && j >= 0 && j < maxJ
}
