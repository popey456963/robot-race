import React from 'react';
import './Tile.css';
import { NORTH, EAST, SOUTH, WEST } from './Constants'

export default class Tile extends React.Component {
    render() {
        const { tile, pos, robot } = this.props

        let robotTransform = undefined

        if (robot) {
            if (robot.direction === NORTH) robotTransform = 'rotate(180deg)'
            if (robot.direction === EAST) robotTransform = 'rotate(270deg)'
            if (robot.direction === WEST) robotTransform = 'rotate(90deg)'
        }

        let tileType = 7

        if (tile.type === 'FLAG') tileType = 3

        return (
            <td
                className={`col-${pos.x - 5}`}
                style={{transform: `translateX(${(pos.x - 0) * 4}em)`}}
            >
                { robot ? (<img src='/robot.png' style={{
                    zIndex: 10,
                    position: 'fixed',
                    width: '55px',
                    transform: robotTransform
                }}/>) : null }
                <div className='tile'>
                    <div className={`tile-${tileType}`}>
                    </div>
                </div>
            </td>
        )
    }
}