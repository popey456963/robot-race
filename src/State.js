// a list of state updates

import { countAllMapTiles, canMoveInDirection } from './Map'
import { FLAG, MAX_DAMAGE } from './Constants'
import { arrayToObject } from './utils'
import { rawDamageRobot, isRobotDead, setRobotPosition } from './Robot'
import { calculateMoveDestination, isSamePosition, rotateDirectionClockwise } from './Position'
import { createRobotMove, createRobotRotation } from './Moves'

export function initialiseState(map, robots, players, meta = {}) {
    robots = arrayToObject(robots)
    players = arrayToObject(players.map(player => ([player, { hand: [] }])))
    const state = {
        map, robots, players
    }

    const tileCount = countAllMapTiles(state.map)

    state.meta = {
        flagCount: tileCount[FLAG],
        ...meta
    }

    return state
}

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

export function enactMoves(state, moves) {

}

export function setPlayerRegisters(state, user, registers) {
    state.players[user].registers = registers
}

export function findRobotAt(state, position) {
    for (const robot of listRobots(state)) {
        if (isSamePosition(robot.position, position)) {
            return robot
        }
    }
}

export function listRobots(state, listDead) {
    return Object.values(state.robots)
        .filter(robot => listDead ? true : robot.damage !== MAX_DAMAGE)
}

export function damageRobot(state, robot, amount) {
    rawDamageRobot(robot, amount)

    if (isRobotDead(robot)) {
        setRobotPosition(robot, { x: -1, y: -1 })
        setPlayerRegisters(state, robot.user, [])
    }
}

export function listUsers(state) {
    return Object.keys(state.players)
}

export function getPlayerRobot(state, user) {
    return state.robots[user]
}

export function getPlayerCards(state, user) {
    return state.players[user].registers
}