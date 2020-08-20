import { PlayerView, TurnOrder, Stage } from 'boardgame.io/core'
import {
  NORTH, EAST, SOUTH, WEST, DIRECTIONS,
  MOVE_ONE, MOVE_TWO, MOVE_THREE,
  BACK_UP, ROTATE_RIGHT, ROTATE_LEFT, U_TURN,
  FLAG, HOLE, FAST_CONVEYOR, CONVEYOR, GRILL, GEAR,
  CLOCKWISE, ANTICLOCKWISE,
  MAX_DAMAGE, OUT_OF_BOUNDS
} from './Constants'

import Deck from './Deck'
import { findRobots, arrayToObject } from './utils'

import {
  createMap, setMapTile, countAllMapTiles, getMapTilesByType,
  getMapTile
} from './Map'
import {
  initialiseState, getPlayerRobot, damageRobot, calculateRobotMove, calculateRobotRotate
} from './State'
import {
  calculateMoveDestination, rotateDirectionClockwise, isRightAngle
} from './Position'
import {
  createFlagTile, createGrillTile, createHoleTile, createGearTile,
  createDirectionObject, createConveyorTile, createFastConveyorTile,
  isTile
} from './Tiles'
import {
  createNewRobot
} from './Robot'


import log from './Logger'

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

function moveRobot(G, robot, direction) {
  if (G.map[robot.position.y][robot.position.x].walls[direction]) {
    log.info('Not moving robot because they ran into a wall.')
    return false
  }

  const old_position = { x: robot.position.x, y: robot.position.y }
  const new_position = calculateMoveDestination(robot.position, direction)
  const other_robot = findRobots(new_position, G.robots)
  if ((other_robot !== undefined && moveRobot(G, other_robot, direction)) ||
    other_robot === undefined) {
    log.info(`We didn't bump into anything, so moving us along!`)
    robot.position = new_position
  }

  log.info({ old_position, new_position, player: robot.user }, `Moved robot.`)
  checkCurrentSquare(G, robot.position, robot.user)

  return true
}

function checkCurrentSquare(state, position, player) {
  const tile = getMapTile(state.map, position)
  if (isTile(tile, [HOLE, OUT_OF_BOUNDS])) {
    damageRobot(state, getPlayerRobot(state, player), 10)
    log.info({ player, position }, `${player} fell into a hole and died!`)
  }
}

function enactMove(move, G) {
  const r = G.robots[move.player]
  let oldDirection, newDirection

  switch (move.move.type) {
    case MOVE_THREE:
      moveRobot(G, r, r.direction)
    // falls through
    case MOVE_TWO:
      moveRobot(G, r, r.direction)
    // falls through
    case MOVE_ONE:
      moveRobot(G, r, r.direction)
      break
    case BACK_UP:
      moveRobot(G, r, rotateDirectionClockwise(r.direction, 2))
      break
    case ROTATE_RIGHT:
      oldDirection = r.direction
      newDirection = rotateDirectionClockwise(r.direction, 1)
      log.info({ oldDirection, newDirection }, `Rotating player ${move.player} to the RIGHT from ${oldDirection} to ${newDirection}`)
      r.direction = newDirection
      break
    case ROTATE_LEFT:
      oldDirection = r.direction
      newDirection = rotateDirectionClockwise(r.direction, 3)
      log.info({ oldDirection, newDirection }, `Rotating player ${move.player} to the LEFT from ${oldDirection} to ${newDirection}`)
      r.direction = newDirection
      break
    case U_TURN:
      oldDirection = r.direction
      newDirection = rotateDirectionClockwise(r.direction, 2)
      log.info({ oldDirection, newDirection }, `Rotating player ${move.player} to the BACK from ${oldDirection} to ${newDirection}`)
      r.direction = newDirection
      break
    default: throw new Error('unexpected card')
  }
}

function shouldTurnClockwise(dir, out) {
  if ((dir === SOUTH && out === WEST) || (dir === WEST && out === NORTH) || (dir === NORTH && out === EAST) || (dir === EAST && out === SOUTH)) return false
  if ((dir === SOUTH && out === WEST) || (dir === WEST && out === NORTH) || (dir === NORTH && out === EAST) || (dir === EAST && out === SOUTH)) return true

  throw new Error('not right angle')
}

