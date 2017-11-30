[![Build Status](https://travis-ci.org/kaelzhang/node-single-batch.svg?branch=master)](https://travis-ci.org/kaelzhang/node-single-batch)
[![Coverage](https://codecov.io/gh/kaelzhang/node-single-batch/branch/master/graph/badge.svg)](https://codecov.io/gh/kaelzhang/node-single-batch)
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kaelzhang/node-single-batch?branch=master&svg=true)](https://ci.appveyor.com/project/kaelzhang/node-single-batch)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/single-batch.svg)](http://badge.fury.io/js/single-batch)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/single-batch.svg)](https://www.npmjs.org/package/single-batch)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/node-single-batch.svg)](https://david-dm.org/kaelzhang/node-single-batch)
-->

# single-batch

Low level utility to handle single or batch methods.

## Install

```sh
$ npm install single-batch
```

## Usage

```js
import wrap from 'single-batch'

const obj = {
  add: (a, b) => Promise.resolve(a + b)
}

const wrapped = wrap('add', null, obj)

wrapped.single(1, 2).then(console.log)            // 3
wrapped.batch([1, 2], [2, 3]).then(console.log)   // [3, 4]
```

## wrap(single, batch, context, singleArg)

- **single** `function()`
- **batch** `function()`
- **context** `Object=`
- **singleArg** `Boolean=false`

Returns

- `null` if single and batch methods are both unavailable
- `{single: function, batch: function}`

### singleArg

If true, then `wrapped.single` only accept one argument, and each argument of `wrapped.batch` corresponds to the argument of `wrapped.single`

```js
// singleArg: true
wrapped.single(1)
wrapped.batch(1, 2, 3)

wrapped.single([1, 2])
wrapped.batch([1, 2], [2, 3])
```

If false, `wrapped.single` accept multiple arguments, and each argument of `wrapped.batch` must be an array which represents the arguments of `wrapped.single`

```js
wrapped.single(1, 2)
wrapped.batch([1, 2], [2, 3])

wrapped.single([1, 2])
wrapped.batch([[1, 2]], [[2, 3]])
```

## License

MIT
