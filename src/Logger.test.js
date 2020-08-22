import log from './Logger'
import { TRACE, WARN } from 'bunyan'

test('log should not crash', () => {
    log.level(WARN)
    expect(() => log.info('hi')).not.toThrow()
    log.level(TRACE)
})