import React from 'react'
import Tile from './Tile'
import '../Tile.css'

export default class Grill extends React.Component {
    render() {
        const { tile } = this.props

        let image = 'grill'

        if (tile.meta.level === 1) image = 'grill_spanner'
        if (tile.meta.level === 2) image = 'grill_spanner_hammer'

        return <Tile image={`/tiles/${image}/${image}`} dir={'SE'} />
    }
}