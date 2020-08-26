// a list of robot updates

import { MAX_DAMAGE } from './Constants'
import { isSamePosition } from './Position'

export function createNewRobot(user, position, direction, colour) {
    return {
        position,
        direction,
        colour,
        poweredDown: false,
        damage: 0,
        upgrades: [],
        flags: [],
        checkpoint: position,
        lives: 3,
        user
    }
}

export function rawDamageRobot(robot, damage) {
    // robots cannot be damaged above MAX_DAMAGE
    robot.damage += Math.min(damage, MAX_DAMAGE - robot.damage)
}

export function isRobotDead(robot) {
    return robot.damage === MAX_DAMAGE
}

export function setRobotPosition(robot, position) {
    robot.position = position
}

export function rawListRobots(robots, listDead) {
    return Object.values(robots)
        .filter(robot => listDead ? true : robot.damage !== MAX_DAMAGE)
}

export function rawFindRobotAtPosition(robots, position) {
    for (const robot of rawListRobots(robots)) {
        if (isSamePosition(robot.position, position)) {
            return robot
        }
    }
}