import React from 'react'
import TileImage from './TileImage'
import { NE, ANGLES } from '../Constants'
import { getDirectionIndex, rotateAngleClockwise } from '../Position'

export default class Walls extends React.Component {
    render() {
        const { cell: { tile: { walls } } } = this.props

        const wallDirections = Object.keys(walls)
            .filter(dir => walls[dir])
            .map(dir => {
                let rotationIndex = getDirectionIndex(dir)
                return rotateAngleClockwise(ANGLES[rotationIndex], 2)
            })

        return (
            wallDirections.map(dir =>
                <TileImage
                    key={dir}
                    tile={'wall'}
                    dir={dir}
                />
            )

        )
    }
}