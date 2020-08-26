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

export function rotateMatrix(a) {
  a = Object.keys(a[0]).map(c => a.map(r => r[c]))
  for (let i in a) a[i] = a[i].reverse()
  return a
}