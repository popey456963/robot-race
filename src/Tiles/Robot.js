import React from 'react'
import '../Tile.css'
import { NORTH, EAST, WEST, SOUTH } from '../Constants'
import { ROTATION_CONTEXT } from '../ReactConstants'
import { rotateTileAngleAmount } from '../utils'


export default class Robot extends React.Component {
    static contextType = ROTATION_CONTEXT
    render() {
        const { robot } = this.props

        const addedRotations = rotateTileAngleAmount(this.context)

        let rotate
        if (robot.direction === NORTH) rotate = 180
        if (robot.direction === EAST) rotate = 270
        if (robot.direction === WEST) rotate = 90
        if (robot.direction === SOUTH) rotate = 0

        rotate = (rotate + addedRotations * 90) % 360

        return (
            <img
                src='/robot.png'
                alt='Robot'
                style={{
                    zIndex: 10,
                    position: 'fixed',
                    width: '35px',
                    transform: `rotate(${rotate}deg)`,
                }}
            />
        )
    }
}