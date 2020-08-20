// a list of move helpers

import { ROBOT_MOVE, ROBOT_TURN } from './Constants'

export const createRobotMove = (robot, from, to) => ({
    type: ROBOT_MOVE,
    robot: { ...robot },
    from: { ...from },
    to: { ...to }
})

export const createRobotRotation = (robot, from, to) => ({
    type: ROBOT_TURN,
    robot: { ...robot },
    from: { ...from },
    to: { ...to }
})