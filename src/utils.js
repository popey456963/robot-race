export function convertTouchIfMobile(e) {
  e.preventDefault()
  e.stopPropagation()
  if (e.touches && e.touches[0]) {
    e = e.touches[0]
  }
  return e
}

export function arrayToObject(arr) {
  return arr.reduce((acc, cur) => ({ ...acc, [cur[0]]: cur[1] }), {})
}