// a list of move helpers

import {
    ROBOT_MOVE, ROBOT_TURN, MOVE_ONE, MOVE_TWO, MOVE_THREE,
    ROTATE_LEFT, ROTATE_RIGHT, U_TURN, BACK_UP, CONVEYOR, FAST_CONVEYOR, GEAR, CLOCKWISE, ROBOT_CHECKPOINT, FLAG, GRILL, ROBOT_HEALTH, HOLE, OUT_OF_BOUNDS, MAX_DAMAGE
} from './Constants'
import { canMoveInDirection, getMapTile } from './Map'
import { calculateMoveDestination, rotateDirectionClockwise, isRightAngle } from './Position'
import { findRobotAtPositionFromState, getPlayerRobot, damageRobot } from './State'
import { shouldTurnClockwise } from './Game'
import { isTile } from './Tiles'
import cloneDeep from 'clone-deep'

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

export const createRobotCheckpoint = (robot, at, isNewFlag = false, flag = -1) => ({
    type: ROBOT_CHECKPOINT,
    robot: { ...robot },
    at: { ...at },
    isNewFlag,
    flag
})

export const createRobotHealth = (robot, healthGain) => ({
    type: ROBOT_HEALTH,
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
        const changes = calculateRobotMoveOneTile(state, robot, direction)
        moves = moves.concat(...changes)

        for (let change of changes) {
            if (change.type === ROBOT_MOVE) {
                enactRobotMoveEvent(state, change)
            } else if (change.type === ROBOT_HEALTH) {
                enactRobotHealthEvent(state, change)
            } else {
                throw new Error('unexpected return value from calcualteRobotMoveOneTile')
            }
        }
    }

    return moves
}


export function calculateRobotMoveOneTile(state, robot, direction) {
    let moves = []

    if (canMoveInDirection(state.map, robot.position, direction)) {
        // we can move in that direction.
        const newPosition = calculateMoveDestination(robot.position, direction)
        const otherRobot = findRobotAtPositionFromState(state, newPosition)
        const robotMove = createRobotMove(robot, robot.position, newPosition)

        if (otherRobot) {
            const otherMoves = calculateRobotMoveOneTile(state, otherRobot, direction)

            // if we found other robots but no other moves, we cannot complete this action.
            if (otherMoves.length) moves = moves.concat(...otherMoves, robotMove)
        } else {
            moves.push(robotMove)
        }

        const newRobot = cloneDeep(robot)
        newRobot.position = newPosition

        if (calculateSafeSquare(state, newRobot).length) {
            moves = moves.concat(calculateSafeSquare(state, newRobot))
        }
    }

    return moves
}


export function calculateRobotRotate(state, robot, times) {
    const newAngle = rotateDirectionClockwise(robot.direction, times)
    const rotationEvent = createRobotRotation(robot, robot.direction, newAngle)

    enactRobotTurnEvent(state, rotationEvent)

    return [rotationEvent]
}

export function calculateSafeSquare(state, robot) {
    const tile = getMapTile(state.map, robot.position)


    if (isTile(tile, [HOLE, OUT_OF_BOUNDS])) {
        return [createRobotHealth(robot, -Infinity)]
    }

    return []
}

export function calculateConveyorMove(state, robot) {
    const conveyor = getMapTile(state.map, robot.position)

    if (![CONVEYOR, FAST_CONVEYOR].includes(conveyor.type)) {
        // this tile does not appear to be a conveyor
        return []
    }

    let moves = calculateRobotMove(state, robot, conveyor.meta.exitDirection)

    if (!moves.length) {
        // this robot was stuck on something
        return []
    }

    const robotMoves = getMovesByRobot(moves, robot)
    const newPosition = robotMoves[robotMoves.length - 1]
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
            const rotationEvent = createRobotRotation(robot, robot.direction, newDirection)
            moves.push(rotationEvent)

            enactRobotTurnEvent(state, rotationEvent)
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
    const rotationEvent = createRobotRotation(robot, robot.direction, newDirection)

    enactRobotTurnEvent(state, rotationEvent)

    return [rotationEvent]
}

export function calculateFlagActivation(state, robot) {
    const flag = getMapTile(state.map, robot.position)

    if (![FLAG].includes(flag.type)) {
        // this tile is not a flag
        return []
    }

    let isNewFlag = !robot.flags.includes(flag.meta.flagNumber)
    const checkpointEvent = createRobotCheckpoint(robot, flag.position, isNewFlag, flag.meta.flagNumber)

    enactRobotCheckpointEvent(state, checkpointEvent)

    return [checkpointEvent]
}

export function calculateGrillCheckpoint(state, robot) {
    const grill = getMapTile(state.map, robot.position)

    if (![GRILL].includes(grill.type)) {
        // this tile is not a grill
        return []
    }
    const checkpointEvent = createRobotCheckpoint(robot, grill.position, false)

    enactRobotCheckpointEvent(state, checkpointEvent)

    return [checkpointEvent]
}

export function calculateGrillHealing(state, robot) {
    const grill = getMapTile(state.map, robot.position)

    if (![GRILL].includes(grill.type)) {
        // this tile is not a grill
        return []
    }

    const robotHealthEvent = createRobotHealth(robot, 1)
    enactRobotHealthEvent(state, robotHealthEvent)

    return [robotHealthEvent]
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
        default:
            throw new Error('unknown card move' + JSON.stringify(move))
    }
}

export function enactRobotMoveEvent(state, move) {
    const robot = getPlayerRobot(state, move.robot.user)

    robot.position = move.to
}

export function enactRobotTurnEvent(state, move) {
    const robot = getPlayerRobot(state, move.robot.user)

    robot.direction = move.to
}

export function enactRobotCheckpointEvent(state, move) {
    const robot = getPlayerRobot(state, move.robot.user)
    
    robot.checkpoint = move.at
    if (move.isNewFlag) robot.flags.push(move.flag)
}

export function enactRobotHealthEvent(state, move) {
    const robot = getPlayerRobot(state, move.robot.user)

    damageRobot(state, robot, -(move.healthGain))
}

export function enactMoves(state, moves) {
    let results = []

    for (let move of moves) {
        console.log('move', move)
        results = results.concat(enactMove(state, move))
    }

    // results can be used to see what happened.
}