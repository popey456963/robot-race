import React from 'react'
import TileImage from './TileImage'

export default class Flag extends React.Component {
    render() {
        const { cell: { tile } } = this.props
        const flagNumber = tile.meta.flagNumber

        const name = `flag_${flagNumber}`

        return (
            <TileImage
                tile={name}
            />
        )
    }
}