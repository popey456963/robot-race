import { PlayerView, TurnOrder, Stage } from 'boardgame.io/core'
import {
  NORTH, EAST, SOUTH, WEST,
  MOVE_ONE, MOVE_TWO, MOVE_THREE,
  BACK_UP, ROTATE_RIGHT, ROTATE_LEFT, U_TURN,
  PLAIN, FLAG, HOLE, FAST_CONVEYOR, CONVEYOR, GRILL, GEAR,
  CLOCKWISE, ANTICLOCKWISE
} from './Constants'

import Deck from './Deck'
import { findRobots, arrayToObject } from './utils'

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
    log.info('Not moving robot because they ran into a wall.')
    return false
  }

  const old_position = { x: robot.position.x, y: robot.position.y }
  const new_position = calculateMoveDest(robot.position, direction)
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

function rotate_90_clockwise(cur_direction, times) {
  for (let i = 0; i < times; i++) {
    switch (cur_direction) {
      case NORTH: cur_direction = EAST; break
      case EAST: cur_direction = SOUTH; break
      case SOUTH: cur_direction = WEST; break
      case WEST: cur_direction = NORTH; break
      default: throw new Error('unexpected direction')
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
      moveRobot(G, r, oppositeDirection(r.direction))
      break
    case ROTATE_RIGHT:
      oldDirection = r.direction
      newDirection = rotate_90_clockwise(r.direction, 1)
      log.info({ oldDirection, newDirection }, `Rotating player ${move.player} to the RIGHT from ${oldDirection} to ${newDirection}`)
      r.direction = newDirection
      break
    case ROTATE_LEFT:
      oldDirection = r.direction
      newDirection = rotate_90_clockwise(r.direction, 3)
      log.info({ oldDirection, newDirection }, `Rotating player ${move.player} to the LEFT from ${oldDirection} to ${newDirection}`)
      r.direction = newDirection
      break
    case U_TURN:
      oldDirection = r.direction
      newDirection = rotate_90_clockwise(r.direction, 2)
      log.info({ oldDirection, newDirection }, `Rotating player ${move.player} to the BACK from ${oldDirection} to ${newDirection}`)
      r.direction = newDirection
      break
    default: throw new Error('unexpected card')
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

function oppositeDirection(dir) {
  if (dir === NORTH) return SOUTH
  if (dir === EAST) return WEST
  if (dir === SOUTH) return NORTH
  if (dir === WEST) return EAST
}

function atRightAngles(dir, out) {
  if (dir === NORTH && (out === WEST || out === EAST)) return true
  if (dir === SOUTH && (out === WEST || out === EAST)) return true
  if (dir === WEST && (out === NORTH || out === SOUTH)) return true
  if (dir === EAST && (out === NORTH || out === SOUTH)) return true

  return false
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
    const inDirection = oppositeDirection(conveyor.meta.exitDirection)
    log.debug({ inDirection }, `The new tile is also a conveyor belt.`)
    if (newTile.meta.inputDirections[inDirection]) {
      log.debug(`We've also entered the new conveyor belt from a correct direction.`)
      // we're entered a correct way...
      if (atRightAngles(inDirection, newTile.meta.exitDirection)) {
        const rotations = shouldTurnClockwise(inDirection, newTile.meat.exitDirection) ? 1 : 3

        log.debug({ rotations }, `Since the conveyor is curved, we're rotating the player`)
        robot.direction = rotate_90_clockwise(robot.direction, rotations)
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
      robot.direction = rotate_90_clockwise(robot.direction, rotationAmount)
    }
  }

  const flags = findInMap(state.map, FLAG)

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

function countTiles(map) {
  let counts = {}
  for (let row of map) {
    for (let item of row) {
      counts[item.type] = (counts[item.type] || 0) + 1
    }
  }

  return counts
}

function getPlayerCardCounts(G) {
  return arrayToObject(Object.entries(G.players)
    .map(([id, player]) => [id, player.hand.length]))
}

export const RobotFight = {
  name: 'robot-fight',

  setup: (ctx, setupData) => {
    log.info({ users: ctx.playOrder }, 'Setting up a new robot fight.')
    const NO_DIRECTIONS = {
      // [NORTH]: false,
      // [EAST]: false,
      // [SOUTH]: false,
      // [WEST]: false
    }

    const NORTH_DIRECTION = {
      [NORTH]: true
    }

    const EAST_DIRECTION = {
      [EAST]: true
    }

    const SOUTH_DIRECTION = {
      [SOUTH]: true
    }

    const WEST_DIRECTION = {
      [WEST]: true
    }

    const state = {
      players: {},
      map: new Array(12).fill(null).map(
        () => new Array(12).fill(null).map(() => ({ type: PLAIN, walls: NO_DIRECTIONS }))
      ),
      robots: {}
    }

    state.map[5][3] = { type: FLAG, walls: NO_DIRECTIONS, meta: { flagNumber: 1 } }
    state.map[6][3] = { type: FLAG, walls: NO_DIRECTIONS, meta: { flagNumber: 2 } }
    state.map[7][3] = { type: FLAG, walls: NO_DIRECTIONS, meta: { flagNumber: 3 } }
    state.map[8][3] = { type: FLAG, walls: NO_DIRECTIONS, meta: { flagNumber: 4 } }
    state.map[9][3] = { type: FLAG, walls: NO_DIRECTIONS, meta: { flagNumber: 5 } }
    state.map[10][3] = { type: FLAG, walls: NO_DIRECTIONS, meta: { flagNumber: 6 } }

    state.map[6][4] = { type: GRILL, walls: NO_DIRECTIONS, meta: { level: 1 } }
    state.map[7][4] = { type: GRILL, walls: NO_DIRECTIONS, meta: { level: 2 } }
    state.map[8][4] = { type: HOLE, walls: NO_DIRECTIONS }
    state.map[9][4] = { type: GEAR, walls: NO_DIRECTIONS, meta: { rotationDirection: CLOCKWISE } }
    state.map[10][4] = { type: GEAR, walls: NO_DIRECTIONS, meta: { rotationDirection: ANTICLOCKWISE } }

    state.map[1][3] = { type: CONVEYOR, walls: NO_DIRECTIONS, meta: { exitDirection: NORTH, inputDirections: SOUTH_DIRECTION } }
    state.map[2][3] = { type: CONVEYOR, walls: NO_DIRECTIONS, meta: { exitDirection: EAST, inputDirections: WEST_DIRECTION } }
    state.map[3][3] = { type: CONVEYOR, walls: NO_DIRECTIONS, meta: { exitDirection: SOUTH, inputDirections: NORTH_DIRECTION } }
    state.map[4][3] = { type: CONVEYOR, walls: NO_DIRECTIONS, meta: { exitDirection: WEST, inputDirections: EAST_DIRECTION } }

    state.map[1][4] = { type: CONVEYOR, walls: NO_DIRECTIONS, meta: { exitDirection: NORTH, inputDirections: EAST_DIRECTION } }
    state.map[2][4] = { type: CONVEYOR, walls: NO_DIRECTIONS, meta: { exitDirection: EAST, inputDirections: SOUTH_DIRECTION } }
    state.map[3][4] = { type: CONVEYOR, walls: NO_DIRECTIONS, meta: { exitDirection: SOUTH, inputDirections: WEST_DIRECTION } }
    state.map[4][4] = { type: CONVEYOR, walls: NO_DIRECTIONS, meta: { exitDirection: WEST, inputDirections: NORTH_DIRECTION } }

    state.map[1][5] = { type: CONVEYOR, walls: NO_DIRECTIONS, meta: { exitDirection: NORTH, inputDirections: WEST_DIRECTION } }
    state.map[2][5] = { type: CONVEYOR, walls: NO_DIRECTIONS, meta: { exitDirection: EAST, inputDirections: NORTH_DIRECTION } }
    state.map[3][5] = { type: CONVEYOR, walls: NO_DIRECTIONS, meta: { exitDirection: SOUTH, inputDirections: EAST_DIRECTION } }
    state.map[4][5] = { type: CONVEYOR, walls: NO_DIRECTIONS, meta: { exitDirection: WEST, inputDirections: SOUTH_DIRECTION } }

    state.map[1][6] = { type: FAST_CONVEYOR, walls: NO_DIRECTIONS, meta: { exitDirection: NORTH, inputDirections: SOUTH_DIRECTION } }
    state.map[2][6] = { type: FAST_CONVEYOR, walls: NO_DIRECTIONS, meta: { exitDirection: EAST, inputDirections: WEST_DIRECTION } }
    state.map[3][6] = { type: FAST_CONVEYOR, walls: NO_DIRECTIONS, meta: { exitDirection: SOUTH, inputDirections: NORTH_DIRECTION } }
    state.map[4][6] = { type: FAST_CONVEYOR, walls: NO_DIRECTIONS, meta: { exitDirection: WEST, inputDirections: EAST_DIRECTION } }

    state.map[1][7] = { type: FAST_CONVEYOR, walls: NO_DIRECTIONS, meta: { exitDirection: NORTH, inputDirections: EAST_DIRECTION } }
    state.map[2][7] = { type: FAST_CONVEYOR, walls: NO_DIRECTIONS, meta: { exitDirection: EAST, inputDirections: SOUTH_DIRECTION } }
    state.map[3][7] = { type: FAST_CONVEYOR, walls: NO_DIRECTIONS, meta: { exitDirection: SOUTH, inputDirections: WEST_DIRECTION } }
    state.map[4][7] = { type: FAST_CONVEYOR, walls: NO_DIRECTIONS, meta: { exitDirection: WEST, inputDirections: NORTH_DIRECTION } }

    state.map[1][8] = { type: FAST_CONVEYOR, walls: NO_DIRECTIONS, meta: { exitDirection: NORTH, inputDirections: WEST_DIRECTION } }
    state.map[2][8] = { type: FAST_CONVEYOR, walls: NO_DIRECTIONS, meta: { exitDirection: EAST, inputDirections: NORTH_DIRECTION } }
    state.map[3][8] = { type: FAST_CONVEYOR, walls: NO_DIRECTIONS, meta: { exitDirection: SOUTH, inputDirections: EAST_DIRECTION } }
    state.map[4][8] = { type: FAST_CONVEYOR, walls: NO_DIRECTIONS, meta: { exitDirection: WEST, inputDirections: SOUTH_DIRECTION } }

    const direcs = [NORTH, EAST, SOUTH, WEST]
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        state.map[5 + i][5 + j] = {
          type: (i % 2 === 0 ? CONVEYOR : FAST_CONVEYOR), walls: NO_DIRECTIONS, meta: {
            exitDirection: direcs[i],
            inputDirections: {
              [direcs[((i + 1) % 4)]]: j !== 0,
              [direcs[((i + 2) % 4)]]: j !== 1,
              [direcs[((i + 3) % 4)]]: j !== 2
            }
          }
        }
      }
    }

    state.meta = {
      flagCount: 6
    }

    const tileCount = countTiles(state.map)
    log.info({ tileCount }, `Created a ${state.map.length} x ${state.map[0].length} map with ${state.meta.flagCount} flags.`)

    let i = 0
    let robotLocations = []
    for (const player of ctx.playOrder) {
      i += 1

      state.players[player] = {
        hand: []
      }

      state.robots[player] = {
        position: { x: 2, y: i + 8 },
        direction: EAST,
        poweredDown: false,
        damage: 0,
        upgrades: [],
        flags: [],
        checkpoint: { x: 0, y: i },
        lives: 3,
        user: player
      }

      robotLocations.push([player, state.robots[player].position])
    }

    robotLocations = arrayToObject(robotLocations)
    log.info({ robotLocations }, `Spawning ${ctx.playOrder.length} robots.`)

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
