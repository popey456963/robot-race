import React from 'react'
import { ROTATION_CONTEXT } from '../UI/ReactConstants'
import { getAngleIndex, rotateAngleClockwise, getDirectionIndex } from '../Position'
import { ANGLES } from '../Constants'

const GameZoomManager = require('../UI/GameZoomManager')

export default class Plain extends React.Component {
    static contextType = ROTATION_CONTEXT
    render() {
        const { robot, inverse } = this.props

        if (!robot) return <span />

        let rotationAmount = getAngleIndex(this.context)
        let rotationIndex = getDirectionIndex(robot.direction)
        
        const tileDirection = rotateAngleClockwise(ANGLES[rotationIndex], rotationAmount + 3)

        return (
            <span style={{
                content: '',
                position: 'absolute',
                top: `calc(-6em * ${GameZoomManager.percentSize()})`,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundImage: `url("/tiles/robot_${robot.colour}/robot_${robot.colour}_${tileDirection}.png")`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                transform: inverse ? 'scaleX(-1)' : ''
            }} />
        )
    }
}