import React from 'react'
import '../Tile.css'
import { ROTATION_CONTEXT } from '../ReactConstants'
import { rotateTileAngle, rotateTileAngleAmount } from '../utils'

export default class Tile extends React.Component {
    static contextType = ROTATION_CONTEXT
    render() {
        const { image, dir, styles } = this.props

        const tileDirection = rotateTileAngle(dir, rotateTileAngleAmount(this.context))

        return <div style={{
            backgroundSize: `100%`,
            backgroundImage: `url(${image}_${tileDirection}.png)`,
            ...styles
        }} />
    }
}