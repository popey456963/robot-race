import Deck, { createCardType, interleave } from './Deck'
import { MOVE_ONE, U_TURN, BACK_UP } from './Constants'

// not a true shuffle
const ctx = {
    random: {
        Shuffle: a => a
    }
}

test('create card type', () => {
    expect(createCardType(MOVE_ONE, 1)).toMatchSnapshot()
    expect(createCardType(U_TURN, 2)).toMatchSnapshot()
    expect(createCardType(BACK_UP, 0)).toMatchSnapshot()
})

test('interleave', () => {
    expect(interleave(['a', 'b'], ['c', 'd'])).toMatchSnapshot()
})

test('deck', () => {
    const deck = new Deck(ctx)
    expect(deck.cards).toMatchSnapshot()

    const deck2 = new Deck(ctx, [10, 50, 100])
    expect(deck2.cards).toMatchSnapshot()

    expect(deck2.drawCard()).toMatchSnapshot()
    expect(deck2.drawCard()).toMatchSnapshot()
    expect(deck2.drawCard()).toMatchSnapshot()

    expect(deck2.cards).toMatchSnapshot()

    deck2.cards = []

    expect(() => deck2.drawCard()).toThrow()
})