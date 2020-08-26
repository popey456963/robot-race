import React from 'react'
import { ROTATION_CONTEXT } from '../UI/ReactConstants'
import { getAngleIndex, rotateAngleClockwise } from '../Position'
import { NE } from '../Constants'

export default class TileImage extends React.Component {
  static contextType = ROTATION_CONTEXT

  render() {
    let { tile, dir, style } = this.props

    if (!dir) dir = NE

    const rotationAmount = getAngleIndex(this.context)
    const tileDirection = rotateAngleClockwise(dir, rotationAmount)

    return (
        <span 
            style={{
                content: '',
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundImage: `url("/tiles/${tile}/${tile}_${tileDirection}.png")`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                ...style
            }}
        />
    )
  }
}
