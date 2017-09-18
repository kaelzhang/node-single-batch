export default function wrap (single, batch, context) {
  single = method(single, context)
  batch = method(batch, context)

  return _wrap(single, batch, context)
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


const _wrap = (single, batch, context = null) => {
  if (!single && !batch) {
    return null
  }

  return {
    single (...args) {
      return single
        ? Promise.resolve(single.call(context, ...args))
        : Promise.resolve(batch.call(context, args)).then(([value]) => value)
    },

    batch (...args) {
      const ret = args.length
        ? args.length === 1
          ? single
            ? [single.call(context, ...args[0])]
            : batch.call(context, ...args)
          : batch
            ? batch.call(context, ...args)
            : args.map(arg => single.call(context, ...arg))
        : []

      return Promise.resolve(ret)
    }
  }
}
