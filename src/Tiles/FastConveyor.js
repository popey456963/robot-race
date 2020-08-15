import React from 'react'
import Tile from './Tile'
import '../Tile.css'
import { getConveyorImage } from './Conveyor'

export default class FastConveyor extends React.Component {
    render() {
        const { tile } = this.props

        const { image, dir, inverse } = getConveyorImage(tile, true)

        return <Tile image={image} dir={dir} styles={{
            transform: inverse ? 'rotateZ(-45deg) rotateY(-60deg) translate3d(-1.1em, -4.8em, 0em) scaleX(-1)' : undefined
        }} />
    }
}