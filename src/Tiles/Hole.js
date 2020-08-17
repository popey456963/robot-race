import React from 'react'
import Tile from './Tile'

export default class Hole extends React.Component {
    render() {
        return <Tile image={'/tiles/hole/hole'} dir={'NE'} />
    }
}