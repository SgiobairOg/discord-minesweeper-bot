import { type APIApplicationCommandOptionChoice } from 'discord.js'

const ALLLEVELS = [0, 1, 2, 3] as const
type GameLevels = typeof ALLLEVELS
type GameLevel = GameLevels[number]

const BOMBPROBABILITIES = [0.1, 0.2, 0.3, 0.8]

export interface GameOptionsInput {
  rows?: number
  cols?: number
  level?: number
}
type GameOptions = Required<GameOptionsInput>
type GameGrid = Array<Array<string | number>>

const ROWS = 9
const COLS = 9
const LEVEL: GameLevel = 1
const CHARMAP = {
  X: ':firecracker:',
  0: ':black_circle:',
  1: ':one:',
  2: ':two:',
  3: ':three:',
  4: ':four:',
  5: ':five:',
  6: ':six:',
  7: ':seven:',
  8: ':eight:'
}
const defaults: GameOptions = {
  rows: ROWS,
  cols: COLS,
  level: LEVEL
}

const randomBoolean = (probability: number): boolean => Math.random() < probability

const gridValue = (grid: GameGrid, row: number, cell: number): string | number | null => {
  if (grid === undefined) return null
  if (grid[row] === undefined) return null
  if (grid[row][cell] === undefined) return null
  return grid[row][cell]
}

const bombCount = (grid: GameGrid, row: number, cell: number): number => {
  const neighboringGrid = [
    gridValue(grid, row - 1, cell - 1), gridValue(grid, row - 1, cell), gridValue(grid, row - 1, cell + 1),
    gridValue(grid, row, cell - 1), gridValue(grid, row, cell + 1),
    gridValue(grid, row + 1, cell - 1), gridValue(grid, row + 1, cell), gridValue(grid, row + 1, cell + 1)
  ]
  return neighboringGrid.filter((value) => value).length
}

export const getLevelOptions = (): Array<APIApplicationCommandOptionChoice<string>> => [
  { name: 'Easy', value: '0' },
  { name: 'Normal', value: '1' },
  { name: 'Hard', value: '2' },
  { name: 'Exxtra', value: '3' }
]

export const getArmedGrid = (options: GameOptionsInput = {}): string => {
  const gameOptions: GameOptions = { ...defaults, ...options }
  const { rows, cols, level } = gameOptions

  console.info(`Generating new Level ${level}, ${rows} x ${cols} game.`)

  const baseGrid: GameGrid = new Array(rows).fill(new Array(cols).fill(0))

  return baseGrid
    .map(row => {
      return row.map(() => randomBoolean(BOMBPROBABILITIES[level]) ? 'X' : 0)
    })
    .map((row, rowNum, grid) => {
      return row.map((cell, cellNum: number) => {
        if (cell !== 'X') {
          return bombCount(grid, rowNum, cellNum)
        }
        return cell
      })
    })
    .map(row => {
      return row.map(cell => `||${CHARMAP[cell as keyof typeof CHARMAP]}||`).join(' ')
    })
    .join('\n')
}
