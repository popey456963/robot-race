import React from 'react'
import Tile from './Tile'
import '../Tile.css'

export default class Flag extends React.Component {
    render() {
        const { tile } = this.props

        return <Tile image={'/tiles/flag_1/flag_1'} dir={'NE'} />
    }
}