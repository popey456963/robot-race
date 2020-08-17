import React from 'react'
import { NORTH, EAST, WEST, SOUTH } from '../Constants'
import { ROTATION_CONTEXT } from '../UI/ReactConstants'
import { rotateTileAngleAmount } from '../utils'

const GameZoomManager = require('../UI/GameZoomManager')

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
                    width: `${35 * Math.pow(GameZoomManager.percentSize(), 2)}px`,
                    transform: `rotate(${rotate}deg)`,
                }}
            />
        )
    }
}