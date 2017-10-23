const tap = require('tap')
const phpFpm = require('..')

const php = phpFpm()

tap.test('ok', async function (tap) {
  try {
    const output = await php.request('ok.php')
    tap.equal(output, 'ok')
  } catch (e) {
    throw String('connection problem')
  }
  tap.end()
})
