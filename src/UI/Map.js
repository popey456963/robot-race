import React from 'react';
import Row from './Row';
import './Tile.css';
import './Tooltips.css';
import { ROTATION_CONTEXT } from './ReactConstants'
import { convertTouchIfMobile } from '../utils'
import { getAngleIndex } from '../Position';

const GameScrollManager = require('./GameScrollManager')
const GameZoomManager = require('./GameZoomManager')

export default class Map extends React.Component {
    static contextType = ROTATION_CONTEXT
    constructor(props) {
        super(props)

        this.state = {
            height: window.innerHeight,
            width: window.innerWidth,

            offset: {
                x: 0,
                y: 0
            },

            zoom: GameZoomManager.zoom
        }

        this.handleResize = this.handleResize.bind(this)
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize)
        GameScrollManager.setDragCallback(this.onDrag);
        GameScrollManager.setClickCallback(this.onClickFinalized);
        GameZoomManager.setOnZoomChanged(this.onZoomChanged);
        GameZoomManager.setSaveZoom(false);
        GameZoomManager.resetZoomToDefault();
    }

    onZoomChanged = (z) => {
        this.setState({ zoom: z })
    }

    componentWillUnmount() {
        GameScrollManager.handleMouseUp();
        GameScrollManager.setDragCallback(null);
        GameScrollManager.setClickCallback(null);
        GameZoomManager.setOnZoomChanged(null);
        window.removeEventListener('resize', this.handleResize)
    }

    onMouseDown = (e) => {
        e = convertTouchIfMobile(e);
        document.activeElement.blur();
        GameScrollManager.handleMouseDown(e);
    };

    onMouseMove = (e) => {
        e = convertTouchIfMobile(e);
        GameScrollManager.handleMouseMove(e);
    };

    onMouseUp = () => {
        GameScrollManager.handleMouseUp();
    };

    onContextMenu = (e) => {
        e.preventDefault();
        return false;
    };

    onDrag = (dx, dy) => {
        this.setState({
            offset: {
                x: this.state.offset.x + dx,
                y: this.state.offset.y + dy,
            },
        });
    };

    onClickFinalized = () => {

    };

    handleResize() {
        this.setState({
            height: window.innerHeight,
            width: window.innerWidth
        })
    }

    render() {
        let { state, map, robots, playerRobot, onTileClick, customHoverTile } = this.props

        function rotateMatrix(a) {
            a = Object.keys(a[0]).map(c => a.map(r => r[c]))
            for (let i in a) a[i] = a[i].reverse()
            return a
        }

        let rotatedMap = map
        for (let i = 0; i < getAngleIndex(this.context); i++) {
            rotatedMap = rotateMatrix(rotatedMap)
        }

        return (
            <div
                onMouseDown={this.onMouseDown}
                onTouchStart={this.onMouseDown}
                onMouseMove={this.onMouseMove}
                onTouchMove={this.onMouseMove}
                onMouseUp={this.onMouseUp}
                onTouchEnd={this.onMouseUp}
                onWheel={GameZoomManager.onWheel}
                className="selectDisable"
                style={{
                    position: 'relative',
                    zIndex: 10
                }}
            >
                <table style={{ left: `${this.state.width / 2 + this.state.offset.x}px`, top: `${this.state.height / 4 + this.state.offset.y}px` }} className='iso' onDrag={this.handleDrag}><tbody>{rotatedMap.map((row, rowId) =>
                    (<Row
                        key={rowId}
                        row={row}
                        sizeY={rotatedMap.length}
                        rowId={rowId}
                        state={state}
                        playerRobot={playerRobot}
                        zoom={this.state.zoom}
                        onTileClick={onTileClick}
                        customHoverTile={customHoverTile}
                    />)
                )}</tbody>
                </table>
            </div>
        )
    }
}