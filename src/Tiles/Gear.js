import React from 'react'
import Tile from './Tile'
import '../Tile.css'
import { ANTICLOCKWISE } from '../Constants'

export default class Gear extends React.Component {
    render() {
        const { tile } = this.props

        let icon = 'gear_1'
        if (tile.meta.rotationDirection === ANTICLOCKWISE) icon = 'gear_2'

        return <Tile image={`/tiles/${icon}/${icon}`} dir={'NE'} />
    }
}