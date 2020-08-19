// a list of position updates

import { NORTH, EAST, SOUTH, WEST, DIRECTIONS } from './Constants'

// move in a direction from a position
export function calculateMoveDestination(position, direction) {
    const newPosition = { ...position }

    if (direction === NORTH) newPosition.y -= 1
    if (direction === SOUTH) newPosition.y += 1
    if (direction === EAST) newPosition.x += 1
    if (direction === WEST) newPosition.x -= 1

    return newPosition
}

export function getDirectionIndex(direction) {
    const directionIndex = DIRECTIONS.indexOf(direction)
    if (directionIndex === -1) throw new Error('invalid direction', direction)

    return directionIndex
}

// rotate a direction by 90 degrees
export function rotateDirectionClockwise(direction, times = 1) {
    const directionIndex = getDirectionIndex(direction)

    return DIRECTIONS[(directionIndex + times) % DIRECTIONS.length]
}

// returns true if angles are 90 degrees from one another
export function isRightAngle(a, b) {
    const aDirectionIndex = getDirectionIndex(a)
    const bDirectionIndex = getDirectionIndex(b)
    
    return Math.abs(aDirectionIndex - bDirectionIndex) % 2 === 1
}