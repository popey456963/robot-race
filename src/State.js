// a list of state updates

import { countAllMapTiles } from './Map'
import { FLAG, MAX_DAMAGE } from './Constants'
import { arrayToObject } from './utils'
import { rawDamageRobot, isRobotDead, setRobotPosition } from './Robot'

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

export function calculateRobotMove(state, robot, squares) {

}

export function calculateRobotRotate(state, robot, times) {

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