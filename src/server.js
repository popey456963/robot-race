const { Server } = require('boardgame.io/server')
const { RobotFight } = require('./Game')

const server = Server({
    games: [RobotFight]
})

server.run(8000)
