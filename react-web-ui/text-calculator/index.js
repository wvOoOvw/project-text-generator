const safeNumber = (n, l) => Number(Number(n).toFixed(l))

const calculator = (token, setting, library) => {
  const resultLibrary = JSON.parse(JSON.stringify(library ? library : {}))
  const resultDiff = {}

  const process = { token: [...token], token_reverse: [...token].reverse(), setting: setting, index: 0, result: { resultLibrary, resultDiff }, next: () => next() }

  const next = () => {
    if (process.setting.recordContextLengthLeft > 0) {
      new Array(process.setting.recordContextLengthLeft + 1).fill().forEach((i, index) => {
        const current = process.token_reverse[process.index + index]

        if (current === undefined) return

        const resultLibrary_ = process.token_reverse.slice(process.index, process.index + index).reduce((t, i) => { t[i].left = t[i].left ? t[i].left : {}; return t[i].left }, process.result.resultLibrary)
        const resultDiff_ = process.token_reverse.slice(process.index, process.index + index).reduce((t, i) => { t[i].left = t[i].left ? t[i].left : {}; return t[i].left }, process.result.resultDiff)

        const weightOffset = process.setting.weight + Math.random() * process.setting.randomAddition

        if (resultLibrary_[current] === undefined) {
          resultLibrary_[current] = { weight: 0 }
        }
        if (resultLibrary_[current] !== undefined) {
          resultLibrary_[current].weight = resultLibrary_[current].weight + weightOffset
          resultLibrary_[current].weight = safeNumber(resultLibrary_[current].weight, 4)
        }

        if (resultDiff_[current] === undefined) {
          resultDiff_[current] = { weight: 0 }
        }
        if (resultDiff_[current] !== undefined) {
          resultDiff_[current].weight = resultDiff_[current].weight + weightOffset
          resultDiff_[current].weight = safeNumber(resultDiff_[current].weight, 4)
        }
      })
    }

    if (process.setting.recordContextLengthRight > 0) {
      new Array(process.setting.recordContextLengthRight + 1).fill().forEach((i, index) => {
        const current = process.token[process.index + index]

        if (current === undefined) return

        const resultLibrary_ = process.token.slice(process.index, process.index + index).reduce((t, i) => { t[i].right = t[i].right ? t[i].right : {}; return t[i].right }, process.result.resultLibrary)
        const resultDiff_ = process.token.slice(process.index, process.index + index).reduce((t, i) => { t[i].right = t[i].right ? t[i].right : {}; return t[i].right }, process.result.resultDiff)

        const weightOffset = process.setting.weight + Math.random() * process.setting.randomAddition

        if (resultLibrary_[current] === undefined) {
          resultLibrary_[current] = { weight: 0 }
        }
        if (resultLibrary_[current] !== undefined) {
          resultLibrary_[current].weight = resultLibrary_[current].weight + weightOffset
          resultLibrary_[current].weight = safeNumber(resultLibrary_[current].weight, 4)
        }

        if (resultDiff_[current] === undefined) {
          resultDiff_[current] = { weight: 0 }
        }
        if (resultDiff_[current] !== undefined) {
          resultDiff_[current].weight = resultDiff_[current].weight + weightOffset
          resultDiff_[current].weight = safeNumber(resultDiff_[current].weight, 4)
        }
      })
    }

    process.index = process.index + 1

    if (!process.token[process.index]) process.next = undefined

    return process
  }

  return process
}

module.exports.calculator = calculator