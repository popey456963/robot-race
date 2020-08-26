import React from 'react'
import TileImage from './TileImage'

export default class Grill extends React.Component {
    render() {
        const { cell: { tile, checkpoint } } = this.props

        let name = tile.meta.level === 2 ? 'grill_spanner_hammer' : 'grill_spanner'
        if (checkpoint) name += '_cp'

        return (
            <TileImage
                tile={name}
            />
        )
    }
}