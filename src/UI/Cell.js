import React from 'react'

import Plain from '../NewTiles/Plain'
import Walls from '../NewTiles/Walls'
import Pushers from '../NewTiles/Pushers'
import { PLAIN, FLAG, GEAR, GRILL, HOLE, CONVEYOR, FAST_CONVEYOR } from '../Constants'
import Flag from '../NewTiles/Flag'
import Gear from '../NewTiles/Gear'
import Grill from '../NewTiles/Grill'
import Hole from '../NewTiles/Hole'
import Robot from '../NewTiles/Robot'
import Conveyor from '../NewTiles/Conveyor'

export default class Cell extends React.Component {
  render() {
    const { cell, cellIndex } = this.props

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

    return (
        <td
            style={{
                transform: `translateX(${cellIndex * 4}em)`
            }}
        >{
            <div
                className='cell'
            >
                <div
                    className='background'
                >
                    <Tile cell={cell} />
                    <Walls cell={cell} />
                    <Pushers cell={cell} />
                    <Robot cell={cell} />
                </div>
            </div>
        }</td>
    )
  }
}
