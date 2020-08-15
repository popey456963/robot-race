import React from 'react'
import Tile from './Tile'
import '../Tile.css'
import { NORTH, EAST, SOUTH, WEST } from '../Constants'
import { angleRotationAmount } from '../utils'

export function getConveyorImage(tile, isFast) {
    const exitDirection = tile.meta.exitDirection
    const inputDirections = tile.meta.inputDirections

    const countInputDirections = Object.values(inputDirections).filter(a => a).length

    let dir = 'SE'
    let conveyor = 'straight'
    let inverse = false

    if (countInputDirections === 1) {
        // we only have one input
        let inputDirection = Object.keys(inputDirections).filter(direction => inputDirections[direction])[0]

        const inputAngle = angleRotationAmount(inputDirection)
        const exitAngle = angleRotationAmount(exitDirection)

        const difference = inputAngle - exitAngle

        if (Math.abs(difference) % 2) {
            // this is a corner...
            conveyor = 'turn'

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
    }

    return {
        image: `/tiles/${conveyor}_conveyor${isFast ? '_2' : ''}${inverse ? '_anticlockwise' : ''}/${conveyor}_conveyor${isFast ? '_2' : ''}`,
        dir
    }
}

export default class Conveyor extends React.Component {
    render() {
        const { tile } = this.props

        const { image, dir } = getConveyorImage(tile, false)

        return <Tile image={image} dir={dir} />
    }
}