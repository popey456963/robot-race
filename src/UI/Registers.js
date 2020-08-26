import React from 'react'
import CardHand from './CardHand'

export class Registers extends React.Component {
    render() {
        const { cards, isPlayerActive, onCardClick } = this.props

        return (
            <CardHand
                cards={cards}
                id='to_play'
                isActive={isPlayerActive}
                onClick={onCardClick}
            />
        )
    }
}