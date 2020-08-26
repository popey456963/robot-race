// a list of state updates

import { countAllMapTiles } from './Map'
import { FLAG, MAX_DAMAGE } from './Constants'
import { arrayToObject } from './utils'
import { rawDamageRobot, isRobotDead, setRobotPosition, rawListRobots } from './Robot'
import { isSamePosition } from './Position'

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

export function setPlayerRegisters(state, user, registers) {
    state.players[user].registers = registers
}

export function findRobotAtPositionFromState(state, position) {
    for (const robot of listRobots(state)) {
        if (isSamePosition(robot.position, position)) {
            return robot
        }
    }
}

export function listRobots(state, listDead) {
    return rawListRobots(state.robot, listDead)
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