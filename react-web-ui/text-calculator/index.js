const sigmoid = (x) => {
  if (x === 0) return 0
  if (x > 0) return 1 / (1 + Math.exp(-x)) - 0.5
  if (x < 0) return -1 / (1 + Math.exp(-x)) + 0.5
}

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const calculator = (token, setting, library) => {
  const process = { token: token, setting: setting, step: 0, result: [], next: () => next() }

  const next = () => {

    const functions = [
      () => {
        process.result = new Array(4).fill().map(i => [])
        
        process.token.forEach(i => {
          i.forEach(i_ => {
            if (process.result[0].indexOf(i_) === -1) process.result[0].push(i_)
          })
        })

        process.result[1] = process.token.map(i => i.map(i => process.result[0].indexOf(i)))
        process.result[2] = [{}]
        process.result[3] = new Array(process.result[0].length).fill().map(() => new Array(process.setting.vectorsDimensions).fill().map(() => Math.random() * 2 - 1))

        process.step = process.step + 1
      },
      () => {
        process.index = 0
        process.step = process.step + 1
      },
      () => {
        var expect = new Array(process.result[3].length).fill().map(() => new Array(process.setting.vectorsDimensions).fill().map(() => []))

        var list = []

        process.result[1].forEach((i, index) => {
          i.forEach((i_, index_) => {
            const min = Math.max(index_ - process.setting.vectorsWindows, 0)
            const max = Math.min(index_ + process.setting.vectorsWindows, i.length - 1)

            const pre = i.slice(min, index_).map(i => process.result[3][i])
            const current = i.slice(index_, index_ + 1).map(i => process.result[3][i])
            const next = i.slice(index_ + 1, max + 1).map(i => process.result[3][i])
            const all = [...pre, ...next]

            const tokenIndex = i_

            list.push({ pre, current, next, all, tokenIndex })
          })
        })

        list = shuffleArray(list)

        list.forEach((i) => {
          const { pre, current, next, all, tokenIndex } = i

          var result = new Array(process.setting.vectorsDimensions).fill(0)

          result.forEach((i, index) => result[index] = all.reduce((t, i) => t + i[index], 0) / all.length)

          expect[tokenIndex].forEach((i, index) => expect[tokenIndex][index].push(result[index]))
        })

        expect.forEach((i, index) => expect[index].forEach((i_, index_) => expect[index][index_] = expect[index][index_].reduce((t, i) => t + i, 0) / expect[index][index_].length))

        process.result[3].forEach((i, index) => process.result[3][index].forEach((i_, index_) => process.result[3][index][index_] = process.result[3][index][index_] + (expect[index][index_] - process.result[3][index][index_]) * process.setting.vectorsRate))

        // process.result[3].forEach((i, index) => {
        //   var max = 0
        //   i.forEach((i_) => max = Math.max(max, i_))
        //   if (max > 1) i.forEach((i_, index_) => process.result[3][index][index_] = process.result[3][index][index_] / max)
        // })

        // var max = 0
        // process.result[3].forEach((i) => i.forEach((i_) => max = Math.max(max, i_)))
        // process.result[3].forEach((i, index) => i.forEach((i_, index_) => process.result[3][index][index_] = process.result[3][index][index_] / max))

        process.index = process.index + 1

        if (process.index === process.setting.vectorsIterations) process.step = process.step + 1
      },
      () => {
        process.result[3].forEach((i, index) => i.forEach((i_, index_) => process.result[3][index][index_] = Number(process.result[3][index][index_].toFixed(8))))

        process.step = process.step + 1
      },
      () => {
        var list = []

        process.result[1].forEach((i, index) => {
          i.forEach((i_, index_) => {
            const min = Math.max(index_ - process.setting.ngramWindows, 0)
            const max = Math.min(index_ + process.setting.ngramWindows, i.length - 1)

            const pre = i.slice(min, index_)
            const current = i.slice(index_, index_ + 1)
            const next = i.slice(index_ + 1, max + 1)
            const all = [...pre, ...next]

            const tokenIndex = i_

            list.push({ pre, current, next, all, tokenIndex })
          })
        })

        list.forEach((i) => {
          const { pre, current, next, all, tokenIndex } = i

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
      }
    ]

    if (functions[process.step] !== undefined) functions[process.step]()
    if (functions[process.step] === undefined) process.next = undefined

    return process

  }

  return process
}

module.exports.calculator = calculator