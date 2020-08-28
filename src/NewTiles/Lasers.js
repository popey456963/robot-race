// tile.lasers = {
//     [NORTH]: {
//         length: (LASER_HALF | LASER_FULL),
//         intensity: (LASER_SINGLE | LASER_DOUBLE),
//         start: (LASER_SOURCE | LASER_BEAM)
//     }
// }

import React from 'react'
import TileImage from './TileImage'
import { ANGLES, LASER_SOURCE, LASER_DOUBLE, LASER_HALF } from '../Constants'
import { getDirectionIndex, rotateAngleClockwise } from '../Position'

export default class Lasers extends React.Component {
    render() {
        const { cell: { lasers } } = this.props

        // console.log('lasers', lasers)

        if (!lasers) return null

        const laserDirections = Object.keys(lasers)
            .filter(dir => lasers[dir] !== undefined)
            .map(dir => {
                let rotationIndex = getDirectionIndex(dir)
                let name = lasers[dir].start === LASER_SOURCE ? 'wall_laser' : 'laser'
                name += lasers[dir].intensity === LASER_DOUBLE ? '_double' : '_single'
                name += lasers[dir].length === LASER_HALF ? '_half' : '_full'

                return {
                    angle: rotateAngleClockwise(ANGLES[rotationIndex], 0),
                    name: name
                }
            })

        return (
            laserDirections.map(({ name, angle }) =>
                <TileImage
                    key={angle}
                    tile={name}
                    dir={angle}
                />
            )

        )
    }
}