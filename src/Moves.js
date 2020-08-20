// a list of move helpers

import {
    ROBOT_MOVE, ROBOT_TURN, MOVE_ONE, MOVE_TWO, MOVE_THREE,
    ROTATE_LEFT, ROTATE_RIGHT, U_TURN, BACK_UP
} from './Constants'
import { canMoveInDirection } from './Map'
import { calculateMoveDestination, rotateDirectionClockwise } from './Position'
import { findRobotAt } from './State'

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

export const createMove = (type, user, priority) => ({
    type,
    user,
    priority
})

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

}

export function calculateGearRotation(state, robot) {

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