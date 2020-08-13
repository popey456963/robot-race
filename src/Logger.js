import * as bunyan from 'bunyan';

const log = bunyan.createLogger({
    name: 'robot-logger',
    level: 'trace'
})

export default log