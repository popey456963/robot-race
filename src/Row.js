import React from 'react'
import Tile from './Tile'
import { findRobots } from './utils'
import './Tile.css'

export default class Row extends React.Component {
  render () {
    const { row, rowId, robots } = this.props

    return (
      <tr key={rowId} className={`row-${rowId - 5}`} style={{ transform: `translateY(${(rowId - 0) * 4}em)` }}>{row.map((tile, columnId) =>
        <Tile
          key={columnId + ',' + rowId}
          tile={tile}
          pos={{ y: rowId, x: columnId }}
          robot={findRobots({ y: rowId, x: columnId }, robots)}
        />
      )}
      </tr>
    )
  }
}
