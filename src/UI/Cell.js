import React from 'react'

import Plain from '../NewTiles/Plain'
import Walls from '../NewTiles/Walls'
import Pushers from '../NewTiles/Pushers'
import { PLAIN, FLAG, GEAR, GRILL, HOLE, CONVEYOR, FAST_CONVEYOR, NORTH, SOUTH, EAST, WEST } from '../Constants'
import Flag from '../NewTiles/Flag'
import Gear from '../NewTiles/Gear'
import Grill from '../NewTiles/Grill'
import Hole from '../NewTiles/Hole'
import Robot from '../NewTiles/Robot'
import Conveyor from '../NewTiles/Conveyor'
import Lasers from '../NewTiles/Lasers'

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

export default class Cell extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            hover: false
        }
    }

    render() {
        const { cellIndex, onTileClick, onTileHover } = this.props
        let { cell } = this.props

        if (onTileHover && this.state.hover) {
            cell = onTileHover(cell)

            console.log('updated cell', cell)
        }

        const { tile, robot } = cell
        const { type } = tile

        let Tile = Plain
        switch (type) {
            case PLAIN: Tile = Plain; break
            case FLAG: Tile = Flag; break
            case GEAR: Tile = Gear; break
            case GRILL: Tile = Grill; break
            case HOLE: Tile = Hole; break
            case CONVEYOR: Tile = Conveyor; break
            case FAST_CONVEYOR: Tile = Conveyor; break
        }

        let tooltip = stringify(tile).join(' | ')

        return (
            <td
                style={{
                    transform: `translateX(${cellIndex * 4}em)`
                }}
            >{
                <div
                    className='cell'
                    onClick={() => onTileClick}
                    onMouseEnter={() => this.setState({ hover: true })}
                    onMouseLeave={() => this.setState({ hover: false })}

                    style={{
                        transform: this.state.hover ? 'translate3d(-2em, -2em, -2em)' : ''
                    }}
                >
                    <div
                        data-tooltip={tooltip}
                        className='background'
                        style={{
                            width: '11.5em',
                            height: '11.5em',
                        }}
                    >
                        <Tile cell={cell} />
                        <Walls cell={cell} />
                        <Pushers cell={cell} />
                        <Lasers cell={cell} />
                        <Robot cell={cell} />
                    </div>
                </div>
            }</td>
        )
    }
}
