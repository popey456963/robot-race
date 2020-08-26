import React from 'react'
import Cell from './Cell'

export default class NewRow extends React.PureComponent {
    render() {
        const { row, index } = this.props

        return (
            <tr
                style={{
                    transform: `translateY(${index * 4}em)`
                }}
            >{
                row.map((cell, cellIndex) => (
                    <Cell
                        key={cellIndex}
                        cell={cell}
                        cellIndex={cellIndex}
                    />
                ))
            }</tr>
        )
    }
}
