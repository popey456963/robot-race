import React from 'react'
import Tile from './Tile'
import '../Tile.css'

export default class Plain extends React.Component {
    render() {
        const { tile } = this.props

        return <Tile image={'/tiles/hole/hole'} dir={'NE'} />
    }
}