import React from 'react'
import CardHand from './CardHand'

export class InHandDeck extends React.Component {
    render() {
        const { cards, isPlayerActive, onCardClick } = this.props

        return (
            <CardHand
                cards={cards}
                id='in_hand'
                isActive={isPlayerActive}
                onClick={onCardClick}
                style={{
                    position: 'fixed',
                    top: '0px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 50
                }}
            />
        )
    }
}