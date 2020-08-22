import React from 'react'
import './Tile.css'
import { NORTH, EAST, SOUTH, WEST } from '../Constants'
import { FLAG, CONVEYOR, FAST_CONVEYOR, HOLE, GRILL, PLAIN, GEAR } from '../Constants'

import Conveyor from '../Tiles/Conveyor'
import FastConveyor from '../Tiles/FastConveyor'
import Flag from '../Tiles/Flag'
import Plain from '../Tiles/Plain'
import Grill from '../Tiles/Grill'
import Hole from '../Tiles/Hole'
import Gear from '../Tiles/Gear'

const GameZoomManager = require('./GameZoomManager')

function stringify(tile) {
  let tooltip = []

  for (let object in tile) {
    if (typeof tile[object] === 'object') {
      // this is an object
      if (NORTH in tile[object] || EAST in tile[object] || SOUTH in tile[object] || WEST in tile[object]) {
        const N = tile[object][NORTH] ? 'N' : '-'
        const E = tile[object][EAST] ? 'E' : '-'
        const S = tile[object][SOUTH] ? 'S' : '-'
        const W = tile[object][WEST] ? 'W' : '-'
        tooltip.push(`${object}: ${N}${E}${S}${W}`)
      } else {
        tooltip = tooltip.concat(stringify(tile[object]))
      }
    } else {
      // just print it...
      tooltip.push(`${object}: ${tile[object]}`)
    }
  }

  return tooltip
}

export default class Tile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hover: false
    }
  }

  render() {
    let { tile, pos, robot, playerRobot, onTileClick, customHoverTile } = this.props

    if (this.state.hover && customHoverTile) {
      tile = customHoverTile(tile)
    }

    let TileType

    switch (tile.type) {
      case CONVEYOR: TileType = Conveyor; break
      case FAST_CONVEYOR: TileType = FastConveyor; break
      case FLAG: TileType = Flag; break
      case PLAIN: TileType = Plain; break
      case GRILL: TileType = Grill; break
      case HOLE: TileType = Hole; break
      case GEAR: TileType = Gear; break
      default: throw new Error('unexpected tile type')
    }

    let tileImage = <TileType tile={tile} playerRobot={playerRobot} pos={pos} robot={robot}/>

    let tooltip = stringify(tile).join(' | ')

    return (
      <td
        className={`col-${pos.x - 5} iso_td`}
        style={{
          transform: (this.state.hover ? 'translate3d(-0.95em, -0.95em, 0em)' : '') + ` translateX(${(pos.x - 0) * 4 * GameZoomManager.percentSize()}em)`
        }}
      >
        <div className='tile'
          onMouseEnter={() => this.setState({ hover: true })}
          onMouseLeave={() => this.setState({ hover: false })}
          onClick={() => onTileClick ? onTileClick(tile) : undefined}
          data-tooltip={tooltip}
        >
          {tileImage}
        </div>
      </td>
    )
  }
}
