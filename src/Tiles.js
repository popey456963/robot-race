// a list of tile helpers

import {
    PLAIN, FLAG, GRILL, HOLE, GEAR, CONVEYOR,
    FAST_CONVEYOR, OUT_OF_BOUNDS
} from './Constants'

export const createDirectionObject = (directions = []) =>
    directions.reduce((acc, val) => ({ ...acc, [val]: true }), {})

export const genericTileObject = ({ walls, lasers, pushers } = {}) => ({
    walls: createDirectionObject(walls),
    lasers: createDirectionObject(lasers),
    pushers: createDirectionObject(pushers)
})

export const createPlainTile = (generic) => ({
    type: PLAIN,
    ...genericTileObject(generic)
})

export const createFlagTile = (generic, { flagNumber }) => ({
    type: FLAG,
    ...genericTileObject(generic),
    meta: { flagNumber }
})

export const createGrillTile = (generic, { level }) => ({
    type: GRILL,
    ...genericTileObject(generic),
    meta: { level }
})

export const createHoleTile = (generic) => ({
    type: HOLE,
    ...genericTileObject(generic),
})

export const createGearTile = (generic, { rotationDirection } = {}) => ({
    type: GEAR,
    ...genericTileObject(generic),
    meta: { rotationDirection }
})

export const createConveyorTile = (generic, { exitDirection, inputDirections } = {}) => ({
    type: CONVEYOR,
    ...genericTileObject(generic),
    meta: { exitDirection, inputDirections }
})

export const createFastConveyorTile = (generic, { exitDirection, inputDirections } = {}) => ({
    type: FAST_CONVEYOR,
    ...genericTileObject(generic),
    meta: { exitDirection, inputDirections }
})

export const createOutOfBoundsTile = (position) => ({
    type: OUT_OF_BOUNDS,
    ...genericTileObject(),
    position   
})

export const isSideBlocked = (tile, direction) => {
    return tile.walls[direction] || tile.lasers[direction] || tile.pushers[direction] ? true : false
}

export const isTile = (tile, types) => types.includes(tile.type)