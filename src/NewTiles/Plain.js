import React from 'react'
import TileImage from './TileImage'

export default class Plain extends React.Component {
    render() {
        const { cell: { tile, checkpoint } } = this.props

        const name = checkpoint ? 'generic_cp' : 'plain_4'

        return (
            <TileImage
                tile={name}
            />
        )
    }
}