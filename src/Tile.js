import React from 'react';
import './Tile.css';

export default class Tile extends React.Component {
    render() {
        const { tile, pos, robot } = this.props

        return (
            <td
                className={`col-${pos.x - 5}`}
                style={{transform: `translateX(${(pos.x - 0) * 4}em)`}}
            >
                <div className='tile'>
                    <div className='tile-7'>
                    </div>
                </div>
            </td>
        )
    }
}