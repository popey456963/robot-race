const { NORTH } = require("./Constants")
const { createNewRobot, rawDamageRobot, isRobotDead, setRobotPosition } = require("./Robot")

const robot = createNewRobot('example', { x: 1, y: 1 }, NORTH)

test('create new robot', () => {
    expect(robot).toMatchSnapshot()
})

test('damage robot', () => {
    const testRobot = { ...robot }

    expect(testRobot.damage).toBe(0)

    rawDamageRobot(testRobot, 2)

    expect(testRobot.damage).toBe(2)

    rawDamageRobot(testRobot, 100)

    expect(testRobot.damage).toBe(10)
})

test('is robot dead', () => {
    const testRobot = { ...robot }

    expect(isRobotDead(testRobot)).toBe(false)
    rawDamageRobot(testRobot, 100)
    expect(isRobotDead(testRobot)).toBe(true)
})

test('can robot be moved', () => {
    const testRobot = { ...robot }

    expect(testRobot.position).toMatchSnapshot()
    expect(setRobotPosition(robot, { x: 1, y: 2 })).toMatchSnapshot()
})