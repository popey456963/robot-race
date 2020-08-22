import { MOVE_ONE, MOVE_TWO, MOVE_THREE, BACK_UP, ROTATE_RIGHT, ROTATE_LEFT, U_TURN } from './Constants'

export function createCardType(type, n) {
  return new Array(n).fill(null).map(() => ({ type, priority: 0 }))
}

export function interleave(a, b) {
  // expects same number in both arrays
  return a.reduce((acc, cur, index) => acc.concat(cur, b[index]), [])
}

export default class Deck {
  constructor (ctx, lockedCardPriorities = []) {

    // uturn : 10-60
    // rotate_left, rotate_right: 70 - 420
    // backup: 430 - 480
    // move1: 490 - 660
    // move2: 670 - 780
    // move3: 790-840
    this.cards = [
      ...createCardType(U_TURN, 6),
      ...interleave(createCardType(ROTATE_RIGHT, 18), createCardType(ROTATE_LEFT, 18)),

      ...createCardType(BACK_UP, 6),
      ...createCardType(MOVE_ONE, 18),
      ...createCardType(MOVE_TWO, 12),
      ...createCardType(MOVE_THREE, 6),
    ]

    for (let i = 0; i < this.cards.length; i++) {
      this.cards[i].priority = (i + 1) * 10
    }
    this.cards = ctx.random.Shuffle(this.cards)
    this.cards.filter(card => !(card.priority in lockedCardPriorities))
  }

  drawCard() {
    if (this.cards.length === 0) {
      throw new Error('Cannot draw a card from the deck.')
    }
    return this.cards.pop()
  }
}
