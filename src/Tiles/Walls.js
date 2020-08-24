import React from 'react'
import { ROTATION_CONTEXT } from '../UI/ReactConstants'
import { getAngleIndex, rotateAngleClockwise, getDirectionIndex } from '../Position'
import { ANGLES } from '../Constants'

const createWall = (wallDir, cameraAngle) => {
    let rotationAmount = getAngleIndex(cameraAngle)
    let rotationIndex = getDirectionIndex(wallDir)
    
    const tileDirection = rotateAngleClockwise(ANGLES[rotationIndex], rotationAmount + 2)

    return (
        <span style={{
            content: '',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundImage: `url("/tiles/wall/wall_${tileDirection}.png")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
        }} />
    )
}

export default class Walls extends React.Component {
    static contextType = ROTATION_CONTEXT
    render() {
        const { tile, inverse } = this.props

        return (
            <span style={{
                transform: inverse ? 'scaleX(-1)' : ''
            }}>
                {
                    Object.keys(tile.walls).filter(dir => tile.walls[dir]).map(wallDir => 
                        createWall(wallDir, this.context)
                    )
                }
            </span>
        )
    }
}