// a list of robot updates

import { MAX_DAMAGE } from './Constants'

export function createNewRobot(user, position, direction) {
    return {
        position,
        direction,
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