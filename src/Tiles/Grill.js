import React from 'react'
import Tile from './Tile'
import '../Tile.css'

export default class Grill extends React.Component {
    render() {
        const { tile, playerRobot, pos } = this.props

        let image = ''
        if (tile.meta.level === 1) image = 'grill_spanner'
        if (tile.meta.level === 2) image = 'grill_spanner_hammer'

        const checkpoint = playerRobot.checkpoint.x === pos.x && playerRobot.checkpoint.y === pos.y
        if (checkpoint) image += '_cp'

        return <Tile image={`/tiles/${image}/${image}`} dir={'SE'} />
    }
}