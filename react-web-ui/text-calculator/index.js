const safeNumber = (n, l) => Number(Number(n).toFixed(l))

const calculator = (token, setting, context) => {
  const resultLibrary = JSON.parse(JSON.stringify(context))
  const resultDiff = {}

  const process = { token: token, setting: setting, index: 0, result: { resultLibrary, resultDiff }, next: () => next() }

  const next = () => {

    new Array(process.setting.recordLength + 1).fill().forEach((i, index) => {
      const current = process.token[process.index + index]

      if (current === undefined) return

      const resultLibrary_ = process.token.slice(process.index, process.index + index).reduce((t, i) => t[i].children, resultLibrary)
      const resultDiff_ = process.token.slice(process.index, process.index + index).reduce((t, i) => t[i].children, resultDiff)

      const weightOffset = process.setting.weight + Math.random() * process.setting.randomAddition

      if (resultLibrary_[current] === undefined) {
        resultLibrary_[current] = { weight: 0, children: {} }
      }
      if (resultLibrary_[current] !== undefined) {
        resultLibrary_[current].weight = resultLibrary_[current].weight + weightOffset
        resultLibrary_[current].weight = safeNumber(resultLibrary_[current].weight, 4)
      }

      if (resultDiff_[current] === undefined) {
        resultDiff_[current] = { weight: 0, children: {} }
      }
      if (resultDiff_[current] !== undefined) {
        resultDiff_[current].weight = resultDiff_[current].weight + weightOffset
        resultDiff_[current].weight = safeNumber(resultDiff_[current].weight, 4)
      }
    })

    process.index = process.index + 1

    if (!process.token[process.index]) process.next = undefined

    return process
  }

  return process
}

module.exports.calculator = calculator