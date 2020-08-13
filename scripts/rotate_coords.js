function rotateCoordinates90(coords, mapSize) {
    let cx = coords.x
    let cy = coords.y

    console.log("map/2: ", (mapSize.x - 1) / 2, " ", (mapSize.y - 1) / 2)
    cx -= (mapSize.x - 1) / 2
    cy -= (mapSize.y - 1) / 2

    let rx = -cy
    let ry = cx

    rx += (mapSize.y - 1) / 2
    ry += (mapSize.x - 1) / 2

    return { x: rx, y: ry }
}

const mapSize = { x: 10, y: 7 }

console.log(rotateCoordinates90({ x: 0, y: 0 }, mapSize), 'should be', { x: 0, y: 9 })
console.log(rotateCoordinates90({ x: 0, y: 9 }, mapSize), 'should be', { x: 9, y: 6 })
console.log(rotateCoordinates90({ x: 9, y: 6 }, mapSize), 'should be', { x: 6, y: 0 })
console.log(rotateCoordinates90({ x: 6, y: 0 }, mapSize), 'should be', { x: 0, y: 0 })