import { createDirectionObject, genericTileObject, createFlagTile, createGrillTile, createHoleTile, createGearTile, createConveyorTile, createFastConveyorTile, createOutOfBoundsTile, createPlainTile, isTile } from './Tiles'
import { NORTH, EAST, SOUTH, WEST, CLOCKWISE, ANTICLOCKWISE, PLAIN, CONVEYOR, FLAG } from './Constants'

let directions = [
    undefined,
    [],
    [NORTH],
    [NORTH, EAST],
    [NORTH, SOUTH, WEST],
    [NORTH, SOUTH, EAST, WEST],
    [WEST, NORTH, SOUTH, EAST],
]

test('create direction object', () => {
    for (let direction of directions) {
        expect(createDirectionObject(direction)).toMatchSnapshot()
    }
})

test('generic tile object', () => {
    for (let direction of directions) {
        expect(genericTileObject({
            walls: direction,
            lasers: direction,
            pushers: direction
        })).toMatchSnapshot()
    }
})

test('flag tile object', () => {
    expect(createFlagTile({}, { flagNumber: 1 })).toMatchSnapshot()
    expect(createFlagTile({}, { flagNumber: 3 })).toMatchSnapshot()
    expect(createFlagTile({}, { flagNumber: 6 })).toMatchSnapshot()
})

test('grill tile object', () => {
    expect(createGrillTile({}, { level: 1 })).toMatchSnapshot()
    expect(createGrillTile({}, { level: 2 })).toMatchSnapshot()
})

test('hole tile object', () => {
    expect(createHoleTile({})).toMatchSnapshot()
})

test('gear tile object', () => {
    expect(createGearTile({})).toMatchSnapshot()
    expect(createGearTile({}, { rotationDirection: CLOCKWISE })).toMatchSnapshot()
    expect(createGearTile({}, { rotationDirection: ANTICLOCKWISE })).toMatchSnapshot()
})

test('conveyor tile object', () => {
    expect(createConveyorTile({})).toMatchSnapshot()
    expect(createConveyorTile({}, { exitDirection: NORTH, inputDirections: [NORTH, SOUTH] })).toMatchSnapshot()
    expect(createConveyorTile({}, { exitDirection: SOUTH, inputDirections: [] })).toMatchSnapshot()
})

test('fast conveyor tile object', () => {
    expect(createFastConveyorTile({})).toMatchSnapshot()
    expect(createFastConveyorTile({}, { exitDirection: NORTH, inputDirections: [NORTH, SOUTH] })).toMatchSnapshot()
    expect(createFastConveyorTile({}, { exitDirection: SOUTH, inputDirections: [] })).toMatchSnapshot()
})

test('out of bounds tile', () => {
    expect(createOutOfBoundsTile({ x: -1, y: -1 })).toMatchSnapshot()
})

test('is tile', () => {
    const plainTile = createPlainTile()

    expect(isTile(plainTile, [PLAIN])).toBe(true)
    expect(isTile(plainTile, [CONVEYOR])).toBe(false)

    const conveyorTile = createConveyorTile({}, { exitDirection: NORTH, inputDirections: [] })

    expect(isTile(conveyorTile, [CONVEYOR])).toBe(true)
    expect(isTile(conveyorTile, [CONVEYOR, PLAIN])).toBe(true)
    expect(isTile(conveyorTile, [PLAIN, FLAG])).toBe(false)
    expect(isTile(conveyorTile, [])).toBe(false)
})