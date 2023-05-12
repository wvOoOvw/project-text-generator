const wordFrequency = (word, frequency, token) => {
  if (word.indexOf(token) === -1) frequency.push(0)
  if (word.indexOf(token) === -1) word.push(token)

  frequency[word.indexOf(token)] = frequency[word.indexOf(token)] + 1

  return [word, frequency]
}

const calculator = (token, setting, library) => {
  const resultLibrary = JSON.parse(JSON.stringify(library))

  const process = { token: token, setting: setting, step: 0, index: 0, resultCache: [], result: resultLibrary, next: () => next() }

  const next = () => {

    if (process.step === 0) {
      process.token.forEach(i => wordFrequency(process.result[0], process.result[1], i))

      process.step = process.step + 1

      return process
    }

    if (process.step === 1) {
      process.token = process.token.map(i => process.result[0].indexOf(i))

      process.step = process.step + 1

      return process
    }

    if (process.step === 2) {
      const minIndex = process.index
      const maxIndex = Math.min(process.index + process.setting.recordContextLength, token.length)

      const current = process.token.slice(minIndex, maxIndex)

      process.result[2].push(current)
      process.resultCache.push(current)

      process.index = process.index + 1

      if (process.index + process.setting.recordContextLength > token.length) process.step = process.step + 1
      if (process.index + process.setting.recordContextLength > token.length) process.index = 0

      return process
    }

    if (process.step === 3) {
      const current = process.resultCache[process.index]

      const previous = current.slice(0, current.length - 1)
      const last = current[current.length - 1]

      previous.reverse().forEach((i, index) => {
        if (process.result[3][index] === undefined) process.result[3][index] = {}
        if (process.result[3][index][i] === undefined) process.result[3][index][i] = []
        if (process.result[3][index][i].find(i_ => i_[0] === last) === undefined) process.result[3][index][i].push([last, 0])
        process.result[3][index][i].find(i_ => i_[0] === last)[1] = process.result[3][index][i].find(i_ => i_[0] === last)[1] + process.setting.weight
      })

      process.index = process.index + 1

      if (process.resultCache[process.index] === undefined) process.next = undefined

      return process
    }

  }

  return process
}

module.exports.calculator = calculator