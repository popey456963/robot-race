import React from 'react'
import PropTypes from 'prop-types'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import * as dg from 'dis-gui';
import './Card.css'
import './MapEditor.css'
import Map from './Map'
import Button from './Button'
import { ROTATION_CONTEXT } from './ReactConstants'
import { NORTH, EAST, SOUTH, WEST, NE } from '../Constants'
import { PLAIN, FLAG, HOLE, FAST_CONVEYOR, CONVEYOR, GRILL, GEAR, CLOCKWISE, ANTICLOCKWISE } from '../Constants'
import { rotateAngleClockwise } from '../Position';

export class RobotFightMapEditor extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: [this.props.G.players[this.props.playerID].hand[0]],
      rotation: NE,
      map: this.props.G.map,
      robots: this.props.G.robots,

      inspect: true,

      walls: {
        [NORTH]: false,
        [EAST]: false,
        [SOUTH]: false,
        [WEST]: false
      },

      lasers: {
        [NORTH]: false,
        [EAST]: false,
        [SOUTH]: false,
        [WEST]: false
      },

      pushers: {
        [NORTH]: [false, false, false, false, false],
        [EAST]: [false, false, false, false, false],
        [SOUTH]: [false, false, false, false, false],
        [WEST]: [false, false, false, false, false]
      },

      grills: {
        level: 1
      },

      gears: {
        rotationDirection: CLOCKWISE
      },

      flags: {
        flagNumber: 1
      },

      conveyors: {
        inputDirections: {
          [NORTH]: false,
          [EAST]: false,
          [SOUTH]: false,
          [WEST]: false
        },
        exitDirection: NORTH
      }
    }
  }

  static propTypes = {
    G: PropTypes.any.isRequired,
    ctx: PropTypes.any.isRequired,
    moves: PropTypes.any.isRequired,
    playerID: PropTypes.string,
    isActive: PropTypes.bool,
    isMultiplayer: PropTypes.bool
  }

  onClick = (props) => {
    if (this.isActive()) {
      this
        .props
        .moves
        .submitOrders(this.state.selected, this.props.playerID);
    }
  }

  rotateBoard(clockwise) {
    const rotation = rotateAngleClockwise(this.state.rotation, clockwise ? 1 : 3)

    this.setState({
      rotation
    })
  }
  
  changeBlockType(block, onClick, keepMeta) {
    this.setState({ inspect: false })
    this.setState({ paintBlock: block, onTileClick: onClick, keepMeta })
  }

  onTileClick(tile) {
    if (this.state.inspect) {
      return
    }

    let rest = {}
    if (this.state.onTileClick) rest = this.state.onTileClick(tile)
    if (!this.state.keepMeta) this.state.map[tile.position.y][tile.position.x].meta = undefined
    this.state.map[tile.position.y][tile.position.x] = {
      ...this.state.map[tile.position.y][tile.position.x],
      ...this.state.paintBlock,
      ...rest
    }

    console.log(this.state.map[tile.position.y][tile.position.x])

    this.setState({ map: this.state.map })
  }

  customHoverTile(tile) {
    if (this.state.inspect) {
      return tile
    }

    let rest = {}
    if (this.state.onTileClick) rest = this.state.onTileClick(tile)

    return {
      ...this.state.map[tile.position.y][tile.position.x],
      ...this.state.paintBlock,
      ...rest
    }
  }

  inspectTile() {
    this.setState({ inspect: true })
  }

  onPusherChange(dir, index, val) {
    this.setState({
      pushers: {
        ...this.state.pushers,
        [dir]: this.state.pushers[dir].map(
          (v, i) => i === index ? val : v
        )
      }
    })
  }

  render() {
    console.log(this.props)

    let tiles = [
      { name: 'Plain', block: { type: PLAIN } },
      { name: 'Flag', block: { type: FLAG }, onClick: () => {
        const flagNumber = this.state.flags.flagNumber
        return { meta: { flagNumber } }
      } },
      { name: 'Hole', block: { type: HOLE } },
      { name: 'Grill', block: { type: GRILL }, onClick: () => {
        const level = this.state.grills.level
        return { meta: { level } }
      } },
      { name: 'Gear', block: { type: GEAR }, onClick: () => {
        return { meta: { rotationDirection: this.state.gears.rotationDirection } }
      } },
      { name: 'Conveyor', block: { type: CONVEYOR }, onClick: () => {
        return { meta: { ...this.state.conveyors }}
      } },
      { name: 'Fast Conveyor', block: { type: FAST_CONVEYOR }, onClick: () => {
        return { meta: { ...this.state.conveyors }}
      }}, { name: 'Walls', keepMeta: true, block: {}, onClick: () => {
        return { walls: { ...this.state.walls } }
      } }, {
        name: 'Pushers', keepMeta: true, block: {}, onClick: () => {
          return { pushers: { ...this.state.pushers } }
        }
      }
    ]

    const { playerID, ctx } = this.props
    let { activePlayers } = ctx
    const cards = this.props.G.players[playerID].hand
    const playerRobot = this.props.G.robots[playerID]

    if (activePlayers === null) activePlayers = {}

    if (!cards) {
      return <p>No cards</p>
    }

    console.log(this.state)

    return (
      <div>
        <ROTATION_CONTEXT.Provider value={this.state.rotation}>
          <span style={{ position: 'fixed', zIndex: 25 }}>
              <div style={{
                position: 'fixed',
                bottom: '0px',
                left: '50%',
                transform: 'translateX(-50%)',
              }}>
                <Button style={{ display: 'inline-block' }} onClick={() => this.rotateBoard(false)} text='Rotate Anticlockwise' />
                <Button style={{ display: 'inline-block' }} onClick={() => this.rotateBoard(true)} text='Rotate Clockwise' />
                <Button style={{ display: 'inline-block' }} onClick={() => this.inspectTile()} text='Inspection' />
                { tiles.map(tile =>
                  <Button
                    key={tile.name}
                    style={{ display: 'inline-block' }}
                    onClick={() => this.changeBlockType(tile.block, tile.onClick, tile.keepMeta)}
                    text={tile.name}
                  />
                )}
                <Button style={{ display: 'inline-block' }} onClick={() => {
                  this.setState({ map: JSON.parse(prompt('enter map string', '{}')) })
                }}text='IMPORT MAP' />
                <CopyToClipboard
                  text={JSON.stringify(this.state.map, null, 2)}
                  onCopy={() => alert('Copied to clipboard')}
                >
                  <Button style={{ display: 'inline-block' }} text='EXPORT MAP' />
                </CopyToClipboard>
              </div>

          </span>
          <Map
            map={this.state.map}
            robots={this.props.G.robots}
            playerRobot={playerRobot}
            onTileClick={this.onTileClick.bind(this)}
            customHoverTile={this.customHoverTile.bind(this)}
            state={this.state}
          />

        </ROTATION_CONTEXT.Provider>

        <span class='gui'>
          <dg.GUI style={{
            top: '0px',
            left: '0px'
          }}>
            <dg.Folder label='Walls' expanded={true}>
              <dg.Checkbox
                label='North Wall'
                checked={this.state.walls[NORTH]}
                onChange={(val) => this.setState({ walls: { ...this.state.walls, [NORTH]: val } })}
              />
              <dg.Checkbox
                label='East Wall'
                checked={this.state.walls[EAST]}
                onChange={(val) => this.setState({ walls: { ...this.state.walls, [EAST]: val } })}
              />
              <dg.Checkbox
                label='South Wall'
                checked={this.state.walls[SOUTH]}
                onChange={(val) => this.setState({ walls: { ...this.state.walls, [SOUTH]: val } })}
              />
              <dg.Checkbox
                label='West Wall'
                checked={this.state.walls[WEST]}
                onChange={(val) => this.setState({ walls: { ...this.state.walls, [WEST]: val } })}
              />
            </dg.Folder>
            <dg.Folder label='Lasers'>
              <dg.Checkbox
                label='North Laser'
                checked={this.state.lasers[NORTH]}
                onChange={(val) => this.setState({ lasers: { ...this.state.lasers, [NORTH]: val } })}
              />
              <dg.Checkbox
                label='East Laser'
                checked={this.state.lasers[EAST]}
                onChange={(val) => this.setState({ lasers: { ...this.state.lasers, [EAST]: val } })}
              />
              <dg.Checkbox
                label='South Laser'
                checked={this.state.lasers[SOUTH]}
                onChange={(val) => this.setState({ lasers: { ...this.state.lasers, [SOUTH]: val } })}
              />
              <dg.Checkbox
                label='West Laser'
                checked={this.state.lasers[WEST]}
                onChange={(val) => this.setState({ lasers: { ...this.state.lasers, [WEST]: val } })}
              />
            </dg.Folder>
            <dg.Folder label='Pushers'>
              <dg.Folder label='North Pusher'>
                <dg.Checkbox
                  label='Register 1'
                  checked={this.state.pushers[NORTH][0]}
                  onChange={(val) => this.onPusherChange(NORTH, 0, val)}
                />
                <dg.Checkbox
                  label='Register 2'
                  checked={this.state.pushers[NORTH][1]}
                  onChange={(val) => this.onPusherChange(NORTH, 1, val)}
                />
                <dg.Checkbox
                  label='Register 3'
                  checked={this.state.pushers[NORTH][2]}
                  onChange={(val) => this.onPusherChange(NORTH, 2, val)}
                />
                <dg.Checkbox
                  label='Register 4'
                  checked={this.state.pushers[NORTH][3]}
                  onChange={(val) => this.onPusherChange(NORTH, 3, val)}
                />
                <dg.Checkbox
                  label='Register 5'
                  checked={this.state.pushers[NORTH][4]}
                  onChange={(val) => this.onPusherChange(NORTH, 4, val)}
                />
              </dg.Folder>
              <dg.Folder label='East Pusher'>
                <dg.Checkbox
                  label='Register 1'
                  checked={this.state.pushers[EAST][0]}
                  onChange={(val) => this.onPusherChange(EAST, 0, val)}
                />
                <dg.Checkbox
                  label='Register 2'
                  checked={this.state.pushers[EAST][1]}
                  onChange={(val) => this.onPusherChange(EAST, 1, val)}
                />
                <dg.Checkbox
                  label='Register 3'
                  checked={this.state.pushers[EAST][2]}
                  onChange={(val) => this.onPusherChange(EAST, 2, val)}
                />
                <dg.Checkbox
                  label='Register 4'
                  checked={this.state.pushers[EAST][3]}
                  onChange={(val) => this.onPusherChange(EAST, 3, val)}
                />
                <dg.Checkbox
                  label='Register 5'
                  checked={this.state.pushers[EAST][4]}
                  onChange={(val) => this.onPusherChange(EAST, 4, val)}
                />
              </dg.Folder>
              <dg.Folder label='South Pusher'>
                <dg.Checkbox
                  label='Register 1'
                  checked={this.state.pushers[SOUTH][0]}
                  onChange={(val) => this.onPusherChange(SOUTH, 0, val)}
                />
                <dg.Checkbox
                  label='Register 2'
                  checked={this.state.pushers[SOUTH][1]}
                  onChange={(val) => this.onPusherChange(SOUTH, 1, val)}
                />
                <dg.Checkbox
                  label='Register 3'
                  checked={this.state.pushers[SOUTH][2]}
                  onChange={(val) => this.onPusherChange(SOUTH, 2, val)}
                />
                <dg.Checkbox
                  label='Register 4'
                  checked={this.state.pushers[SOUTH][3]}
                  onChange={(val) => this.onPusherChange(SOUTH, 3, val)}
                />
                <dg.Checkbox
                  label='Register 5'
                  checked={this.state.pushers[SOUTH][4]}
                  onChange={(val) => this.onPusherChange(SOUTH, 4, val)}
                />
              </dg.Folder>
              <dg.Folder label='West Pusher'>
                <dg.Checkbox
                  label='Register 1'
                  checked={this.state.pushers[WEST][0]}
                  onChange={(val) => this.onPusherChange(WEST, 0, val)}
                />
                <dg.Checkbox
                  label='Register 2'
                  checked={this.state.pushers[WEST][1]}
                  onChange={(val) => this.onPusherChange(WEST, 1, val)}
                />
                <dg.Checkbox
                  label='Register 3'
                  checked={this.state.pushers[WEST][2]}
                  onChange={(val) => this.onPusherChange(WEST, 2, val)}
                />
                <dg.Checkbox
                  label='Register 4'
                  checked={this.state.pushers[WEST][3]}
                  onChange={(val) => this.onPusherChange(WEST, 3, val)}
                />
                <dg.Checkbox
                  label='Register 5'
                  checked={this.state.pushers[WEST][4]}
                  onChange={(val) => this.onPusherChange(WEST, 4, val)}
                />
              </dg.Folder>
            </dg.Folder>
            <dg.Folder label='Grills' expanded={true}>
              <dg.Number
                label='Level'
                value={this.state.grills.level}
                onChange={(val) => this.setState({ grills: { ...this.state.grills, level: val } })}
              />
            </dg.Folder>
            <dg.Folder label='Flags' expanded={true}>
              <dg.Number
                label='Number'
                value={this.state.flags.flagNumber}
                onChange={(val) => this.setState({ flags: { ...this.state.flags, flagNumber: val } })}
              />
            </dg.Folder>
            <dg.Folder label='Gears' expanded={true}>
              <dg.Checkbox
                label='Rotate Clockwise'
                checked={this.state.gears.rotationDirection === CLOCKWISE}
                onChange={(val) => this.setState({ gears: { ...this.state.gears, rotationDirection: val ? CLOCKWISE : ANTICLOCKWISE } })}
              />
            </dg.Folder>
            <dg.Folder label='Conveyor Belts' expanded={true}>
              <dg.Folder label='Input Directions'>
                <dg.Checkbox
                  label='North'
                  checked={this.state.conveyors.inputDirections[NORTH]}
                  onChange={(val) => this.setState({ conveyors: { ...this.state.conveyors, inputDirections: { ...this.state.conveyors.inputDirections, [NORTH]: val } } })}
                />
                <dg.Checkbox
                  label='East'
                  checked={this.state.conveyors[EAST]}
                  onChange={(val) => this.setState({ conveyors: { ...this.state.conveyors, inputDirections: { ...this.state.conveyors.inputDirections, [EAST]: val } } })}
                />
                <dg.Checkbox
                  label='South'
                  checked={this.state.conveyors[SOUTH]}
                  onChange={(val) => this.setState({ conveyors: { ...this.state.conveyors, inputDirections: { ...this.state.conveyors.inputDirections, [SOUTH]: val } } })}
                />
                <dg.Checkbox
                  label='West'
                  checked={this.state.conveyors[WEST]}
                  onChange={(val) => this.setState({ conveyors: { ...this.state.conveyors, inputDirections: { ...this.state.conveyors.inputDirections, [WEST]: val } } })}
                />
              </dg.Folder>
              <dg.Select
                label='Output Direction'
                options={[NORTH, EAST, SOUTH, WEST]}
                value={this.state.conveyors.exitDirection}
                onChange={(val) => this.setState({ conveyors: { ...this.state.conveyors, exitDirection: val }})}
              />
            </dg.Folder>
          </dg.GUI>
        </span>
      </div >
    )
  }
}