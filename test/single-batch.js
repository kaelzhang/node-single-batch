import test from 'ava'
import wrap from '../src'

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
