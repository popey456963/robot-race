import React from 'react'
import Tile from './Tile'
import { findRobots } from '../utils'
import { ROTATION_CONTEXT } from './ReactConstants'
import './Tile.css'

const GameZoomManager = require('./GameZoomManager')

export default class Row extends React.Component {
  static contextType = ROTATION_CONTEXT
  render() {
    const { row, rowId, robots, playerRobot, zoom, onTileClick, customHoverTile } = this.props

    return (
      <tr
        key={rowId}
        className={`row-${rowId - 5} row`}
        style={{ transform: `translateY(${(rowId - 0) * 4 * GameZoomManager.percentSize()}em)` }}
      >{
          row.map((tile, columnId) => {
            const pos = { y: rowId, x: columnId }

            return <Tile
              key={columnId + ',' + rowId}
              tile={tile}
              pos={pos}
              robot={findRobots(pos, robots)}
              playerRobot={playerRobot}
              zoom={zoom}
              onTileClick={onTileClick}
              customHoverTile={customHoverTile}
            />
          })}
      </tr>
    )
  }
}
