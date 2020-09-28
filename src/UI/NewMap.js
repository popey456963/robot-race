import React from 'react'
import Row from './NewRow'
import GameZoomManager from './GameZoomManager'
import GameScrollManager from './GameScrollManager'
import { convertTouchIfMobile } from '../utils'

export default class NewMap extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            height: window.innerHeight,
            width: window.innerWidth,

            offsetX: 0,
            offsetY: 0,

            zoom: GameZoomManager.zoom
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize)
        GameScrollManager.setDragCallback(this.onDrag)
        GameZoomManager.setOnZoomChanged(this.onZoomChanged)
        GameZoomManager.setSaveZoom(false)
        GameZoomManager.resetZoomToDefault()
    }

    componentWillUnmount() {
        GameScrollManager.handleMouseUp()
        GameScrollManager.setDragCallback(null)
        GameZoomManager.setOnZoomChanged(null)
        window.removeEventListener('resize', this.handleResize)
    }

    onZoomChanged = (z) => {
        this.setState({ zoom: z })
    }

    onMouseDown(e) {
        e = convertTouchIfMobile(e)
        document.activeElement.blur()
        GameScrollManager.handleMouseDown(e)
    }

    onMouseMove(e) {
        e = convertTouchIfMobile(e)
        GameScrollManager.handleMouseMove(e)
    }

    onMouseUp() {
        GameScrollManager.handleMouseUp()
    }

    onContextMenu(e) {
        e.preventDefault()
        return false
    }

    onDrag = (dx, dy) => {
        this.setState({
            offsetX: this.state.offsetX + dx,
            offsetY: this.state.offsetY + dy
        })
    }

    handleResize = () => {
        this.setState({
            height: window.innerHeight,
            width: window.innerWidth
        })
    }

    render() {
        const { map } = this.props

        return (
            <div
                className="selectDisable"
                onMouseDown={this.onMouseDown}
                onTouchStart={this.onMouseDown}
                onMouseMove={this.onMouseMove}
                onTouchMove={this.onMouseMove}
                onMouseUp={this.onMouseUp}
                onTouchEnd={this.onMouseUp}
                onWheel={GameZoomManager.onWheel}
                style={{
                    left: this.state.width / 2 + this.state.offsetX,
                    top: this.state.height / 4 + this.state.offsetY,
                    position: 'relative',
                    zIndex: 10
                }}
            >
                <table
                    className='iso'
                >
                <tbody>{
                    map.map((row, rowId) => (
                        <Row
                            key={rowId}
                            row={row}
                            index={rowId}
                            zoom={GameZoomManager.percentSize()}

                            onTileClick={this.props.onTileClick}
                            onTileHover={this.props.onTileHover}
                        />
                    ))
                }</tbody>
                </table>
            </div>
        )
    }
}
