const jetpack = require('fs-jetpack')
const path = require('path')
const fs = require('fs').promises
const nfs = require('fs')
const PNG = require('pngjs').PNG
const PNGCrop = require('png-crop')

async function getPicture(path) {
    const bytes = await fs.readFile(path, { encoding: null })
    return PNG.sync.read(bytes)
}

async function cropPicture(path, outPath, { left, right }) {
    const bytes = await fs.readFile(path, { encoding: null })
    return new Promise((resolve, reject) => {
        PNGCrop.cropToStream(bytes, { left, width: right - left, height: 9999999999, top: 0 }, (err, stream) => {
            if (err) reject(err)
            stream.pipe(nfs.createWriteStream(outPath))
            stream.on('finish', () => resolve())
        })
    })
}

function isColumnEmpty(column, data, width, height) {
    for (let y = 0; y < height; y++) {
        const idx = (width * y + column) << 2
        const a = data[idx + 3]

        if (a === 255) {
            return false
        }
    }
    return true
}

async function main() {
    const tileTypes = jetpack.list('./input')

    for (let type of tileTypes) {
        const tiles = jetpack.list(path.join('input', type, 'size3blocky'))

        console.log(type)

        for (let tile of tiles) {
            if (/_(NE|NW|SE|SW)\.png/.test(tile)) {
                const location = path.join('input', type, 'size3blocky', tile)
                const outPath = path.join('../', '../', 'public', 'tiles', type, tile.replace('_Size3', ''))
                jetpack.dir(path.join('../', '../', 'public', 'tiles', type))

                const png = await getPicture(location)

                let left = 0
                let right = png.width

                // column: for (let x = 0; x < png.width / 2; x++) {

                //     if (isColumnEmpty(x, png.data, png.width, png.height) && left === x) {
                //         left = x + 1
                //     }
                //     //console.log('delete column', x)
                //     if (isColumnEmpty(png.width - x - 1, png.data, png.width, png.height) && right === png.width - x) {
                //         right = png.width - x - 1
                //     }
                // }
                // cropPicture(location, outPath, { left, right })
                // console.log("crops1", left, right, tile)

                if (/_SW\.png/.test(tile)) {
                    left = 9
                    right = 599
                }
                else if (/_SE\.png/.test(tile)) {
                    left = 3
                    right = 593
                }
                else if (/_NW\.png/.test(tile)) {
                    left = 15
                    right = 605
                }
                else if (/_NE\.png/.test(tile)) {
                    left = 9
                    right = 599
                }

                cropPicture(location, outPath, { left, right })
                console.log("crops2", left, right, tile)
            }
        }
    }
}

main()