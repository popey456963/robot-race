// a list of move helpers

import {
    ROBOT_MOVE, ROBOT_TURN, MOVE_ONE, MOVE_TWO, MOVE_THREE,
    ROTATE_LEFT, ROTATE_RIGHT, U_TURN, BACK_UP, CONVEYOR, FAST_CONVEYOR, GEAR, CLOCKWISE, ROBOT_CHECKPOINT, FLAG, GRILL
} from './Constants'
import { canMoveInDirection, getMapTile } from './Map'
import { calculateMoveDestination, rotateDirectionClockwise, isRightAngle } from './Position'
import { findRobotAt, getPlayerRobot } from './State'

export const createRobotMove = (robot, from, to) => ({
    type: ROBOT_MOVE,
    robot: { ...robot },
    from: { ...from },
    to: { ...to }
})

export const createRobotRotation = (robot, from, to) => ({
    type: ROBOT_TURN,
    robot: { ...robot },
    from,
    to
})

export const createRobotCheckpoint = (robot, at, isNewFlag) => ({
    type: ROBOT_CHECKPOINT,
    robot: { ...robot },
    at: { ...at },
    isNewFlag
})

export const createRobotHealth = (robot, healthGain) => ({
    type: ROBOT_CHECKPOINT,
    robot: { ...robot },
    healthGain
})

export const createMove = (type, user, priority) => ({
    type,
    user,
    priority
})

export const getMovesByRobot = (moves, robot) =>
    moves.filter(move => move.robot.user === robot.user)

export function calculateRobotMove(state, robot, direction, squares) {
    let moves = []

    for (let i = 0; i < squares; i++) {
        moves = moves.concat(...calculateRobotMoveOneTile(state, robot, direction))
    }

    return moves
}

export function calculateRobotMoveOneTile(state, robot, direction) {
    let moves = []

    if (canMoveInDirection(state.map, robot.position, direction)) {
        // we can move in that direction.
        const newPosition = calculateMoveDestination(robot.position, direction)
        const otherRobot = findRobotAt(state, newPosition)
        const robotMove = createRobotMove(robot, robot.position, newPosition)

        if (otherRobot) {
            const otherMoves = calculateRobotMoveOneTile(state, otherRobot, direction)

            // if we found other robots but no other moves, we cannot complete this action.
            if (otherMoves.length) moves = moves.concat(...otherMoves, robotMove)
        } else {
            moves.push(robotMove)
        }
    }

    return moves
}

export function calculateRobotRotate(state, robot, times) {
    const newAngle = rotateDirectionClockwise(robot.direction, times)

    return [createRobotRotation(robot, robot.direction, newAngle)]
}

export function calculateConveyorMove(state, robot) {
    const conveyor = getMapTile(state.map, robot.position)

    if (![CONVEYOR, FAST_CONVEYOR].includes(conveyor.type)) {
        // this tile does not appear to be a conveyor
        return []
    }

    let moves = calculateRobotMove(state, robot, ceonvyor.meta.exitDirection)

    if (!moves.length) {
        // this robot was stuck on something
        return []
    }

    const newPosition = getMovesByRobot(moves, robot)[0]
    const newTile = getMapTile(state.map, newPosition)

    if (![CONVEYOR, FAST_CONVEYOR].includes(newTile.type)) {
        // new tile is not a conveyor
        return moves
    }

    const inDirection = rotateDirectionClockwise(conveyor.meta.exitDirection, 2)
    if (newTile.meta.inputDirections[inDirection]) {
        if (isRightAngle(inDirection, newTile.meta.exitDirection)) {
            const rotations = shouldTurnClockwise(inDirection, newTile.meta.exitDirection) ? 1 : 3
            const newDirection = rotateDirectionClockwise(robot.direction, rotations)
            moves.push(createRobotRotation(robot, robot.direction, newDirection))
        }
    }
}

export function calculateGearRotation(state, robot) {
    const gear = getMapTile(state.map, robot.position)

    if (![GEAR].includes(gear.type)) {
        // this tile is not a gear
        return []
    }

    let rotations = gear.meta.rotationDirection === CLOCKWISE ? 1 : 3
    const newDirection = rotateDirectionClockwise(robot.direction, rotations)

    return [createRobotRotation(robot, robot.direction, newDirection)]
}

export function calculateFlagActivation(state, robot) {
    const flag = getMapTile(state.map, robot.position)

    if (![FLAG].includes(flag.type)) {
        // this tile is not a flag
        return []
    }

    let isNewFlag = !robot.flags.includes(flag.meta.flagNumber)

    return [createRobotCheckpoint(robot, flag.position, isNewFlag)]
}

export function calculateGrillCheckpoint(state, robot) {
    const grill = getMapTile(state.map, robot.position)

    if (![GRILL].includes(grill.type)) {
        // this tile is not a grill
        return []
    }

    return [createRobotCheckpoint(robot, grill.position, false)]
}

export function calculateGrillHealing(state, robot) {
    const grill = getMapTile(state.map, robot.position)

    if (![GRILL].includes(grill.type)) {
        // this tile is not a grill
        return []
    }

    return [createRobotHealth(robot, 1)]
}

export function enactMove(state, move) {
    const robot = state.robots[move.user]

    switch(move.type) {
        case MOVE_THREE:
            return calculateRobotMove(state, robot, robot.direction, 3)
        case MOVE_TWO:
            return calculateRobotMove(state, robot, robot.direction, 2)
        case MOVE_ONE:
            return calculateRobotMove(state, robot, robot.direction, 1)
        case BACK_UP:
            return calculateRobotMove(state, robot, rotateDirectionClockwise(robot.direction, 2), 1)
        case ROTATE_RIGHT:
            return calculateRobotRotate(state, robot, 1)
        case ROTATE_LEFT:
            return calculateRobotRotate(state, robot, 3)
        case U_TURN:
            return calculateRobotRotate(state, robot, 2)
    }

    throw new Error('unknown card move' + JSON.stringify(move))
}

export function enactMoves(state, moves) {
    let results = []

    for (let move of moves) {
        console.log('move', move)
        results = results.concat(enactMove(state, move))
    }

    console.log(results)
}