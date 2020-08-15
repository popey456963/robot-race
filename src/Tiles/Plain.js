import React from 'react'
import Tile from './Tile'
import '../Tile.css'

export default class Plain extends React.Component {
    render() {
        const { playerRobot, pos } = this.props

        const checkpoint = playerRobot.checkpoint.x === pos.x && playerRobot.checkpoint.y === pos.y
        let tile = checkpoint ? 'generic_cp' : 'plain_4'

        return <Tile image={`/tiles/${tile}/${tile}`} dir={'NE'} />
    }
}