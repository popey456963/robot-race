import React from 'react';
import Row from './Row';
import './Tile.css';
import { convertTouchIfMobile } from './utils'

const GameScrollManager = require('./GameScrollManager')

export default class Map extends React.Component {
    constructor(props) {
        super(props)
    
        this.state = {
          height: window.innerHeight,
          width: window.innerWidth,

          offset: {
              x: 0,
              y: 0
          }
        }

        this.handleResize = this.handleResize.bind(this)
      }

      componentDidMount() {
        window.addEventListener('resize', this.handleResize)
		GameScrollManager.setDragCallback(this.onDrag);
		GameScrollManager.setClickCallback(this.onClickFinalized);
      }

      componentWillUnmount() {
		GameScrollManager.handleMouseUp();
		GameScrollManager.setDragCallback(null);
		GameScrollManager.setClickCallback(null);
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

    handleDrag(e) {
        console.log(e)
    }

    render() {
        const { map, robots } = this.props

        return (
            <div
                onMouseDown={this.onMouseDown}
                onTouchStart={this.onMouseDown}
                onMouseMove={this.onMouseMove}
                onTouchMove={this.onMouseMove}
                onMouseUp={this.onMouseUp}
                onTouchEnd={this.onMouseUp}
            >
                <table style={{left: `${this.state.width / 2 + this.state.offset.x}px`, top: `${this.state.height / 4 + this.state.offset.y}px`}} className='iso' onDrag={this.handleDrag}><tbody>{map.map((row, rowId) => 
                    (<Row
                        key={rowId}
                        row={row}
                        rowId={rowId}
                        robots={robots}
                    />)
                )}</tbody>
                </table>
            </div>
        )
    }
}