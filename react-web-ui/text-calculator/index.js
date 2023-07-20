const calculator = (token, setting, library) => {
  const process = { token: token, setting: setting, step: 0, result: [], next: () => next() }

  const next = () => {

    const functions = [
      () => {
        process.result = new Array(3).fill().map(i => [])

        process.token.forEach(i => {
          i.forEach(i_ => {
            if (process.result[0].indexOf(i_) === -1) process.result[0].push(i_)
          })
        })

        process.result[1] = process.token.map(i => i.map(i => process.result[0].indexOf(i)))
        process.result[2] = [{}]

        process.step = process.step + 1
      },
      () => {
        process.index = 0
        process.step = process.step + 1
      },
      () => {
        var list = []

        process.result[1].forEach((i, index) => {
          i.forEach((i_, index_) => {
            const min = Math.max(index_, 0)
            const max = Math.min(index_ + process.setting.ngramWindows, i.length - 1)

            const pre = i.slice(min, max)
            const current = i.slice(max, max + 1)

            list.push({ pre, current })
          })
        })

        list.forEach((i) => {
          const { pre, current } = i

          if (pre.length === 0) return

          var currentPosition = process.result[2][0]

          pre.forEach(i => {
            if (currentPosition[i] === undefined) currentPosition[i] = {}
            currentPosition = currentPosition[i]
          })

          if (currentPosition[current[0]] === undefined) currentPosition[current[0]] = { w: 0 }
          if (currentPosition[current[0]] !== undefined) currentPosition[current[0]].w = currentPosition[current[0]].w + 1
        })

        process.step = process.step + 1
      },
      () => {
        const loop = (object) => {
          if (Object.keys(object).length > 1) delete (object.w)
          Object.keys(object).forEach(i => loop(object[i]))
        }

        loop(process.result[2][0])

        process.step = process.step + 1
      },
    ]

    if (functions[process.step] !== undefined) functions[process.step]()
    if (functions[process.step] === undefined) process.next = undefined

    return process

  }

  return process
}

module.exports.calculator = calculator