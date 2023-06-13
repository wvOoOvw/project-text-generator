const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function cosineSimilarity(vec1, vec2) {
  if (vec1.length !== vec2.length) {
    throw new Error('Vector dimensionss must match');
  }

  let dotProduct = 0;
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
  }

  const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + Math.pow(val, 2), 0));
  const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + Math.pow(val, 2), 0));

  const similarity = dotProduct / (magnitude1 * magnitude2);

  return similarity;
}

const comparator = (token, setting, library) => {
  const resultLibrary = library

  const process = { token: token, setting: setting, step: 0, index: 0, cache: [], result: resultLibrary, next: () => next() }

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

            const pre = i.slice(min, index_).map(i => process.result[2][i])
            const current = i.slice(index_, index_ + 1).map(i => process.result[2][i])[0]
            const next = i.slice(index_ + 1, max + 1).map(i => process.result[2][i])

            list.push({ pre, current, next, token: i_ })
          })
        })

        list = shuffleArray(list)

        list.forEach((i) => {
          const { pre, current, next, token } = i

          const all = [...pre, ...next]

          var result = new Array(process.setting.dimensions).fill(0)

          all.forEach(i => {
            i.forEach((i, index) => result[index] = result[index] + i)
          })

          result = result.map((i) => i / (process.setting.windows * 2))

          result = result.map((i, index) => current[index] + process.setting.rate * i)

          process.result[2][token] = result
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
        process.result[2].forEach((i, index) => i.forEach((i_, index_) => process.result[2][index][index_] = Number(process.result[2][index][index_].toFixed(16))))

        process.step = process.step + 1
      },
      () => {
        process.result[2].forEach((i, index) => {
          process.result[3][index] = i.reduce((t, i) => t + i, 0)
        })

        process.result[4] = [...process.result[3]].sort((a, b) => a - b)

        process.step = process.step + 1
      }
    ]

    if (functions[process.step] !== undefined) functions[process.step]()
    if (functions[process.step] === undefined) process.next = undefined

    return process

  }

  return process
}

module.exports.comparator = comparator