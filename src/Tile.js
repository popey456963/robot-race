import React from 'react'
import './Tile.css'
import { NORTH, EAST, SOUTH, WEST } from './Constants'
import { FLAG, CONVEYOR, EXPRESS_CONVEYOR } from './Constants'

import Conveyor from './Tiles/Conveyor'
import Express_Conveyor from './Tiles/Express_Conveyor'
import Robot from './Tiles/Robot'
import Flag from './Tiles/Flag'
import Plain from './Tiles/Plain'

function stringify(tile) {
  let tooltip = []

  for (let object in tile) {
    if (typeof tile[object] === 'object') {
      // this is an object
      if (NORTH in tile[object]) {
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
    const { tile, pos, robot } = this.props

    let tileImage
    if (tile.type === CONVEYOR) tileImage = <Conveyor tile={tile} />
    else if (tile.type === EXPRESS_CONVEYOR) tileImage = <Express_Conveyor tile={tile} />
    else if (tile.type === FLAG) tileImage = <Flag tile={tile} />
    else tileImage = <Plain tile={tile} />

    let tooltip = stringify(tile).join(' | ')

    return (
      <td
        className={`col-${pos.x - 5}`}
        style={{
          transform: (this.state.hover ? 'translate3d(-1em, -1em, 0em)' : '') + ` translateX(${(pos.x - 0) * 4}em)`
        }}
      >
        {robot ? (<Robot robot={robot} />) : null}
        <div className='tile'
          onMouseEnter={() => this.setState({ hover: true })}
          onMouseLeave={() => this.setState({ hover: false })}
          data-tooltip={tooltip}
        >
          {tileImage}
        </div>
      </td>
    )
  }
}
