import { PlayerView, TurnOrder } from 'boardgame.io/core'
import { NORTH, EAST, SOUTH, WEST } from './Constants'
import { PLAIN } from './Constants'
import Deck from './Deck'

function drawAllCards(G, ctx) {
    const deck = new Deck(ctx)
    
    for (let player of ctx.playOrder) {
        G.players[player].hand = []
        for (let i = 0; i < 9; i++) {
            G.players[player].hand.push(deck.drawCard())
        }
    }    
}

export const TicTacToe = {
    name: 'robot-fight',

    setup: (ctx, setupData) => {
        const state = {
            players: {},
            map: new Array(10).fill(null).map(() => new Array(10).fill(null).map(() => ({ type: PLAIN }))),
            robots: {}
        }

        let i = 0
        for (let player of ctx.playOrder) {
            i += 1

            state.players[player] = {
                hand: []
            }

            state.robots[player] = {
                position: { x: 0, y: i },
                direction: NORTH,
                poweredDown: false,
                damage: 0,
                upgrades: []
            }
        }

        return state
    },

    playerView: PlayerView.STRIP_SECRETS,

    phases: {
        play: {
            onBegin: (G, ctx) => {
                drawAllCards(G, ctx)
            },
            moves: {
                submitOrders: (G, ctx) => {
                    ctx.events.endTurn()
                }
            },
            onEnd: (G, ctx) => {

            },
            turn: {
                order: TurnOrder.ONCE
            },
            start: true,
            next: 'play'
        }
    }
}