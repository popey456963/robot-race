import React from 'react'
import { ROTATION_CONTEXT } from '../UI/ReactConstants'
import { getAngleIndex, rotateAngleClockwise } from '../Position'

const GameZoomManager = require('../UI/GameZoomManager')

export default class Tile extends React.Component {
    static contextType = ROTATION_CONTEXT
    render() {
        const { image, dir, styles, inverse, robot } = this.props

        let rotationAmount = getAngleIndex(this.context)
        if (inverse) rotationAmount = 4 - rotationAmount

        const tileDirection = rotateAngleClockwise(dir, rotationAmount)

        return <span>
            <div className={`background ${robot ? 'robot' : ''}`} style={{
                height: `calc(11.5em * ${GameZoomManager.percentSize()})`,
                width: `calc(11.5em * ${GameZoomManager.percentSize()})`,
                ...styles,
                backgroundSize: `100%`,
                backgroundImage: `url(${image}_${tileDirection}.png)`,
                backgroundRepeat: 'no-repeat',
            }} />
        </span>
    }
}