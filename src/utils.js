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
  if (dir === 'SE') return 0
  else if (dir === 'SW') return 1
  else if (dir === 'NW') return 2
  else if (dir === 'NE') return 3
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

  // console.log('Asked to rotate', coords, 'rotationg', amount, 'times')

  for (let i = 0; i < amount; i++) {
    coords = rotateCoordinates90(coords, mapSize)
    mapSize = { x: mapSize.y, y: mapSize.x }
  }

  return coords
}

export function arrayToObject(arr) {
  return arr.reduce((acc, cur) => ({ ...acc, [cur[0]]: cur[1] }), {})
}