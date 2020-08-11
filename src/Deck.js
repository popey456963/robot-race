import { MOVE_ONE, MOVE_TWO, MOVE_THREE, BACK_UP, ROTATE_RIGHT, ROTATE_LEFT, U_TURN } from './Constants'

function CreateCardType(type, n) {
    return new Array(n).fill(null).map(() => ({ type, priority: 0 }))
}

export default class Deck {
    constructor(ctx) {
        this.cards = [
            ...CreateCardType(MOVE_ONE, 18),
            ...CreateCardType(MOVE_TWO, 12),
            ...CreateCardType(MOVE_THREE, 6),
            ...CreateCardType(BACK_UP, 6),

            ...CreateCardType(ROTATE_RIGHT, 18),
            ...CreateCardType(ROTATE_LEFT, 18),
            ...CreateCardType(U_TURN, 6)
        ]

        this.cards = ctx.random.Shuffle(this.cards)
        for (let i = 0; i < this.cards.length; i++) {
            this.cards[i].priority = (i + 1) * 10
        }
        this.cards = ctx.random.Shuffle(this.cards)
    }

    drawCard() {
        if (this.cards.length === 0) {
            throw new Error('Cannot draw a card from the deck.')
        }
        return this.cards.pop()
    }
}