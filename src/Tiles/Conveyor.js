import React from 'react'
import Tile from './Tile'
import '../Tile.css'

export default class Conveyor extends React.Component {
    render() {
        const { tile } = this.props

        return <Tile image={'/tiles/straight_conveyor/straight_conveyor'} dir={'NE'} />
    }
}