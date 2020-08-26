import React from 'react'
import TileImage from './TileImage'
import { CLOCKWISE } from '../Constants'

export default class Gear extends React.Component {
    render() {
        const { cell: { tile } } = this.props

        const name = tile.meta.rotationDirection === CLOCKWISE ? 'gear_1' : 'gear_2'

        return (
            <TileImage
                tile={name}
            />
        )
    }
}