import {
    CLOCKWISE, ANTICLOCKWISE, DIRECTIONS,
    NORTH, SOUTH, EAST, WEST
} from '../Constants'
import {
    createMap, setMapTile, countAllMapTiles
} from '../Map'
import {
    createFlagTile, createGrillTile, createHoleTile, createGearTile,
    createConveyorTile, createFastConveyorTile, createDirectionObject
} from '../Tiles'

import log from '../Logger'

export default function createTestMap() {
    const map = createMap(12, 12)

    setMapTile(map, { y: 5, x: 3 }, createFlagTile({}, { flagNumber: 1 }))
    setMapTile(map, { y: 6, x: 3 }, createFlagTile({}, { flagNumber: 2 }))
    setMapTile(map, { y: 7, x: 3 }, createFlagTile({}, { flagNumber: 3 }))
    setMapTile(map, { y: 8, x: 3 }, createFlagTile({}, { flagNumber: 4 }))
    setMapTile(map, { y: 9, x: 3 }, createFlagTile({}, { flagNumber: 5 }))
    setMapTile(map, { y: 10, x: 3 }, createFlagTile({}, { flagNumber: 6 }))

    setMapTile(map, { y: 6, x: 4 }, createGrillTile({}, { level: 1 }))
    setMapTile(map, { y: 7, x: 4 }, createGrillTile({}, { level: 2 }))
    setMapTile(map, { y: 8, x: 4 }, createHoleTile())
    setMapTile(map, { y: 9, x: 4 }, createGearTile({}, { rotationDirection: CLOCKWISE }))
    setMapTile(map, { y: 10, x: 4 }, createGearTile({}, { rotationDirection: ANTICLOCKWISE }))

    setMapTile(map, { y: 1, x: 3 }, createConveyorTile({}, { exitDirection: NORTH, inputDirections: createDirectionObject([SOUTH]) }))
    setMapTile(map, { y: 2, x: 3 }, createConveyorTile({}, { exitDirection: EAST, inputDirections: createDirectionObject([WEST]) }))
    setMapTile(map, { y: 3, x: 3 }, createConveyorTile({}, { exitDirection: SOUTH, inputDirections: createDirectionObject([NORTH]) }))
    setMapTile(map, { y: 4, x: 3 }, createConveyorTile({}, { exitDirection: WEST, inputDirections: createDirectionObject([EAST]) }))

    setMapTile(map, { y: 1, x: 4 }, createConveyorTile({}, { exitDirection: NORTH, inputDirections: createDirectionObject([EAST]) }))
    setMapTile(map, { y: 2, x: 4 }, createConveyorTile({}, { exitDirection: EAST, inputDirections: createDirectionObject([SOUTH]) }))
    setMapTile(map, { y: 3, x: 4 }, createConveyorTile({}, { exitDirection: SOUTH, inputDirections: createDirectionObject([WEST]) }))
    setMapTile(map, { y: 4, x: 4 }, createConveyorTile({}, { exitDirection: WEST, inputDirections: createDirectionObject([NORTH]) }))

    setMapTile(map, { y: 1, x: 5 }, createConveyorTile({}, { exitDirection: NORTH, inputDirections: createDirectionObject([WEST]) }))
    setMapTile(map, { y: 2, x: 5 }, createConveyorTile({}, { exitDirection: EAST, inputDirections: createDirectionObject([NORTH]) }))
    setMapTile(map, { y: 3, x: 5 }, createConveyorTile({}, { exitDirection: SOUTH, inputDirections: createDirectionObject([EAST]) }))
    setMapTile(map, { y: 4, x: 5 }, createConveyorTile({}, { exitDirection: WEST, inputDirections: createDirectionObject([SOUTH]) }))

    setMapTile(map, { y: 1, x: 6 }, createFastConveyorTile({}, { exitDirection: NORTH, inputDirections: createDirectionObject([SOUTH]) }))
    setMapTile(map, { y: 2, x: 6 }, createFastConveyorTile({}, { exitDirection: EAST, inputDirections: createDirectionObject([WEST]) }))
    setMapTile(map, { y: 3, x: 6 }, createFastConveyorTile({}, { exitDirection: SOUTH, inputDirections: createDirectionObject([NORTH]) }))
    setMapTile(map, { y: 4, x: 6 }, createFastConveyorTile({}, { exitDirection: WEST, inputDirections: createDirectionObject([EAST]) }))

    setMapTile(map, { y: 1, x: 7 }, createFastConveyorTile({}, { exitDirection: NORTH, inputDirections: createDirectionObject([EAST]) }))
    setMapTile(map, { y: 2, x: 7 }, createFastConveyorTile({}, { exitDirection: EAST, inputDirections: createDirectionObject([SOUTH]) }))
    setMapTile(map, { y: 3, x: 7 }, createFastConveyorTile({}, { exitDirection: SOUTH, inputDirections: createDirectionObject([WEST]) }))
    setMapTile(map, { y: 4, x: 7 }, createFastConveyorTile({}, { exitDirection: WEST, inputDirections: createDirectionObject([NORTH]) }))

    setMapTile(map, { y: 1, x: 8 }, createFastConveyorTile({}, { exitDirection: NORTH, inputDirections: createDirectionObject([WEST]) }))
    setMapTile(map, { y: 2, x: 8 }, createFastConveyorTile({}, { exitDirection: EAST, inputDirections: createDirectionObject([NORTH]) }))
    setMapTile(map, { y: 3, x: 8 }, createFastConveyorTile({}, { exitDirection: SOUTH, inputDirections: createDirectionObject([EAST]) }))
    setMapTile(map, { y: 4, x: 8 }, createFastConveyorTile({}, { exitDirection: WEST, inputDirections: createDirectionObject([SOUTH]) }))

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        const inputDirections = []
        if (j !== 0) inputDirections.push(DIRECTIONS[(i + 1) % 4])
        if (j !== 1) inputDirections.push(DIRECTIONS[(i + 2) % 4])
        if (j !== 2) inputDirections.push(DIRECTIONS[(i + 3) % 4])

        const conveyorType = i % 2 ? createFastConveyorTile : createConveyorTile
        const conveyorTile = conveyorType({}, {
          exitDirection: DIRECTIONS[i],
          inputDirections: createDirectionObject(inputDirections)
        })

        setMapTile(map, { y: 5 + i, x: 5 + j }, conveyorTile)
      }
    }

    const tileCount = countAllMapTiles(map)
    log.info({ tileCount }, `Created a ${map.length} x ${map[0].length} map.`)

    return map
}