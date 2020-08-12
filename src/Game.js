import { PlayerView, TurnOrder, Stage } from 'boardgame.io/core'
import {
  NORTH, EAST, SOUTH, WEST,
  MOVE_ONE, MOVE_TWO, MOVE_THREE,
  BACK_UP, ROTATE_RIGHT, ROTATE_LEFT, U_TURN
  , PLAIN, FLAG, HOLE
} from './Constants'

import Deck from './Deck'
import { findRobots } from './utils'

function drawAllCards(G, ctx) {
  const deck = new Deck(ctx)

  for (const player of ctx.playOrder) {
    G.players[player].hand = []
    for (let i = 0; i < 9; i++) {
      G.players[player].hand.push(deck.drawCard())
    }
  }
}

function calculateMoveDest(position, direction) {
  const newPosition = { x: position.x, y: position.y }
  if (direction === NORTH) {
    // Check for walls here
    newPosition.y -= 1
  }
  if (direction === SOUTH) {
    newPosition.y += 1
  }
  if (direction === EAST) {
    newPosition.x += 1
  }
  if (direction === WEST) {
    newPosition.x -= 1
  }
  return newPosition
}

function moveRobot(G, robot, direction) {
  if (G.map[robot.position.y][robot.position.x].walls[direction]) {
    return false
  }

  const new_position = calculateMoveDest(robot.position, direction)
  const other_robot = findRobots(new_position, G.robots)
  if ((other_robot !== undefined && moveRobot(G, other_robot, direction)) ||
    other_robot === undefined) {
    robot.position = new_position
  }

  checkCurrentSquare(G, robot.position, robot.user)

  return true
}

function rotate_90_clockwise(cur_direction, times) {
  for (let i = 0; i < times; i++) {
    switch (cur_direction) {
      case NORTH: cur_direction = EAST; break
      case EAST: cur_direction = SOUTH; break
      case SOUTH: cur_direction = WEST; break
      case WEST: cur_direction = NORTH; break
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
    console.log('FELL TO DEATH')
  }
}

function enactMove(move, G) {
  console.log('enacting move', move)

  const r = G.robots[move.player]
  switch (move.move.type) {
    case MOVE_THREE:
      moveRobot(G, r, r.direction)
    case MOVE_TWO:
      moveRobot(G, r, r.direction)
    case MOVE_ONE:
      moveRobot(G, r, r.direction)
      break
    case BACK_UP:
      r.direction = rotate_90_clockwise(r.direction, 2)
      moveRobot(G, r, r.direction)
      r.direction = rotate_90_clockwise(r.direction, 2)
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
  const tiles = []

  for (const [rowId, row] of Object.entries(map)) {
    for (const [columnId, item] of Object.entries(row)) {
      if (item.type === type) {
        tiles.push({ x: Number(columnId), y: Number(rowId), item })
      }
    }
  }

  return tiles
}

function enactEnvironment(state, register) {
  const flags = findInMap(state.map, FLAG)

  for (const flag of flags) {
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
    const NO_WALLS = {
      [NORTH]: false,
      [EAST]: true,
      [SOUTH]: false,
      [WEST]: false
    }

    const state = {
      players: {},
      map: new Array(10).fill(null).map(
        () => new Array(10).fill(null).map(() => ({ type: PLAIN, walls: NO_WALLS }))
      ),
      robots: {}
    }

    state.map[2][3] = { type: FLAG, walls: NO_WALLS, meta: { flagNumber: 1 } }

    state.meta = {
      flagCount: 1
    }

    let i = 0
    for (const player of ctx.playOrder) {
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
        lives: 3,
        user: player
      }
    }

    return state
  },

  // playerView: PlayerView.STRIP_SECRETS,

  phases: {
    play: {
      onBegin: (G, ctx) => {
        for (const player of ctx.playOrder) {
          G.players[player].registers = undefined
        }

        drawAllCards(G, ctx)

        ctx.events.setActivePlayers({
          all: Stage.NULL
          // moveLimit: 1
        })
      },
      moves: {
        submitOrders: (G, ctx, selected, player) => {
          G.players[player].registers = selected
          ctx.events.endStage()

          if (Object.keys(ctx.activePlayers).length === 1) {
            ctx.events.endPhase()
          }
        }
      },
      onEnd: (G, ctx) => {
        for (let i = 0; i < 5; i++) {
          const register = []

          for (const [playerId, player] of Object.entries(G.players)) {
            if (player.registers[i]) {
              register.push({
                player: playerId,
                move: { type: player.registers[i].type, priority: player.registers[i].priority }
              })
            }
          }

          register.sort((a, b) => a.move.priority - b.move.priority)

          for (const move of register) {
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
