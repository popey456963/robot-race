import React from 'react'
import '../Tile.css'
import { NORTH, EAST, SOUTH, WEST } from '../Constants'

export default class Robot extends React.Component {
    render() {
        const { robot } = this.props

        let robotTransform
        if (robot.direction === NORTH) robotTransform = 'rotate(180deg)'
        if (robot.direction === EAST) robotTransform = 'rotate(270deg)'
        if (robot.direction === WEST) robotTransform = 'rotate(90deg)'

        return (
            <img
                src='/robot.png'
                style={{
                    zIndex: 10,
                    position: 'fixed',
                    width: '35px',
                    transform: robotTransform
                }}
            />
        )
    }
}