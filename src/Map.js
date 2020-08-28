// a list of map updates

import { createPlainTile, createOutOfBoundsTile, isTile, isSideBlocked } from './Tiles'
import { findRobotAtPositionFromState } from './State'
import { rawListRobots, rawFindRobotAtPosition } from './Robot'
import { isSamePosition, rotateDirectionClockwise, calculateMoveDestination, getAngleIndex } from './Position'
import { FLAG, NORTH, LASER_HALF, LASER_FULL, LASER_SINGLE, LASER_DOUBLE, LASER_SOURCE, LASER_BEAM, OUT_OF_BOUNDS } from './Constants'

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

export function getMapCell(map, coords) {
    if (map[coords.y]) {
        if (map[coords.y][coords.x]) {
            return map[coords.y][coords.x]
        } else {
            return { tile: createOutOfBoundsTile(coords) }
        }
    } else {
         return { tile: createOutOfBoundsTile(coords) }
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
    const nextTile = getMapTile(map, calculateMoveDestination(position, direction))

    if (tile.walls[direction] || nextTile.walls[rotateDirectionClockwise(direction, 2)]) {
        return false
    }
    return true
}

export function isSquareCheckpoint(tile, robot) {
    return isSamePosition(robot.checkpoint, tile.position)
}

export function isSquareTaken(tile, robot) {
    if (tile.type !== FLAG) return false

    return robot.flags.includes(tile.meta.flagNumber)
}

export function getCellInDirection(map, tile, direction) {
    const position = calculateMoveDestination(tile.position, direction)

    return getMapCell(map, position)
}

export function getDisplayMap(map, robots, currentPlayer, rotation) {
    let displayMap = map.map(row =>
        row.map(tile => ({
            tile,
            robot: rawFindRobotAtPosition(robots, tile.position),
            checkpoint: isSquareCheckpoint(tile, robots[currentPlayer]),
            taken: isSquareTaken(tile, robots[currentPlayer])
        }))
    )
    
    for (let row of displayMap) {
        for (let cell of row) {
            const sources = Object.keys(cell.tile.lasers)
                .filter(dir => [LASER_SINGLE, LASER_DOUBLE].includes(cell.tile.lasers[dir]))

            for (let source of sources) {
                const laserIntensity = cell.tile.lasers[source]
                let source_rotated = rotateDirectionClockwise(source, getAngleIndex(rotation))

                let curCell = cell
                while (!isTile(curCell.tile, OUT_OF_BOUNDS)) {
                    curCell.lasers = {
                        ...curCell.lasers,
                        [source]: {
                            length: curCell.robot ? LASER_HALF : LASER_FULL,
                            intensity: laserIntensity,
                            start: cell === curCell ? LASER_SOURCE : LASER_BEAM
                        }
                    }

                    // Does laser end on wall
                    if (isSideBlocked(curCell.tile, rotateDirectionClockwise(source_rotated, 2)) ||
                        isSideBlocked(getCellInDirection(displayMap, curCell.tile, source_rotated).tile, source_rotated) ||
                        curCell.robot) {
                        
                        break
                    }

                    curCell = getCellInDirection(displayMap, curCell.tile, source_rotated)
                }
            }
        }
    }

    return displayMap
}