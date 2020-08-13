import React from 'react'
import Tile from './Tile'
import '../Tile.css'

export default class Express_Conveyor extends React.Component {
    render() {
        const { tile } = this.props

        return <Tile image={'/tiles/straight_conveyor_2/straight_conveyor_2'} dir={'NE'} />
    }
}