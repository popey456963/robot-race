import React from 'react'
import Tile from './Tile'
import '../Tile.css'
import { getConveyorImage } from './Conveyor'

export default class FastConveyor extends React.Component {
    render() {
        const { tile } = this.props

        const { image, dir } = getConveyorImage(tile, true)

        return <Tile image={image} dir={dir} />
    }
}