import React from 'react'
import { ROTATION_CONTEXT } from '../UI/ReactConstants'
import { getAngleIndex, rotateAngleClockwise, getDirectionIndex } from '../Position'
import { ANGLES } from '../Constants'

const createPusher = (pusherDir, pushIndex, cameraAngle) => {
    let rotationAmount = getAngleIndex(cameraAngle)
    let rotationIndex = getDirectionIndex(pusherDir)
    
    const tileDirection = rotateAngleClockwise(ANGLES[rotationIndex], rotationAmount + 2)

    const colour = pushIndex[0] ? 'yellow' : 'red'

    return (
        <span style={{
            content: '',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundImage: `url("/tiles/pusher_${colour}/pusher_${colour}_${tileDirection}.png")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
        }} />
    )
}

export default class Pushers extends React.Component {
    static contextType = ROTATION_CONTEXT
    render() {
        const { tile, inverse } = this.props

        return (
            <span style={{
                transform: inverse ? 'scaleX(-1)' : ''
            }}>
                {
                    Object.keys(tile.pushers).filter(dir => tile.pushers[dir].indexOf(true) !== -1).map(pusherDir => 
                        createPusher(pusherDir, tile.pushers[pusherDir], this.context)
                    )
                }
            </span>
        )
    }
}