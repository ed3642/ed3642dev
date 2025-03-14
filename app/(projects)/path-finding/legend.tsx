import React from 'react'

enum COLORS {
  empty = 0,
  source = 1,
  dest = 2,
  wall = 3,
  explored = 4,
  path = 5,
}

const colorMapping = {
  [COLORS.empty]: '#ccc', // light gray
  [COLORS.source]: '#ef4444', // red
  [COLORS.dest]: '#22c55e', // green
  [COLORS.wall]: 'transparent',
  [COLORS.explored]: '#708090', // dark grey
  [COLORS.path]: '#3b82f6', // blue
}

const Legend: React.FC = () => {
  return (
    <div className="flex flex-col items-start">
      <h2 className="text-xl mb-2">Legend</h2>
      <div className="flex items-center mb-1">
        <div className="w-4 h-4 mr-2" style={{ backgroundColor: colorMapping[COLORS.empty] }}></div>
        <span>Empty</span>
      </div>
      <div className="flex items-center mb-1">
        <div
          className="w-4 h-4 mr-2"
          style={{ backgroundColor: colorMapping[COLORS.source] }}
        ></div>
        <span>Source</span>
      </div>
      <div className="flex items-center mb-1">
        <div className="w-4 h-4 mr-2" style={{ backgroundColor: colorMapping[COLORS.dest] }}></div>
        <span>Destination</span>
      </div>
      <div className="flex items-center mb-1">
        <div
          className="w-4 h-4 mr-2"
          style={{ backgroundColor: colorMapping[COLORS.explored] }}
        ></div>
        <span>Explored</span>
      </div>
      <div className="flex items-center mb-1">
        <div className="w-4 h-4 mr-2" style={{ backgroundColor: colorMapping[COLORS.path] }}></div>
        <span>Path</span>
      </div>
    </div>
  )
}

export { Legend, COLORS, colorMapping }
