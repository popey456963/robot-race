import React from 'react'
import Tile from './Tile'

export default class Flag extends React.Component {
    render() {
        const { tile, playerRobot, pos, robot } = this.props
        const flagNumber = tile.meta.flagNumber

        const visited = playerRobot.flags.includes(tile.meta.flagNumber)
        const checkpoint = playerRobot.checkpoint.x === pos.x && playerRobot.checkpoint.y === pos.y

        const name = `flag_${visited ? 'taken_' : ''}${checkpoint ? 'cp_' : ''}${flagNumber}`

        return <Tile image={`/tiles/${name}/${name}`} dir={'NE'} robot={robot} />
    }
}