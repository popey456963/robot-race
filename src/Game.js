import { PlayerView, TurnOrder, Stage } from 'boardgame.io/core'
import { NORTH, EAST, SOUTH, WEST } from './Constants'
import {MOVE_ONE, MOVE_TWO, MOVE_THREE,
    BACK_UP, ROTATE_RIGHT, ROTATE_LEFT, U_TURN } from './Constants'
import { PLAIN, FLAG, HOLE } from './Constants'
import Deck from './Deck'
import { findRobots } from './utils'

function drawAllCards(G, ctx) {
    const deck = new Deck(ctx)
    
    for (let player of ctx.playOrder) {
        G.players[player].hand = []
        for (let i = 0; i < 9; i++) {
            G.players[player].hand.push(deck.drawCard())
        }
    }    
}

function moveRobot(position, direction) {
    let new_position = position
    if (direction == NORTH) {
        // Check for walls here
        new_position.y -= 1
    }
    if (direction == SOUTH) {
        new_position.y += 1
    }
    if (direction == EAST) {
        new_position.x += 1
    }
    if (direction == WEST) {
        new_position.x -= 1
    }
    return new_position
}

function rotate_90_clockwise(cur_direction, times) {
    for (let i = 0; i < times; i++) {
        switch (cur_direction) {
            case NORTH: cur_direction = EAST; break;
            case EAST: cur_direction = SOUTH; break;
            case SOUTH: cur_direction = WEST; break;
            case WEST: cur_direction = NORTH; break;
        }
    }
    return cur_direction
}

function checkCurrentSquare(G, position, player) {
    // check for holes / edge of map
    if (G.map[position.y] === undefined ||
        G.map[position.y][position.x] === undefined ||
        G.map[position.y][position.x].type === HOLE) {

        G.players[player].damage = 10
        console.log("FELL TO DEATH")
    }
}

function enactMove(move, G) {
    console.log("enacting move", move)

    const r = G.robots[move.player]
    switch (move.move.type) {
        case MOVE_THREE:
            r.position = moveRobot(r.position, r.direction)
            checkCurrentSquare(G, r.position, move.player)
        case MOVE_TWO:
            r.position = moveRobot(r.position, r.direction)
            checkCurrentSquare(G, r.position, move.player)
        case MOVE_ONE:
            r.position = moveRobot(r.position, r.direction)
            checkCurrentSquare(G, r.position, move.player)
            break
        case BACK_UP:
            r.direction = rotate_90_clockwise(r.direction, 2)
            r.position = moveRobot(r.position, r.direction)
            r.direction = rotate_90_clockwise(r.direction, 2)
            checkCurrentSquare(G, r.position, move.player)
            break
        case ROTATE_RIGHT:
            r.direction = rotate_90_clockwise(r.direction, 1)
            break
        case ROTATE_LEFT:
            r.direction = rotate_90_clockwise(r.direction, 3)
            break
        case U_TURN:
            r.direction = rotate_90_clockwise(r.direction, 2)
            break
    }
}

function findInMap(map, type) {
    let tiles = []

    for (let [rowId, row] of Object.entries(map)) {
        for (let [columnId, item] of Object.entries(row)) {
            if (item.type === type) {
                tiles.push({ x: columnId, y: rowId, item })
            }
        }
    }

    return tiles
}

function enactEnvironment(state, register) {
    const flags = findInMap(state.map, FLAG)

    for (let flag of flags) {
        const robot = findRobots(flag, state.robots)

        if (robot) {
            state.robots[robot.user].checkpoint = flag
            if (!state.robots[robot.user].flags.includes(flag.item.meta.flagNumber)) {
                state.robots[robot.user].flags.push(flag.item.meta.flagNumber)
            }
        }
    }
}

export const RobotFight = {
    name: 'robot-fight',

    setup: (ctx, setupData) => {
        const state = {
            players: {},
            map: new Array(10).fill(null).map(() => new Array(10).fill(null).map(() => ({ type: PLAIN }))),
            robots: {}
        }

        state.map[2][3] = { type: FLAG, meta: { flagNumber: 1 } }

        state.meta = {
            flagCount: 1
        }

        let i = 0
        for (let player of ctx.playOrder) {
            i += 1

            state.players[player] = {
                hand: []
            }

            state.robots[player] = {
                position: { x: 0, y: i },
                direction: EAST,
                poweredDown: false,
                damage: 0,
                upgrades: [],
                flags: [],
                checkpoint: { x: 0, y: i },
                lives: 3
            }
        }
    },

    // playerView: PlayerView.STRIP_SECRETS,

    phases: {
        play: {
            onBegin: (G, ctx) => {
                for (let player of ctx.playOrder) {
                    G.players[player].registers = undefined
                }

                drawAllCards(G, ctx)

                ctx.events.setActivePlayers({
                    all: Stage.NULL,
                    // moveLimit: 1
                })
            },
            moves: {
                submitOrders: (G, ctx, selected, player) => {
                    G.players[player].registers = selected
                    ctx.events.endStage()

                    if (Object.keys(ctx.activePlayers).length === 1) {
                        ctx.events.endPhase();
                    }
                }
            },
            onEnd: (G, ctx) => {
                for (let i = 0; i < 5; i++) {
                    let register = []

                    for (let [playerId, player] of Object.entries(G.players)) {
                        if (player.registers[i]) {
                            register.push({
                                player: playerId,
                                move: { type: player.registers[i].type, priority: player.registers[i].priority }
                            })
                        }
                    }

                    register.sort((a, b) => a.move.priority - b.move.priority)
                    
                    for (let move of register) {
                        enactMove(move, G)
                    }

                    enactEnvironment(G, i)
                }

                // robot 1 rotate right
                // robot 2 take damage
                // robot 3 move from 0, 0, to 0, 1
            },
            turn: {
                order: TurnOrder.ONCE
            },
            start: true,
            next: 'play'
        }
    }
}