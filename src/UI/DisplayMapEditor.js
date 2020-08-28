import React from 'react'
import PropTypes from 'prop-types'
import { NORTH, EAST, SOUTH, WEST, CLOCKWISE, ANTICLOCKWISE, NE, PLAIN, HOLE, FLAG, GRILL, GEAR, CONVEYOR, FAST_CONVEYOR, NW, SW, SE } from '../Constants'
import * as dg from 'dis-gui';
import { getDisplayMap, setMapTile } from '../Map'
import Button from './Button'
import Map from './NewMap'
import cloneDeep from 'clone-deep';
import { CopyToClipboard } from 'react-copy-to-clipboard'

export class DisplayMapEditor extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            rotation: NE,

            inspect: true,
            map: this.props.G.map,

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
            },

            button: undefined
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

    setOnTileClick(button) {
        this.setState({ button })
    }
    
    onTileClick(cell) {
        if (!this.state.button) return

        const { tile } = cell
        const position = { ...tile.position }

        const newTile = this.state.button.onClick(tile)

        setMapTile(this.state.map, position, newTile)
        this.setState({ map: this.state.map })
    }

    onTileHover(cell) {
        if (!this.state.button) return cell

        const newCell = cloneDeep(cell)
        newCell.tile = this.state.button.onClick(newCell.tile)

        // console.log('returning new cell', newCell)

        return newCell
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
        const { ctx } = this.props

        const buttons = [
            {
                name: 'Inspect',
                onClick: prevTile => prevTile,
            },
            {
                name: 'Plain',
                onClick: prevTile => {
                    delete prevTile.meta
                    prevTile.type = PLAIN
                    return prevTile
                }
            },
            {
                name: 'Flag',
                onClick: prevTile => {
                    delete prevTile.meta
                    prevTile.type = FLAG
                    prevTile.meta = { flagNumber: this.state.flags.flagNumber  }
                    return prevTile
                }
            },
            {
                name: 'Hole',
                onClick: prevTile => {
                    delete prevTile.meta
                    prevTile.type = HOLE
                    return prevTile
                }
            },
            {
                name: 'Grill',
                onClick: prevTile => {
                    delete prevTile.meta
                    prevTile.type = GRILL
                    prevTile.meta = { level: this.state.grills.level  }
                    return prevTile
                }
            },
            {
                name: 'Gear',
                onClick: prevTile => {
                    delete prevTile.meta
                    prevTile.type = GEAR
                    prevTile.meta = { rotationDirection: this.state.gears.rotationDirection }
                    return prevTile
                }
            },
            {
                name: 'Conveyor',
                onClick: prevTile => {
                    delete prevTile.meta
                    prevTile.type = CONVEYOR
                    prevTile.meta = cloneDeep(this.state.conveyors)
                    return prevTile
                }
            },
            {
                name: 'Fast Conveyor',
                onClick: prevTile => {
                    delete prevTile.meta
                    prevTile.type = FAST_CONVEYOR
                    prevTile.meta = cloneDeep(this.state.conveyors)
                    return prevTile
                }
            },
            {
                name: 'Walls',
                onClick: prevTile => {
                    prevTile.walls = cloneDeep(this.state.walls)
                    return prevTile
                }
            },
            {
                name: 'Pushers',
                onClick: prevTile => {
                    prevTile.pushers = cloneDeep(this.state.pushers)
                    return prevTile
                }
            }
        ]

        const displayMap = getDisplayMap(this.state.map, { 0: { position: { x: -1, y: -1 }, flags: [], checkpoint: { x: -1, y: -1 }} }, 0, this.state.rotation)

        return (
            <div>
                <Map
                    map={displayMap}
                    onTileClick={this.onTileClick.bind(this)}
                    onTileHover={this.onTileHover.bind(this)}
                />
                <div className="fixed bottom center" style={{ zIndex: 50 }}>
                    {
                        buttons.map(button =>
                            <Button
                                key={button.name}
                                onClick={() => this.setOnTileClick(button)}
                                text={button.name}
                                style={{ display: 'inline-block' }}
                            />
                        )
                    }

                    <Button
                        style={{ display: 'inline-block' }}
                        onClick={() => this.setState({ map: JSON.parse(prompt('enter map string', '{}'))})}
                        text={'IMPORT MAP'}
                    />
                    <CopyToClipboard
                        text={JSON.stringify(this.state.map, null, 2)}
                        onCopy={() => alert('Copied to clipboard')}
                    >
                        <Button
                            style={{ display: 'inline-block' }}
                            text={'EXPORT MAP'}
                        />
                    </CopyToClipboard>
                </div>

                <span className='gui'>
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
            </div>
        )
    }
}