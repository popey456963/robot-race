import { PlayerView, TurnOrder, Stage } from 'boardgame.io/core'
import {
  NORTH, EAST, SOUTH, WEST,
  FLAG, FAST_CONVEYOR, CONVEYOR, GRILL, GEAR,
  CLOCKWISE,
  MAX_DAMAGE, ROBOT_COLOURS
} from './Constants'

import Deck from './Deck'
import { arrayToObject } from './utils'

import { getMapTilesByType } from './Map'
import { initialiseState, findRobotAtPositionFromState } from './State'
import { rotateDirectionClockwise } from './Position'
import { createNewRobot } from './Robot'

import log from './Logger'

import createTestMap from './CustomMaps/TestMap'
import createIslandHop from './CustomMaps/IslandHop'
import createSingleTile from './CustomMaps/SingleTile'
import { enactMoves, createMove, calculateConveyorMove } from './Moves'

function drawAllCards(G, ctx) {
  const deck = new Deck(ctx)

  for (const player of ctx.playOrder) {
    G.players[player].hand = []
    for (let i = 0; i < 9; i++) {
      G.players[player].hand.push(deck.drawCard())
    }
    G.players[player].hand = G.players[player].hand.sort((a, b) => a.priority - b.priority)
  }
}

export function shouldTurnClockwise(dir, out) {
  if ((dir === SOUTH && out === WEST) || (dir === WEST && out === NORTH) || (dir === NORTH && out === EAST) || (dir === EAST && out === SOUTH)) return false
  if ((dir === SOUTH && out === WEST) || (dir === WEST && out === NORTH) || (dir === NORTH && out === EAST) || (dir === EAST && out === SOUTH)) return true

  throw new Error('not right angle')
}

function enactEnvironment(state, register) {
  for (const robot of Object.values(state.robots)) {
    if (state.map[robot.position.y][robot.position.x].type === FAST_CONVEYOR) {
      // move them by conveyor
      calculateConveyorMove(state, robot)
    }
  }

  for (const robot of Object.values(state.robots)) {
    if ([FAST_CONVEYOR, CONVEYOR].includes(state.map[robot.position.y][robot.position.x].type)) {
      // move them by conveyor
      calculateConveyorMove(state, robot)
    }
  }

  for (const robot of Object.values(state.robots)) {
    let tile = state.map[robot.position.y][robot.position.x]
    if (tile.type === GEAR) {
	  // rotate them around
      let rotationAmount = tile.meta.rotationDirection === CLOCKWISE ? 1 : 3

      log.debug({ user: robot.user, rotationAmount }, `Player ${robot.user} is on a gear and is being rotated.`)
      robot.direction = rotateDirectionClockwise(robot.direction, rotationAmount)
    }
  }

  const flags = getMapTilesByType(state.map, FLAG)

  for (const flag of flags) {
    const robot = findRobotAtPositionFromState(state, flag.position)

    if (robot) {
      state.robots[robot.user].checkpoint = flag
      log.debug({ flag }, `Updated Player ${robot.user} checkpoint`)
      if (!state.robots[robot.user].flags.includes(flag.item.meta.flagNumber)) {
        state.robots[robot.user].flags.push(flag.item.meta.flagNumber)
        log.debug(`Player ${robot.user} picked up a new flag!`)
      }
    }
  }

  for (const robot of Object.values(state.robots)) {
    let tile = state.map[robot.position.y][robot.position.x]
    if (tile.type === GRILL) {
      state.robots[robot.user].checkpoint = { ...tile, x: robot.position.x, y: robot.position.y }
      log.debug({ tile }, `Updated Player ${robot.user} checkpoint`)
    }
  }
}

function enactCleanup(state) {
  for (const robot of Object.values(state.robots)) {
    let tile = state.map[robot.position.y][robot.position.x]
    if (tile.type === GRILL) {
      const oldHealth = robot.damage
      robot.damage = Math.max(0, robot.damage - 1)

      log.debug({ user: robot.user, oldHealth, newHealth: robot.damage }, `Player ${robot.user} is on a grill and is being healed.`)
    }
  }
}

function getPlayerCardCounts(G) {
  return arrayToObject(Object.entries(G.players)
    .map(([id, player]) => [id, player.hand.length]))
}

export const RobotFight = {
  name: 'robot-fight',

  setup: (ctx, setupData) => {
    log.info({ users: ctx.playOrder }, 'Setting up a new robot fight.')

    const map = createIslandHop()

    const robots = Object.entries(ctx.playOrder).map(([index, player]) =>
      [index, createNewRobot(player, { x: 5 + Number(index), y: 14 }, NORTH, ROBOT_COLOURS[Number(index)])]
    )

    const players = Object.values(ctx.playOrder)
    const state = initialiseState(map, robots, players)

    return state
  },

  playerView: PlayerView.STRIP_SECRETS,

  phases: {
    play: {
      onBegin: (G, ctx) => {
        for (const player of ctx.playOrder) {
          G.players[player].registers = undefined
        }

        drawAllCards(G, ctx)
        
        // Respawn robots
        for (let robot in G.robots) {
          if (robot.damage === MAX_DAMAGE) {
            if (robot.lives > 1) {
              robot.lives -= 1
              robot.damage = 0
              robot.position = robot.checkpoint
            }
            else {
              robot.position = {x: -1, y: -1}
            }
          }
        }

        log.info({ handSizes: getPlayerCardCounts(G) }, 'Dealt out cards to players.')

        ctx.events.setActivePlayers({
          all: Stage.NULL
          // moveLimit: 1 //
        })

        log.info('Set all players to be active, allowing them to play.')
      },
      moves: {
        submitOrders: (G, ctx, selected, player) => {
          log.info({ player, selected }, `${player} made a turn, playing ${selected.length} cards.`)
          G.players[player].registers = selected
          ctx.events.endStage()

          if (Object.keys(ctx.activePlayers).length === 1) {
            log.info(`${player} was the last person to play, the phase is being ended.`)
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

          register.sort((a, b) => b.move.priority - a.move.priority)

          const moveRegister = register.map(move => createMove(move.move.type, move.player, move.priority))

          log.debug({ moveRegister }, `Simulating register ${i}.`)
          enactMoves(G, moveRegister)

          log.debug(`Enacting environmental map changes.`)
          enactEnvironment(G, i)

          log.debug(`End of phase.`)
        }

        log.debug(`Enacting cleanup stage.`)
        enactCleanup(G)
      },
      turn: {
        order: TurnOrder.ONCE
      },
      start: true,
      next: 'play',

      minPlayers: 1,
      maxPlayers: 5
    }
  },

  endIf: (G, ctx) => {
    for (const robot of Object.values(G.robots)) {
      if (robot.flags.length === G.meta.flagCount) {
        return {
          winner: robot
        }
      }
    }

    return undefined
  }
}
