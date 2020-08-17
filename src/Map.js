// a list of map updates

import { createPlainTile } from './Tiles'

export function createMap(x, y) {
    return new Array(y).fill(null).map(
        (yVal, yIndex) => new Array(x).fill(null).map((xVal, xIndex) => ({
            ...createPlainTile(),
            position: { y: yIndex, x: xIndex }
        }))
    )
}

export function getMapTile(map, coords) {

}

export function setMapTile(map, coords, tile) {
    map[coords.y][coords.x] = {
        ...tile,
        position: coords
    }
}

export function getMapTilesByType(map, type) {

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