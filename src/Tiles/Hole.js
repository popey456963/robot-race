import React from 'react'
import Tile from './Tile'

export default class Hole extends React.Component {
    render() {
        const { robot } = this.props

        return <Tile image={'/tiles/hole/hole'} dir={'NE'} robot={robot} />
    }
}