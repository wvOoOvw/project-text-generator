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
          process.result[3][i].push([process.result[2].length - 1, index])
        })

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