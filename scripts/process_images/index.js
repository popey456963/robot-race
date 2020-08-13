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

async function main() {
    const tileTypes = jetpack.list('./input')

    for (let type of tileTypes) {
        const tiles = jetpack.list(path.join('input', type, 'size3blocky'))

        for (let tile of tiles) {
            if (/_(NE|NW|SE|SW)\.png/.test(tile)) {
                const location = path.join('input', type, 'size3blocky', tile)
                const outPath = path.join('../', '../', 'public', 'tiles', type, tile.replace('_Size3', ''))
                jetpack.dir(path.join('output', type))

                const png = await getPicture(location)

                let left = 0
                let right = png.width

                column: for (let x = 0; x < png.width; x++) {
                    for (let y = 0; y < png.height; y++) {
                        const idx = (png.width * y + x) << 2

                        const a = png.data[idx + 3]

                        if (a === 255) {
                            continue column
                        }
                    }

                    if (left === x) {
                        left = x + 1
                    }
                    else if (right === png.width) {
                        right = x
                    }
                    console.log('delete column', x)
                }

                cropPicture(location, outPath, { left, right })
                console.log("crops", left, right)
            }
        }

    }
}

main()