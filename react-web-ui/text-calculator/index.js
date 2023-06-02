const calculator = (token, setting, library) => {
  const resultLibrary = JSON.parse(JSON.stringify(library))

  const process = { token: token, setting: setting, step: 0, index: 0, recordContextCache: [], result: resultLibrary, next: () => next() }

  const next = () => {

    if (process.step === 0) {
      process.token.forEach(i => {
        if (process.result[0].indexOf(i) === -1) process.result[1].push(0)
        if (process.result[0].indexOf(i) === -1) process.result[0].push(i)

        process.result[1][process.result[0].indexOf(i)] = process.result[1][process.result[0].indexOf(i)] + 1
      })

      process.step = process.step + 1

      return process
    }

    if (process.step === 1) {
      process.token = process.token.map(i => process.result[0].indexOf(i))

      process.step = process.step + 1

      return process
    }

    if (process.step === 2) {
      process.result[2].push(process.token)

      process.step = process.step + 1

      return process
    }

    if (process.step === 3) {
      process.token.forEach(i => {
        if (process.result[3][i] === undefined) process.result[3][i] = []
        if (process.result[3][i].indexOf(process.result[2].length - 1) === -1) process.result[3][i].push(process.result[2].length - 1)
      })

      process.step = process.step + 1

      return process
    }

    if (process.step === 4) {
      const minIndex = Math.max(process.index - process.setting.recordContextLength - 1, 0)
      const maxIndex = Math.min(process.index, token.length)

      const current = process.token.slice(minIndex, maxIndex)

      if (current.length > 1) process.recordContextCache.push(current)

      process.index = process.index + 1

      if (process.index - process.setting.recordContextLength - 1 > token.length) process.step = process.step + 1
      if (process.index - process.setting.recordContextLength - 1 > token.length) process.index = 0

      return process
    }

    if (process.step === 5) {
      const current = process.recordContextCache[process.index]

      const previous = current.slice(0, current.length - 1).reverse()
      const last = current[current.length - 1]

      previous.forEach((i, index) => {
        if (index > 0) {
          const key = `${index}-${index + 1}`
          const value = previous.slice(index, index + 1).join('-')
          if (process.result[4][key] === undefined) process.result[4][key] = {}
          if (process.result[4][key][value] === undefined) process.result[4][key][value] = []
          if (process.result[4][key][value].find(i_ => i_[0] === last) === undefined) process.result[4][key][value].push([last, 0])
          process.result[4][key][value].find(i_ => i_[0] === last)[1] = process.result[4][key][value].find(i_ => i_[0] === last)[1] + process.setting.weight
        }

        if (index > -1) {
          const key = `0-${index + 1}`
          const value = previous.slice(0, index + 1).join('-')
          if (process.result[4][key] === undefined) process.result[4][key] = {}
          if (process.result[4][key][value] === undefined) process.result[4][key][value] = []
          if (process.result[4][key][value].find(i_ => i_[0] === last) === undefined) process.result[4][key][value].push([last, 0])
          process.result[4][key][value].find(i_ => i_[0] === last)[1] = process.result[4][key][value].find(i_ => i_[0] === last)[1] + process.setting.weight
        }
      })

      process.index = process.index + 1

      if (process.recordContextCache[process.index] === undefined) process.next = undefined

      return process
    }

  }

  return process
}

module.exports.calculator = calculator