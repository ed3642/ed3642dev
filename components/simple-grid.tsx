'use client'

import { COLORS } from '@/app/(projects)/path-finding/legend'
import { cn } from '@/lib/utils'

interface SimpleGridProps {
  grid: number[][]
  toggleCell: (rowIndex: number, colIndex: number) => void
  cellSize: number
  gap: number
  colors: { [key: number]: string }
  draggableValues?: number[]
  onDragStart?: (rowIndex: number, colIndex: number) => void
  onDragOver?: (e: React.DragEvent) => void
  onDrop?: (rowIndex: number, colIndex: number) => void
  cellClassName?: string
  onTouchStart?: (rowIndex: number, colIndex: number) => void
  draggedCell?: { type: COLORS; i: number; j: number } | null
  cellRenderer?: (rowIndex: number, colIndex: number, color: string) => React.ReactNode
}

const SimpleGrid: React.FC<SimpleGridProps> = ({
  grid,
  toggleCell,
  cellSize,
  gap,
  colors,
  draggableValues,
  onDragStart,
  onDragOver,
  onDrop,
  cellClassName,
  onTouchStart,
  draggedCell,
  cellRenderer,
}) => {
  const gridTemplateColumns = `repeat(${grid[0].length}, ${cellSize}px)`
  const gridTemplateRows = `repeat(${grid.length}, ${cellSize}px)`

  return (
    <div className="flex justify-center items-center flex-col bg-slate-800">
      <div className="flex w-full overflow-hidden justify-center items-center">
        <div
          className="grid"
          style={{
            gridTemplateColumns,
            gridTemplateRows,
          }}
        >
          {grid.map((row: number[], i: number) => (
            <div key={i} className="contents">
              {row.map((value: number, j: number) => {
                const color = colors[value] || colors[0] // default to first color

                return (
                  <div
                    key={j}
                    className={`box-border ${
                      draggableValues?.includes(value) ? 'cursor-grab' : 'cursor-pointer'
                    }`}
                    style={{
                      width: `${cellSize}px`,
                      height: `${cellSize}px`,
                      padding: `${gap}px`,
                    }}
                    onClick={cellRenderer ? undefined : () => toggleCell(i, j)}
                    draggable={draggableValues?.includes(value)}
                    onDragStart={onDragStart ? () => onDragStart(i, j) : undefined}
                    onDragOver={onDragOver ? (e) => onDragOver(e) : undefined}
                    onDrop={onDrop ? () => onDrop(i, j) : undefined}
                    onTouchStart={onTouchStart ? () => onTouchStart(i, j) : undefined}
                  >
                    {cellRenderer ? (
                      cellRenderer(i, j, color)
                    ) : (
                      <div
                        className={cn(
                          'w-full h-full flex justify-center items-center',
                          cellClassName,
                          draggedCell?.i === i && draggedCell?.j === j ? 'brightness-50' : ''
                        )}
                        style={{
                          backgroundColor: color,
                        }}
                      ></div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { SimpleGrid }
