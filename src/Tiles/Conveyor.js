import React from 'react'
import Tile from './Tile'
import '../Tile.css'
import { NORTH, EAST, SOUTH, WEST } from '../Constants'

export function getConveyorImage(tile, isFast) {
    const exitDirection = tile.meta.exitDirection
    const inputDirections = tile.meta.inputDirections

    const countInputDirections = Object.values(inputDirections).filter(a => a).length

    let dir = 'SE'
    let conveyor = 'straight'

    if (countInputDirections === 1) {
        // we only have one input

        // check for straight paths
        if (exitDirection === NORTH && inputDirections[SOUTH]) dir = 'SE'
        if (exitDirection === EAST && inputDirections[WEST]) dir = 'SW'
        if (exitDirection === SOUTH && inputDirections[NORTH]) dir = 'NW'
        if (exitDirection === WEST && inputDirections[EAST]) dir = 'NE'
    }

    return {
        image: `/tiles/${conveyor}_conveyor${isFast ? '_2' : ''}/${conveyor}_conveyor${isFast ? '_2' : ''}`,
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