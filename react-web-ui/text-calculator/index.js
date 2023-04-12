const calculator = (token, setting, context) => {
  const resultContext = JSON.parse(JSON.stringify(context))
  const resultDiff = {}

  const process = { token: token, setting: setting, index: 0, result: { resultContext, resultDiff }, next: () => next() }

  const next = () => {

    new Array(process.setting.recordLength + 1).fill().forEach((i, index) => {
      const current = process.token[process.index + index]

      if (current === undefined) return

      const resultContext_ = process.token.slice(process.index, process.index + index).reduce((t, i) => t[i].children, resultContext)
      const resultDiff_ = process.token.slice(process.index, process.index + index).reduce((t, i) => t[i].children, resultDiff)

      if (resultContext_[current] === undefined) {
        resultContext_[current] = { weight: 0, children: {} }
      }
      if (resultContext_[current] !== undefined) {
        resultContext_[current].weight = resultContext_[current].weight + process.setting.weight
      }

      if (resultDiff_[current] === undefined) {
        resultDiff_[current] = { weight: 0, children: {} }
      }
      if (resultDiff_[current] !== undefined) {
        resultDiff_[current].weight = resultDiff_[current].weight + process.setting.weight
      }
    })

    process.index = process.index + 1

    if (!process.token[process.index]) process.next = undefined

    return process
  }

  return process
}

module.exports.calculator = calculator