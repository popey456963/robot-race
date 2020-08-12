export function findRobots (pos, robots) {
  for (const [key, robot] of Object.entries(robots)) {
    if (robot.position.x === pos.x && robot.position.y === pos.y) {
      robot.user = key
      return robot
    }
  }

  return undefined
}

export function convertTouchIfMobile (e) {
  e.preventDefault()
  e.stopPropagation()
  if (e.touches && e.touches[0]) {
    e = e.touches[0]
  }
  return e
}
