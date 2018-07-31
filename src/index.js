module.exports = function wrap (single, batch, context = null, singleArg) {
  single = method(single, context)
  batch = method(batch, context)

  if (!single && !batch) {
    return null
  }

  return _wrap(single, batch, context, singleArg)
}

const method = (name, context) => {
  if (typeof name === 'function') {
    return name
  }

  if (typeof name !== 'string') {
    return
  }

  if (!context) {
    return
  }

  name = context[name]

  if (typeof name === 'function') {
    return name
  }
}

const _wrap = (single, batch, context, singleArg) => {
  return {
    single: singleArg
      ? arg => {
        return single
          ? Promise.resolve(single.call(context, arg))
          : Promise.resolve(batch.call(context, arg)).then(([value]) => value)
      }

      : (...args) => {
        return single
          ? Promise.resolve(single.call(context, ...args))
          : Promise.resolve(batch.call(context, args)).then(([value]) => value)
      },

    batch (...args) {
      return args.length === 1
        ? single
          ? Promise.all([
            singleArg
              ? single.call(context, args[0])
              : single.call(context, ...args[0])
          ])
          : Promise.resolve(batch.call(context, ...args))
        : batch
          ? Promise.resolve(batch.call(context, ...args))
          : Promise.all(
            args.map(arg => singleArg
              ? single.call(context, arg)
              : single.call(context, ...arg)
            )
          )
    }
  }
}
