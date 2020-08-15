import React from 'react'
import Tile from './Tile'
import { findRobots } from './utils'
import { ROTATION_CONTEXT } from './ReactConstants'
import './Tile.css'

export default class Row extends React.Component {
  static contextType = ROTATION_CONTEXT
  render() {
    const { row, rowId, robots } = this.props

    return (
      <tr
        key={rowId}
        className={`row-${rowId - 5} row`}
        style={{ transform: `translateY(${(rowId - 0) * 4}em)` }}
      >{
          row.map((tile, columnId) => {
            const pos = { y: rowId, x: columnId }

            return <Tile
              key={columnId + ',' + rowId}
              tile={tile}
              pos={pos}
              robot={findRobots(pos, robots)}
            />
          })}
      </tr>
    )
  }
}
