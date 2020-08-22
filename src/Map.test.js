const { createMap, setMapTile, getMapTile, getMapTilesByType, countAllMapTiles, canMoveInDirection } = require("./Map")
const { createHoleTile, createGearTile, createPlainTile } = require("./Tiles")
const { HOLE, PLAIN, GEAR, EAST, OUT_OF_BOUNDS } = require("./Constants")

function setupSmallMap() {
    const map = createMap(2, 2)

    setMapTile(map, { x: 1, y: 1 }, createHoleTile())
    setMapTile(map, { x: 0, y: 1 }, createGearTile())
    setMapTile(map, { x: 1, y: 0 }, createGearTile())

    return map
}

test('can create a map', () => {
    expect(createMap(1, 1)).toMatchSnapshot()
    expect(createMap(2, 3)).toMatchSnapshot()
    expect(createMap(3, 2)).toMatchSnapshot()
})

test('get / set map tile', () => {
    const map = setupSmallMap()

    setMapTile(map, { x: 1, y: 1 }, createHoleTile())
    setMapTile(map, { x: 0, y: 1 }, createGearTile())

    expect(map).toMatchSnapshot()

    expect(getMapTile(map, { x: 1, y: 1 }).type).toBe(HOLE)
    expect(getMapTile(map, { x: 0, y: 1 }).type).toBe(GEAR)
    expect(getMapTile(map, { x: 0, y: 0 }).type).toBe(PLAIN)

    expect(getMapTile(map, { x: 3, y: 0 }).type).toBe(OUT_OF_BOUNDS)
    expect(getMapTile(map, { x: 0, y: 3 }).type).toBe(OUT_OF_BOUNDS)
})

test('get map tiles by type', () => {
    const map = setupSmallMap()

    expect(getMapTilesByType(map, GEAR)).toMatchSnapshot()
    expect(getMapTilesByType(map, HOLE)).toMatchSnapshot()
    expect(getMapTilesByType(map, PLAIN)).toMatchSnapshot()
})

test('count tiles in map', () => {
    const map = setupSmallMap()

    expect(countAllMapTiles(map)).toMatchSnapshot()
})

test('can move in direction', () => {
    const map = createMap(2, 2)

    const plain = createPlainTile({ walls: [EAST] })
    setMapTile(map, { x: 0, y: 0 }, plain)

    expect(canMoveInDirection(map, { x: 0, y: 0 }, EAST)).toBe(false)
    expect(canMoveInDirection(map, { x: 0, y: 1 }, EAST)).toBe(true)
})