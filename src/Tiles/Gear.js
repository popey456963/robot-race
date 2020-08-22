import React from 'react'
import Tile from './Tile'
import { ANTICLOCKWISE } from '../Constants'

export default class Gear extends React.Component {
    render() {
        const { tile, robot } = this.props

        let icon = 'gear_1'
        if (tile.meta.rotationDirection === ANTICLOCKWISE) icon = 'gear_2'

        return <Tile robot={robot} image={`/tiles/${icon}/${icon}`} dir={'NE'} />
    }
}