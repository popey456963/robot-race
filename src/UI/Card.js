import React from 'react'
import {
    MOVE_ONE, MOVE_TWO, MOVE_THREE, BACK_UP, ROTATE_RIGHT, ROTATE_LEFT, U_TURN,
    MOVE_ONE_CARD_TEXTS, MOVE_TWO_CARD_TEXTS, MOVE_THREE_CARD_TEXTS, BACK_UP_CARD_TEXTS, ROTATE_RIGHT_CARD_TEXTS, ROTATE_LEFT_CARD_TEXTS, U_TURN_CARD_TEXTS,
} from '../Constants'

const symbolMapping = {
    [MOVE_ONE]: MOVE_ONE_CARD_TEXTS,
    [MOVE_TWO]: MOVE_TWO_CARD_TEXTS,
    [MOVE_THREE]: MOVE_THREE_CARD_TEXTS,
    [BACK_UP]: BACK_UP_CARD_TEXTS,
    [ROTATE_RIGHT]: ROTATE_RIGHT_CARD_TEXTS,
    [ROTATE_LEFT]: ROTATE_LEFT_CARD_TEXTS,
    [U_TURN]: U_TURN_CARD_TEXTS
}

const getItemStyle = (draggableStyle) => ({
    userSelect: 'none',
    padding: 8 * 2,
    margin: `0 0 ${8}px 0`,

    ...draggableStyle
})

export default class Card extends React.Component {
    render() {
        const { provided, card } = this.props

        const text = symbolMapping[card.type]

        return (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getItemStyle(provided.draggableProps.style)}
                className="card"
            >
                <div className="mark dark">
                    {card.priority} <span className='symbol'>{text.symbol}</span>
                </div>
                <div className="content">
                    <h1>{text.firstLine}</h1>
                    <h2><span className="dark">{text.secondLine}</span></h2>
                </div>
                <div className="mark upside-down">
                    {card.priority} <span className='symbol'>{text.symbol}</span>
                </div>
            </div>
        )
    }
}