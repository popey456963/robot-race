export function findRobots(pos, robots) {
  for (const [key, robot] of Object.entries(robots)) {
    if (robot.position.x === pos.x && robot.position.y === pos.y) {
      robot.user = key
      return robot
    }
  }

  return undefined
}

export function convertTouchIfMobile(e) {
  e.preventDefault()
  e.stopPropagation()
  if (e.touches && e.touches[0]) {
    e = e.touches[0]
  }
  return e
}

export function rotateTileAngleAmount(dir) {
  return ['SE', 'SW', 'NW', 'NE'].indexOf(dir)
}

export function angleRotationAmount(dir) {
  return ['NORTH', 'EAST', 'SOUTH', 'WEST'].indexOf(dir)
}

export function rotateTileAngle(dir, amount) {
  for (let i = 0; i < amount; i++) {
    if (dir === 'SE') dir = 'SW'
    else if (dir === 'SW') dir = 'NW'
    else if (dir === 'NW') dir = 'NE'
    else if (dir === 'NE') dir = 'SE'
  }

  return dir
}

export function rotateCoordinates90(coords, mapSize) {
  let rx = mapSize.y - coords.y - 1
  let ry = coords.x
  return { x: rx, y: ry }
}

export function translateCoords(coords, dir, mapSize) {
  const amount = rotateTileAngleAmount(dir)

  for (let i = 0; i < amount; i++) {
    coords = rotateCoordinates90(coords, mapSize)
    mapSize = { x: mapSize.y, y: mapSize.x }
  }

  return coords
}

export function arrayToObject(arr) {
  return arr.reduce((acc, cur) => ({ ...acc, [cur[0]]: cur[1] }), {})
}