const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const calculator = (token, setting, library) => {
  const resultLibrary = library

  const process = { token: token, setting: setting, step: 0, index: 0, result: resultLibrary, next: () => next() }

  const next = () => {

    const functions = [
      () => {
        process.token.forEach(i => {
          i.forEach(i_ => {
            if (process.result[0].indexOf(i_) === -1) {
              process.result[0].push(i_)
              process.result[2].push(new Array(process.setting.dimensions).fill().map(() => Math.random()))
            }
          })
        })

        process.result[1] = process.token.map(i => i.map(i => process.result[0].indexOf(i)))

        process.index = 0

        process.step = process.step + 1
      },
      () => {
        var list = []

        process.result[1].forEach((i, index) => {
          i.forEach((i_, index_) => {
            const min = Math.max(index_ - process.setting.windows, 0)
            const max = Math.min(index_ + process.setting.windows, i.length - 1)

            const pre = i.slice(min, index_)
            const current = i.slice(index_, index_ + 1)
            const next = i.slice(index_ + 1, max + 1)

            list.push({ pre, current, next })
          })
        })

        list = shuffleArray(list)

        list.forEach((i) => {
          const { pre, current, next } = i

          const all = [...pre, ...next].map(i => process.result[2][i])

          var result = new Array(process.setting.dimensions).fill(0)

          all.forEach(i => i.forEach((i, index) => result[index] = result[index] + i))

          result = result.map((i) => i / (process.setting.windows * 2))

          process.result[2][current[0]] = process.result[2][current[0]].map((i, index) => i + result[index] * process.setting.rate)
        })

        process.index = process.index + 1

        if (process.index === process.setting.iterations) process.step = process.step + 1
      },
      () => {
        var max = 0

        process.result[2].forEach((i) => i.forEach((i_) => max = Math.max(max, i_)))

        process.result[2].forEach((i, index) => i.forEach((i_, index_) => process.result[2][index][index_] = process.result[2][index][index_] / max))

        process.step = process.step + 1
      },
      () => {
        process.result[2].forEach((i, index) => i.forEach((i_, index_) => process.result[2][index][index_] = Number(process.result[2][index][index_].toFixed(12))))

        process.step = process.step + 1
      }
    ]

    if (functions[process.step] !== undefined) functions[process.step]()
    if (functions[process.step] === undefined) process.next = undefined

    return process

  }

  return process
}

module.exports.calculator = calculator