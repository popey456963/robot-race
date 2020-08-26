import React from 'react'
import TileImage from './TileImage'
import { getDirectionIndex, rotateAngleClockwise } from '../Position'
import { ANGLES } from '../Constants'

export default class Plain extends React.Component {
    render() {
        const { cell: { robot } } = this.props

        if (!robot) return null

        const rotationIndex = getDirectionIndex(robot.direction)
        const direction = rotateAngleClockwise(ANGLES[rotationIndex], 3)

        return (
            <TileImage
                tile={`robot_${robot.colour}`}
                dir={direction}
                style={{
                    top: '-6em'
                }}
            />
        )
    }
}