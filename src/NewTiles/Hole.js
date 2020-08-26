import React from 'react'
import TileImage from './TileImage'

export default class Hole extends React.Component {
    render() {
        const { cell: { tile } } = this.props

        return (
            <TileImage
                tile={'hole'}
            />
        )
    }
}