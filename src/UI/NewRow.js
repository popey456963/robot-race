import React from 'react'
import Cell from './Cell'

export default class NewRow extends React.PureComponent {
    render() {
        const { row, index, zoom } = this.props

        return (
            <tr
                style={{
                    transform: `translateY(${index * 4 * zoom}em)`
                }}
            >{
                row.map((cell, cellIndex) => (
                    <Cell
                        key={cellIndex}
                        cell={cell}
                        cellIndex={cellIndex}
                        zoom={zoom}

                        onTileClick={this.props.onTileClick}
                        onTileHover={this.props.onTileHover}
                    />
                ))
            }</tr>
        )
    }
}