function moveByConveyor(state, robot) {
  log.info(`Player ${robot.user} is on a conveyor, so being moved.`)
  const conveyor = state.map[robot.position.y][robot.position.x]

  // we know robot is on a conveyor, so let's move it in destination direction:
  moveRobot(state, robot, conveyor.meta.exitDirection)

  // now we should determine if we rotate...
  const newTile = state.map[robot.position.y][robot.position.x]

  if (newTile.type === CONVEYOR || newTile.type === FAST_CONVEYOR) {
    const inDirection = rotateDirectionClockwise(conveyor.meta.exitDirection, 2)
    log.debug({ inDirection }, `The new tile is also a conveyor belt.`)
    if (newTile.meta.inputDirections[inDirection]) {
      log.debug(`We've also entered the new conveyor belt from a correct direction.`)
      // we're entered a correct way...
      if (isRightAngle(inDirection, newTile.meta.exitDirection)) {
        const rotations = shouldTurnClockwise(inDirection, newTile.meat.exitDirection) ? 1 : 3

        log.debug({ rotations }, `Since the conveyor is curved, we're rotating the player`)
        robot.direction = rotateDirectionClockwise(robot.direction, rotations)
      }
    }
  }
}

function enactEnvironment(state, register) {
  for (const robot of Object.values(state.robots)) {
    if (state.map[robot.position.y][robot.position.x].type === FAST_CONVEYOR) {
      // move them by conveyor
      moveByConveyor(state, robot)
    }
  }

  for (const robot of Object.values(state.robots)) {
    if ([FAST_CONVEYOR, CONVEYOR].includes(state.map[robot.position.y][robot.position.x].type)) {
      // move them by conveyor
      moveByConveyor(state, robot)
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
    const robot = findRobots(flag, state.robots)

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

    const map = createMap(12, 12)

    setMapTile(map, { y: 5, x: 3 }, createFlagTile({}, { flagNumber: 1 }))
    setMapTile(map, { y: 6, x: 3 }, createFlagTile({}, { flagNumber: 2 }))
    setMapTile(map, { y: 7, x: 3 }, createFlagTile({}, { flagNumber: 3 }))
    setMapTile(map, { y: 8, x: 3 }, createFlagTile({}, { flagNumber: 4 }))
    setMapTile(map, { y: 9, x: 3 }, createFlagTile({}, { flagNumber: 5 }))
    setMapTile(map, { y: 10, x: 3 }, createFlagTile({}, { flagNumber: 6 }))

    setMapTile(map, { y: 6, x: 4 }, createGrillTile({}, { level: 1 }))
    setMapTile(map, { y: 7, x: 4 }, createGrillTile({}, { level: 2 }))
    setMapTile(map, { y: 8, x: 4 }, createHoleTile())
    setMapTile(map, { y: 9, x: 4 }, createGearTile({}, { rotationDirection: CLOCKWISE }))
    setMapTile(map, { y: 10, x: 4 }, createGearTile({}, { rotationDirection: ANTICLOCKWISE }))

    setMapTile(map, { y: 1, x: 3 }, createConveyorTile({}, { exitDirection: NORTH, inputDirections: createDirectionObject([SOUTH]) }))
    setMapTile(map, { y: 2, x: 3 }, createConveyorTile({}, { exitDirection: EAST, inputDirections: createDirectionObject([WEST]) }))
    setMapTile(map, { y: 3, x: 3 }, createConveyorTile({}, { exitDirection: SOUTH, inputDirections: createDirectionObject([NORTH]) }))
    setMapTile(map, { y: 4, x: 3 }, createConveyorTile({}, { exitDirection: WEST, inputDirections: createDirectionObject([EAST]) }))

    setMapTile(map, { y: 1, x: 4 }, createConveyorTile({}, { exitDirection: NORTH, inputDirections: createDirectionObject([EAST]) }))
    setMapTile(map, { y: 2, x: 4 }, createConveyorTile({}, { exitDirection: EAST, inputDirections: createDirectionObject([SOUTH]) }))
    setMapTile(map, { y: 3, x: 4 }, createConveyorTile({}, { exitDirection: SOUTH, inputDirections: createDirectionObject([WEST]) }))
    setMapTile(map, { y: 4, x: 4 }, createConveyorTile({}, { exitDirection: WEST, inputDirections: createDirectionObject([NORTH]) }))

    setMapTile(map, { y: 1, x: 5 }, createConveyorTile({}, { exitDirection: NORTH, inputDirections: createDirectionObject([WEST]) }))
    setMapTile(map, { y: 2, x: 5 }, createConveyorTile({}, { exitDirection: EAST, inputDirections: createDirectionObject([NORTH]) }))
    setMapTile(map, { y: 3, x: 5 }, createConveyorTile({}, { exitDirection: SOUTH, inputDirections: createDirectionObject([EAST]) }))
    setMapTile(map, { y: 4, x: 5 }, createConveyorTile({}, { exitDirection: WEST, inputDirections: createDirectionObject([SOUTH]) }))

    setMapTile(map, { y: 1, x: 6 }, createFastConveyorTile({}, { exitDirection: NORTH, inputDirections: createDirectionObject([SOUTH]) }))
    setMapTile(map, { y: 2, x: 6 }, createFastConveyorTile({}, { exitDirection: EAST, inputDirections: createDirectionObject([WEST]) }))
    setMapTile(map, { y: 3, x: 6 }, createFastConveyorTile({}, { exitDirection: SOUTH, inputDirections: createDirectionObject([NORTH]) }))
    setMapTile(map, { y: 4, x: 6 }, createFastConveyorTile({}, { exitDirection: WEST, inputDirections: createDirectionObject([EAST]) }))

    setMapTile(map, { y: 1, x: 7 }, createFastConveyorTile({}, { exitDirection: NORTH, inputDirections: createDirectionObject([EAST]) }))
    setMapTile(map, { y: 2, x: 7 }, createFastConveyorTile({}, { exitDirection: EAST, inputDirections: createDirectionObject([SOUTH]) }))
    setMapTile(map, { y: 3, x: 7 }, createFastConveyorTile({}, { exitDirection: SOUTH, inputDirections: createDirectionObject([WEST]) }))
    setMapTile(map, { y: 4, x: 7 }, createFastConveyorTile({}, { exitDirection: WEST, inputDirections: createDirectionObject([NORTH]) }))

    setMapTile(map, { y: 1, x: 8 }, createFastConveyorTile({}, { exitDirection: NORTH, inputDirections: createDirectionObject([WEST]) }))
    setMapTile(map, { y: 2, x: 8 }, createFastConveyorTile({}, { exitDirection: EAST, inputDirections: createDirectionObject([NORTH]) }))
    setMapTile(map, { y: 3, x: 8 }, createFastConveyorTile({}, { exitDirection: SOUTH, inputDirections: createDirectionObject([EAST]) }))
    setMapTile(map, { y: 4, x: 8 }, createFastConveyorTile({}, { exitDirection: WEST, inputDirections: createDirectionObject([SOUTH]) }))

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        const inputDirections = []
        if (j !== 0) inputDirections.push(DIRECTIONS[(i + 1) % 4])
        if (j !== 1) inputDirections.push(DIRECTIONS[(i + 2) % 4])
        if (j !== 2) inputDirections.push(DIRECTIONS[(i + 3) % 4])

        const conveyorType = i % 2 ? createFastConveyorTile : createConveyorTile
        const conveyorTile = conveyorType({}, {
          exitDirection: DIRECTIONS[i],
          inputDirections: createDirectionObject(inputDirections)
        })

        setMapTile(map, { y: 5 + i, x: 5 + j }, conveyorTile)
      }
    }

    const tileCount = countAllMapTiles(map)
    log.info({ tileCount }, `Created a ${map.length} x ${map[0].length} map.`)

    const robots = Object.entries(ctx.playOrder).map(([index, player]) =>
      [index, createNewRobot(player, { x: 2, y: Number(index) + 8 }, EAST)]
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

          log.debug({ register }, `Simulating register ${i}.`)

          for (const move of register) {
            log.debug({ move }, `Simulating move by ${move.player}.`)
            enactMove(move, G)
          }

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
