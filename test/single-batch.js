import test from 'ava'
import wrap from '../src'
import delay from 'delay'

test('if only single data, batch should fall back to single', async t => {
  let got = false
  let mgot = false

  const s = {
    get (n) {
      got = true
      return n + 1
    },

    mget (array) {
      mgot = true
      return array.map(([n]) => n + 1)
    }
  }

  const wrapped = wrap('get', 'mget', s)

  t.deepEqual(await wrapped.batch([1]), [2])
  t.is(got, true)
  t.is(mgot, false)
})

test('all none', async t => {
  t.is(wrap(), null)

  const s = {}
  t.is(wrap('get', 'mget', s), null)

  const s2 = {
    get: 1
  }
  t.is(wrap('get', 'mget', s), null)
})


test('all none, no context', async t => {
  t.is(wrap('a', 'b'), null)
})


test('no single', async t => {
  const s = {
    mget: (...array) => array.map(([n]) => n + 1)
  }

  const wrapped = wrap(null, 'mget', s)

  t.is(await wrapped.single(1), 2)
  t.deepEqual(await wrapped.batch([1], [2]), [2, 3])
})

test('no batch', async t => {
  const s = {
    get: n => n + 1
  }

  const wrapped = wrap('get', 'mget', s)
  t.is(await wrapped.single(1), 2)
  t.deepEqual(await wrapped.batch([1], [2]), [2, 3])
})

test('function', async t => {
  const s = {
    a: 1
  }

  function get (n) {
    return n + this.a
  }

  const wrapped = wrap(get, null, s)
  t.is(await wrapped.single(1), 2)
  t.deepEqual(await wrapped.batch([1], [2]), [2, 3])
})


test('single, multiple arguments', async t => {
  const add = (a, b) => delay(10).then(() => a + b)

  const wrapped = wrap(add)
  t.is(await wrapped.single(1, 2), 3)
  t.deepEqual(await wrapped.batch([1, 2], [3, 4]), [3, 7])
  t.deepEqual(await wrapped.batch(), [])
})


test('batch, multiple arguments', async t => {
  const add = (...args) => delay(10).then(() => args.map(([a, b]) => a + b))

  const wrapped = wrap(null, add)
  t.is(await wrapped.single(1, 2), 3)
  t.deepEqual(await wrapped.batch([1, 2]), [3])
  t.deepEqual(await wrapped.batch([1, 2], [3, 4]), [3, 7])
  t.deepEqual(await wrapped.batch(), [])
})

test('single arg: single', async t => {
  const add = n => n + 1
  const wrapped = wrap(add, null, null, true)
  t.is(await wrapped.single(1), 2)
  t.deepEqual(await wrapped.batch(1, 2), [2, 3])
  t.deepEqual(await wrapped.batch(1), [2])
  t.deepEqual(await wrapped.batch(), [])
})

test('single arg: batch', async t => {
  const add = (...args) => args.map(n => n + 1)
  const wrapped = wrap(null, add, null, true)
  t.is(await wrapped.single(1), 2)
  t.deepEqual(await wrapped.batch(1, 2), [2, 3])
  t.deepEqual(await wrapped.batch(1), [2])
  t.deepEqual(await wrapped.batch(), [])
})

test('should not returns [] if no args', async t => {
  const add = (...args) => args.length
    ? args.map(n => n + 1)
    : 'empty'

  const wrapped = wrap(null, add, null)
  t.is(await wrapped.batch(), 'empty')
})
