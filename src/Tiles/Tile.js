import React from 'react'
import { ROTATION_CONTEXT } from '../UI/ReactConstants'
import { rotateTileAngle, rotateTileAngleAmount } from '../utils'

const GameZoomManager = require('../UI/GameZoomManager')

export default class Tile extends React.Component {
    static contextType = ROTATION_CONTEXT
    render() {
        const { image, dir, styles, inverse } = this.props

        let rotationAmount = rotateTileAngleAmount(this.context)
        if (inverse) rotationAmount = 4 - rotationAmount

        const tileDirection = rotateTileAngle(dir, rotationAmount)

        return <div style={{
            height: `calc(11.5em * ${GameZoomManager.percentSize()})`,
            width: `calc(11.5em * ${GameZoomManager.percentSize()})`,
            backgroundSize: `100%`,
            backgroundImage: `url(${image}_${tileDirection}.png)`,
            ...styles,
        }} />
    }
}