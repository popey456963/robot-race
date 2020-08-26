import React from 'react'
import TileImage from '../NewTiles/TileImage'

import Plain from '../NewTiles/Plain'

export default class NewTile extends React.Component {
  render() {
    const { tile, key } = this.props

    return (
        <td
            key={key}
            style={{
                transform: `translateX(${key * 4}em)`
            }}
        >{
            <div
                className='cell'
            >
                <div
                    className='background'
                >
                    <Plain cell={tile} />
                    <TileImage tile='wall' dir='NE' />
                </div>
            </div>
        }</td>
    )
  }
}
