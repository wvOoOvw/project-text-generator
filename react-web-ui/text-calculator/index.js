const calculator = (token, setting, library) => {
  const resultLibrary = JSON.parse(JSON.stringify(library))

  const process = { token: token, setting: setting, step: 0, index: 0, recordCache: [], result: resultLibrary, next: () => next() }

  const next = () => {

    const functions = [
      () => {
        process.token.forEach(i => {
          if (process.result[0].indexOf(i) === -1) process.result[1].push(0)
          if (process.result[0].indexOf(i) === -1) process.result[0].push(i)

          process.result[1][process.result[0].indexOf(i)] = process.result[1][process.result[0].indexOf(i)] + 1
        })

        process.token = process.token.map(i => process.result[0].indexOf(i))

        process.result[2].push(process.token)

        process.result[3].push(...new Array(process.result[0].length - process.result[3].length).fill().map(i => []))

        process.token.forEach((i, index) => {
          process.result[3][i].push([process.result[2].length - 1, index, process.setting.weight])
        })

        process.step = process.step + 1
        process.step = 100
      },
      () => {
        const recordLength = process.setting.recordContextLength

        const minIndex = Math.max(process.index - recordLength - 1, 0)
        const maxIndex = Math.min(process.index, token.length)

        const current = process.token.slice(minIndex, maxIndex)

        if (current.length > 1 && current.length === recordLength + 1) process.recordCache.push(current)

        process.index = process.index + 1

        if (process.index - recordLength - 1 > token.length) process.step = process.step + 1
        if (process.index - recordLength - 1 > token.length) process.index = 0
      },
      () => {
        const current = process.recordCache[process.index]

        const last = current[current.length - 1]
        const previous = current.slice(0, current.length - 1).reverse()

        var recordIndex = process.result[4].findIndex(i => i.slice(0, i.length - 1).join('/') === [last, ...previous].join('/'))

        if (recordIndex !== -1) {
          process.result[4][recordIndex][process.result[4][recordIndex].length - 1] = process.result[4][recordIndex][process.result[4][recordIndex].length - 1] + process.setting.weight
        }

        if (recordIndex === -1) {
          recordIndex = process.result[4].length
          process.result[4][recordIndex] = [last, ...previous, process.setting.weight]
        }

        previous.forEach((i, index) => {
          if (process.result[5][index] === undefined) process.result[5][index] = []
          if (process.result[5][index].length !== process.result[0].length) process.result[5][index].push(...new Array(process.result[0].length - process.result[5][index].length).fill().map(i => []))
          if (process.result[5][index][i].find(i_ => i_ === recordIndex) === undefined) process.result[5][index][i].push(recordIndex)
        })

        process.index = process.index + 1

        if (process.recordCache[process.index] === undefined) process.step = process.step + 1
      },
    ]

    if (functions[process.step] !== undefined) functions[process.step]()
    if (functions[process.step] === undefined) process.next = undefined

    return process

  }

  return process
}

module.exports.calculator = calculator