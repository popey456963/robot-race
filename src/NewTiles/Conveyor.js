import React from 'react'
import TileImage from './TileImage'
import Error from './Error'
import { FAST_CONVEYOR, NORTH, EAST, SOUTH, WEST } from '../Constants'
import { getDirectionIndex } from '../Position'

export default class Conveyor extends React.Component {
    render() {
        const { cell: { tile } } = this.props
        const { exitDirection, inputDirections } = tile.meta

        const inputDirectionCount = Object.values(inputDirections).filter(a => a).length

        let dir = 'SE'
        let conveyor = 'straight_conveyor'
        let inverse = false


        if (![1, 2].includes(inputDirectionCount) || inputDirections[exitDirection]) {
            console.log(`Tile error for conveyor belt!`, tile)

            return (
                <Error />
            )
        }

        if (inputDirectionCount === 1) {
            // we only have one input
            let inputDirection = Object.keys(inputDirections).filter(direction => inputDirections[direction])[0]
    
            const inputAngle = getDirectionIndex(inputDirection)
            const exitAngle = getDirectionIndex(exitDirection)
    
            const difference = inputAngle - exitAngle
    
            if (Math.abs(difference) % 2) {
                // this is a corner...
                conveyor = 'turn_conveyor'
    
                if ([1, -3].includes(inputAngle - exitAngle)) {
                    if (exitDirection === NORTH) dir = 'NE'
                    if (exitDirection === EAST) dir = 'SE'
                    if (exitDirection === SOUTH) dir = 'SW'
                    if (exitDirection === WEST) dir = 'NW'
                } else {
                    inverse = true
    
                    if (exitDirection === NORTH) dir = 'NW'
                    if (exitDirection === EAST) dir = 'SW'
                    if (exitDirection === SOUTH) dir = 'SE'
                    if (exitDirection === WEST) dir = 'NE'
                }
            } else {
                // this is a straight line
                if (exitDirection === NORTH && inputDirections[SOUTH]) dir = 'SE'
                if (exitDirection === EAST && inputDirections[WEST]) dir = 'SW'
                if (exitDirection === SOUTH && inputDirections[NORTH]) dir = 'NW'
                if (exitDirection === WEST && inputDirections[EAST]) dir = 'NE'
            }
        } else if (inputDirectionCount === 2) {
            // this is a t piece
            conveyor = ''
            if ((inputDirections[NORTH] && inputDirections[SOUTH]) ||
                (inputDirections[WEST] && inputDirections[EAST])) {
    
                // Output is base of T
                conveyor = 'turn_conveyor_t_base'
                if (exitDirection === NORTH) dir = "NE"
                if (exitDirection === EAST) dir = "SE"
                if (exitDirection === SOUTH) dir = "SW"
                if (exitDirection === WEST) dir = "NW"
            }
            else {
                conveyor = 'turn_conveyor_t_side'
                // Output is arm of T
                if ((exitDirection === NORTH && inputDirections[EAST]) ||
                    (exitDirection === EAST && inputDirections[SOUTH]) ||
                    (exitDirection === SOUTH && inputDirections[WEST]) ||
                    (exitDirection === WEST && inputDirections[NORTH])) {
    
                    inverse = true
                }
    
                if ((exitDirection === NORTH && !inverse) || (exitDirection === WEST && inverse)) dir = "SW"
                if ((exitDirection === EAST && !inverse) || (exitDirection === SOUTH && inverse)) dir = "NW"
                if ((exitDirection === SOUTH && !inverse) || (exitDirection === EAST && inverse)) dir = "NE"
                if ((exitDirection === WEST && !inverse) || (exitDirection === NORTH && inverse)) dir = "SE"
            }
        }

        const name = `${conveyor}${tile.type === FAST_CONVEYOR ? '_2' : ''}`

        return (
            <TileImage
                tile={name}
                dir={dir}
                style={{
                    transform: inverse ? 'scaleX(-1)' : '',
                }}
            />
        )
    }
}