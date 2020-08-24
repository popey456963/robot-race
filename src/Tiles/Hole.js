import React from 'react'
import Tile from './Tile'

export default class Hole extends React.Component {
    render() {
        const { robot, tile } = this.props

        return <Tile tile={tile} image={'/tiles/hole/hole'} dir={'NE'} robot={robot} />
    }
}