// a list of map updates

import { createPlainTile, createOutOfBoundsTile } from './Tiles'
import { findRobotAtPositionFromState } from './State'
import { rawListRobots, rawFindRobotAtPosition } from './Robot'
import { isSamePosition } from './Position'
import { FLAG } from './Constants'

export function createMap(x, y) {
    return new Array(y).fill(null).map(
        (yVal, yIndex) => new Array(x).fill(null).map((xVal, xIndex) => ({
            ...createPlainTile(),
            position: { y: yIndex, x: xIndex }
        }))
    )
}

export function getMapTile(map, coords) {
    if (map[coords.y]) {
        if (map[coords.y][coords.x]) {
            return map[coords.y][coords.x]
        } else {
            return createOutOfBoundsTile(coords)
        }
    } else {
         return createOutOfBoundsTile(coords)
    }
}

export function setMapTile(map, coords, tile) {
    map[coords.y][coords.x] = {
        ...tile,
        position: coords
    }
}

export function getMapTilesByType(map, type) {
    const tiles = []

    for (const row of map) {
      for (const tile of row) {
        if (tile.type === type) tiles.push(tile)
      }
    }
  
    return tiles
}

export function countAllMapTiles(map) {
    let counts = {}

    for (let row of map) {
        for (let item of row) {
            counts[item.type] = (counts[item.type] || 0) + 1
        }
    }

    return counts
}

export function canMoveInDirection(map, position, direction) {
    const tile = getMapTile(map, position)

    if (tile.walls[direction]) return false

    return true
}

export function isSquareCheckpoint(tile, robot) {
    return isSamePosition(robot.checkpoint, tile.position)
}

export function isSquareTaken(tile, robot) {
    if (tile.type !== FLAG) return false

    return robot.flags.includes(tile.meta.flagNumber)
}

export function getDisplayMap(map, robots, currentPlayer) {
    let displayMap = map.map(row =>
        row.map(tile => ({
            tile,
            robot: rawFindRobotAtPosition(robots, tile.position),
            checkpoint: isSquareCheckpoint(tile, robots[currentPlayer]),
            taken: isSquareTaken(tile, robots[currentPlayer])
        }))
    )

    return displayMap
}