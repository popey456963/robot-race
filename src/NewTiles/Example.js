import React from 'react'
import TileImage from './TileImage'
import { NE } from '../Constants'

export default class Example extends React.Component {
    render() {
        const { tile, dir } = this.props

        return (
            <TileImage
                tile={'plain_4'}
                dir={NE}
            />
        )
    }
}