import { PurpleWin } from './purple-win'

const GameOfLifePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="md:max-w-screen-xl mx-auto text-5xl mt-5">Purple Equals Win</h1>
      <div className="flex items-center justify-center w-full">
        <PurpleWin />
      </div>
      <div className="mx-2">
        <p>Game inspired by Reddit Place.</p>
        <p>
          The grid is shared by everyone, fill it with purple or green to score a point for one
          side.
        </p>
      </div>
    </div>
  )
}

export default GameOfLifePage
