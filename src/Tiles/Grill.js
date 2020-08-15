import React from 'react'
import Tile from './Tile'
import '../Tile.css'

export default class Grill extends React.Component {
    render() {
        const { tile } = this.props

        return <Tile image={'/tiles/grill/grill'} dir={'NE'} />
    }
}