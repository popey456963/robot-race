import React from 'react'
import Tile from './Tile'
import '../Tile.css'

export default class Flag extends React.Component {
    render() {
        const { tile } = this.props
        const flagNumber = tile.meta.flagNumber

        return <Tile image={`/tiles/flag_${flagNumber}/flag_${flagNumber}`} dir={'NE'} />
    }
}