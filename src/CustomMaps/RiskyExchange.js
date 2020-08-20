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

export default function createRiskyExchange() {
    const map = createMap(12, 16)

    setMapTile(map, { x: 8, y: 1 }, createFlagTile({}, { flagNumber: 1 }))
    setMapTile(map, { x: 1, y: 4 }, createFlagTile({}, { flagNumber: 2 }))
    setMapTile(map, { x: 10, y: 7 }, createFlagTile({}, { flagNumber: 3 }))




    
    setMapTile(map, { x: 4, y: 6 }, createGrillTile({}, { level: 1 }))
    setMapTile(map, { x: 4, y: 7 }, createGrillTile({}, { level: 2 }))
    setMapTile(map, { x: 4, y: 8 }, createHoleTile())
    setMapTile(map, { x: 4, y: 9 }, createGearTile({}, { rotationDirection: CLOCKWISE }))
    setMapTile(map, { x: 4, y: 10 }, createGearTile({}, { rotationDirection: ANTICLOCKWISE }))

    setMapTile(map, { x: 3, y: 1 }, createConveyorTile({}, { exitDirection: NORTH, inputDirections: createDirectionObject([SOUTH]) }))
    setMapTile(map, { x: 3, y: 2 }, createConveyorTile({}, { exitDirection: EAST, inputDirections: createDirectionObject([WEST]) }))
    setMapTile(map, { x: 3, y: 3 }, createConveyorTile({}, { exitDirection: SOUTH, inputDirections: createDirectionObject([NORTH]) }))
    setMapTile(map, { x: 3, y: 4 }, createConveyorTile({}, { exitDirection: WEST, inputDirections: createDirectionObject([EAST]) }))

    setMapTile(map, { x: 4, y: 1 }, createConveyorTile({}, { exitDirection: NORTH, inputDirections: createDirectionObject([EAST]) }))
    setMapTile(map, { x: 4, y: 2 }, createConveyorTile({}, { exitDirection: EAST, inputDirections: createDirectionObject([SOUTH]) }))
    setMapTile(map, { x: 4, y: 3 }, createConveyorTile({}, { exitDirection: SOUTH, inputDirections: createDirectionObject([WEST]) }))
    setMapTile(map, { x: 4, y: 4 }, createConveyorTile({}, { exitDirection: WEST, inputDirections: createDirectionObject([NORTH]) }))

    setMapTile(map, { x: 5, y: 1 }, createConveyorTile({}, { exitDirection: NORTH, inputDirections: createDirectionObject([WEST]) }))
    setMapTile(map, { x: 5, y: 2 }, createConveyorTile({}, { exitDirection: EAST, inputDirections: createDirectionObject([NORTH]) }))
    setMapTile(map, { x: 5, y: 3 }, createConveyorTile({}, { exitDirection: SOUTH, inputDirections: createDirectionObject([EAST]) }))
    setMapTile(map, { x: 5, y: 4 }, createConveyorTile({}, { exitDirection: WEST, inputDirections: createDirectionObject([SOUTH]) }))

    setMapTile(map, { x: 6, y: 1 }, createFastConveyorTile({}, { exitDirection: NORTH, inputDirections: createDirectionObject([SOUTH]) }))
    setMapTile(map, { x: 6, y: 2 }, createFastConveyorTile({}, { exitDirection: EAST, inputDirections: createDirectionObject([WEST]) }))
    setMapTile(map, { x: 6, y: 3 }, createFastConveyorTile({}, { exitDirection: SOUTH, inputDirections: createDirectionObject([NORTH]) }))
    setMapTile(map, { x: 6, y: 4 }, createFastConveyorTile({}, { exitDirection: WEST, inputDirections: createDirectionObject([EAST]) }))

    setMapTile(map, { x: 7, y: 1 }, createFastConveyorTile({}, { exitDirection: NORTH, inputDirections: createDirectionObject([EAST]) }))
    setMapTile(map, { x: 7, y: 2 }, createFastConveyorTile({}, { exitDirection: EAST, inputDirections: createDirectionObject([SOUTH]) }))
    setMapTile(map, { x: 7, y: 3 }, createFastConveyorTile({}, { exitDirection: SOUTH, inputDirections: createDirectionObject([WEST]) }))
    setMapTile(map, { x: 7, y: 4 }, createFastConveyorTile({}, { exitDirection: WEST, inputDirections: createDirectionObject([NORTH]) }))

    setMapTile(map, { x: 8, y: 1 }, createFastConveyorTile({}, { exitDirection: NORTH, inputDirections: createDirectionObject([WEST]) }))
    setMapTile(map, { x: 8, y: 2 }, createFastConveyorTile({}, { exitDirection: EAST, inputDirections: createDirectionObject([NORTH]) }))
    setMapTile(map, { x: 8, y: 3 }, createFastConveyorTile({}, { exitDirection: SOUTH, inputDirections: createDirectionObject([EAST]) }))
    setMapTile(map, { x: 8, y: 4 }, createFastConveyorTile({}, { exitDirection: WEST, inputDirections: createDirectionObject([SOUTH]) }))

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