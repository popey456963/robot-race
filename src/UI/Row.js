import React from 'react'
import Tile from './Tile'
import { ROTATION_CONTEXT } from './ReactConstants'
// import './Tile.css'
import { findRobotAtPositionFromState } from '../State'

const GameZoomManager = require('./GameZoomManager')

export default class Row extends React.Component {
  static contextType = ROTATION_CONTEXT
  render() {
    const { row, rowId, state, playerRobot, zoom, onTileClick, customHoverTile } = this.props

    return (
      <tr
        key={rowId}
        className={`row-${rowId - 5} row`}
        style={{ transform: `translateY(${(rowId - 0) * 4 * GameZoomManager.percentSize()}em)` }}
      >{
          row.map((tile, columnId) => {
            const pos = { y: rowId, x: columnId }

            return <Tile
              id={columnId + ',' + rowId}
              tile={tile}
              pos={pos}
              robot={findRobotAtPositionFromState(state, pos)}
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
