import { PlayerView, TurnOrder, Stage } from 'boardgame.io/core'
import {
  NORTH, EAST, SOUTH, WEST, FAST_CONVEYOR, CONVEYOR, MAX_DAMAGE, ROBOT_COLOURS
} from './Constants'

import Deck from './Deck'
import { arrayToObject } from './utils'

import { getMapTile } from './Map'
import { initialiseState, listRobots } from './State'
import { createNewRobot } from './Robot'

import log from './Logger'

import createTestMap from './CustomMaps/TestMap'
import createIslandHop from './CustomMaps/IslandHop'
import createSingleTile from './CustomMaps/SingleTile'
import { enactMoves, createMove, calculateConveyorMove, calculateFlagActivation, calculateGrillHealing, calculateGrillCheckpoint, calculateGearRotation, createRobotDeath, enactRobotDeathEvent } from './Moves'
import { isTile } from './Tiles'

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
    let actions = []

	// Set robot.prev_location = robot.location
	
    for (let robot of listRobots(state)) {
        if (isTile(getMapTile(state.map, robot.position), [FAST_CONVEYOR])) {
            actions = actions.concat(calculateConveyorMove(state, robot))
        }
	}
	
	// Loop through robots. Any that share a square set back to prev square

    for (let robot of listRobots(state)) {
        if (isTile(getMapTile(state.map, robot.position), [CONVEYOR, FAST_CONVEYOR])) {
            actions = actions.concat(calculateConveyorMove(state, robot))
        }
    }

    for (let robot of listRobots(state)) {
        actions = actions.concat(calculateGearRotation(state, robot))
        actions = actions.concat(calculateFlagActivation(state, robot))
        actions = actions.concat(calculateGrillCheckpoint(state, robot))
    }

    return actions
}


function enactCleanup(state) {
    let actions = []

    for (let robot of listRobots(state)) {
        actions = actions.concat(calculateGrillHealing(state, robot))
    }

    return actions
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

    // const robots = Object.entries(ctx.playOrder).map(([index, player]) =>
    //   [index, createNewRobot(player, { x: 0 + Number(index), y: 0 }, NORTH, ROBOT_COLOURS[Number(index)])]
    // )

    const players = Object.values(ctx.playOrder)
    const state = initialiseState(map, robots, players)

    return state
  },

  playerView: PlayerView.STRIP_SECRETS,

  phases: {
    play: {
      onBegin: (G, ctx) => {
		// Cards in registers need to be locked if damage
		// is high enough
		
        for (const player of ctx.playOrder) {
          G.players[player].registers = {
			  "0": undefined, 
			  "1": undefined, 
			  "2": undefined, 
			  "3": undefined, 
			  "4": undefined
		  }
        }

        drawAllCards(G, ctx)

        log.info({ handSizes: getPlayerCardCounts(G) }, 'Dealt out cards to players.')

        const activePlayers = arrayToObject(
          Object.keys(ctx.playOrder)
            .filter(playerId => G.robots[playerId].lives)
            .map(key => ([key, Stage.NULL]))
        )

        ctx.events.setActivePlayers({
          value: activePlayers
        })

        log.info('Set all players to be active, allowing them to play.')
      },
      moves: {
        submitOrders: (G, ctx, selected, player) => {
		  log.info({ player, selected }, `${player} made a turn, playing ${selected.length} cards.`)
		  for (let card of selected) {
		  	G.players[player].registers[card.index] = card
		  }
          ctx.events.endStage()

          if (Object.keys(ctx.activePlayers).length === 1) {
            log.info(`${player} was the last person to play, the phase is being ended.`)
            ctx.events.endPhase()
          }
        }
      },
      onEnd: (G, ctx) => {
        let moves = []

        for (let i = 0; i < 5; i++) {
          const register = []

          for (const [playerId, player] of Object.entries(G.players)) {
            if (player.registers && player.registers[i]) {
              register.push({
                player: playerId,
                move: { type: player.registers[i].type, priority: player.registers[i].priority }
              })
            }
          }

          register.sort((a, b) => b.move.priority - a.move.priority)

          const moveRegister = register.map(move => createMove(move.move.type, move.player, move.priority))

          log.debug({ moveRegister }, `Simulating register ${i}.`)
          moves = moves.concat(enactMoves(G, moveRegister))

          log.debug(`Enacting environmental map changes.`)
          moves = moves.concat(enactEnvironment(G, i))

          // Respawn robots
          for (let robot of listRobots(G, true)) {
            if (robot.damage === MAX_DAMAGE) {
              const event = createRobotDeath(robot)
              moves = moves.concat(event)
              enactRobotDeathEvent(G, event)
            }
          }

          log.debug(`End of phase.`)
        }

        log.debug(`Enacting cleanup stage.`)
        moves = moves.concat(enactCleanup(G))

        G.robotMoves = moves
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
        // winner by flags?
        for (const robot of Object.values(G.robots)) {
            if (robot.flags.length === G.meta.flagCount) {
                return {
                    winner: robot
                }
            }
        }

        // winer by death?
        const alivePlayers = Object.values(G.robots).filter(robot => robot.lives)
        if (alivePlayers.length === 0) {
          return {
            draw: true
          }
        }

        if (alivePlayers.length === 1) {
          return {
            winner: alivePlayers[0]
          }
        }

        return undefined
    }
}
