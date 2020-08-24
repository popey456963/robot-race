import React from 'react'
import Tile from './Tile'

export default class Plain extends React.Component {
    render() {
        const { playerRobot, pos, robot, tile } = this.props

        const checkpoint = playerRobot.checkpoint.x === pos.x && playerRobot.checkpoint.y === pos.y
        let tileName = checkpoint ? 'generic_cp' : 'plain_4'

        return <Tile tile={tile} image={`/tiles/${tileName}/${tileName}`} dir={'NE'} robot={robot} />
    }
}