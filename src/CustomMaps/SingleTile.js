import {
    createMap
} from '../Map'

export default function createSingleTile() {
    const map = createMap(2, 2)

    map[0][0].lasers = {
        'SOUTH': 'LASER_SINGLE',
        'EAST': 'LASER_DOUBLE'
    }

    return map
}