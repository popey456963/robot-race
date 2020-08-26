import React from 'react'
import TileImage from './TileImage'
import { ANGLES } from '../Constants'
import { getDirectionIndex, rotateAngleClockwise } from '../Position'

export default class Pushers extends React.Component {
    render() {
        const { cell: { tile: { pushers } } } = this.props

        const pusherDirections = Object.keys(pushers)
            .filter(dir => pushers[dir].indexOf(true) !== -1)
            .map(dir => {
                let rotationIndex = getDirectionIndex(dir)
                return {
                    type: pushers[dir][0] ? 'pusher_yellow' : 'pusher_red',
                    rotation: rotateAngleClockwise(ANGLES[rotationIndex], 2)
                }
            })

        return (
            pusherDirections.map(pusher =>
                <TileImage
                    key={pusher.rotation}
                    tile={pusher.type}
                    dir={pusher.rotation}
                />
            )

        )
    }
}