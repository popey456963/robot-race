import React from 'react'
import Robot from './Robot'
import Walls from './Walls'
import Pushers from './Pushers'
import { ROTATION_CONTEXT } from '../UI/ReactConstants'
import { getAngleIndex, rotateAngleClockwise } from '../Position'

const GameZoomManager = require('../UI/GameZoomManager')

export default class Tile extends React.Component {
    static contextType = ROTATION_CONTEXT
    render() {
        const { image, dir, styles, inverse, robot, tile } = this.props

        const rotationAmount = getAngleIndex(this.context)
        const tileDirection = rotateAngleClockwise(dir, rotationAmount)

        return <span>
            <div className={`background`} style={{
                height: `calc(11.5em * ${GameZoomManager.percentSize()})`,
                width: `calc(11.5em * ${GameZoomManager.percentSize()})`,
                ...styles,
                backgroundSize: `100%`,
                backgroundImage: `url(${image}_${tileDirection}.png)`,
                backgroundRepeat: 'no-repeat',
            }}>
                <Walls tile={tile} inverse={inverse}  />
                <Pushers tile={tile} inverse={inverse}  />
                <Robot robot={robot} inverse={inverse} />
            </div>
        </span>
    }
}