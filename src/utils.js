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
  if (dir === 'SW') return 1
  if (dir === 'NW') return 2
  if (dir === 'NE') return 3
}

export function rotateTileAngle(dir, amount) {
  for (let i = 0; i < amount; i++) {
    if (dir === 'SE') dir = 'SW'
    if (dir === 'SW') dir = 'NW'
    if (dir === 'NW') dir = 'NE'
    if (dir === 'NE') dir = 'SE'
  }

  return dir
}