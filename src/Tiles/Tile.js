import React from 'react'
import '../Tile.css'
import { ROTATION_CONTEXT } from '../ReactConstants'
import { rotateTileAngle, rotateTileAngleAmount } from '../utils'

export default class Tile extends React.Component {
    static contextType = ROTATION_CONTEXT
    render() {
        const { image, dir, styles, inverse } = this.props

        let rotationAmount = rotateTileAngleAmount(this.context)
        if (inverse) rotationAmount = 4 - rotationAmount

        const tileDirection = rotateTileAngle(dir, rotationAmount)

        return <div style={{
            backgroundSize: `100%`,
            backgroundImage: `url(${image}_${tileDirection}.png)`,
            ...styles
        }} />
    }
}