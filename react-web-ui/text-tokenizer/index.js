const DictChinese = require('./Dict.Chinese.json')

const DictChineseLengthObject = {}

DictChinese.forEach(i => {
  const length = i.length

  DictChineseLengthObject[length] = DictChineseLengthObject[length] ? DictChineseLengthObject[length] : []

  DictChineseLengthObject[length].push(i)
})

const tokenizer = (text) => {
  const process = { text: text, index: 0, result: [], next: () => next(process) }

  const next = (process) => {
    const matchResult = match(process.text, process.index)

    process.index = process.index + matchResult.length
    process.result.push(matchResult)

    if (process.text.length === process.index) process.next = undefined

    return process
  }

  return process
}

const match = (text, index) => {
  var searchLength = Math.min(Math.max(...Object.keys(DictChineseLengthObject).map(i => Number(i))), text.length - index)

  while (searchLength > 1) {
    searchResult = text.slice(index, index + searchLength)

    const resultLength = searchResult.length

    const find = DictChineseLengthObject[resultLength] ? DictChineseLengthObject[resultLength].find(i => i === searchResult) : null

    if (find) break

    if (!find) searchLength = searchLength - 1
  }

  return text.slice(index, index + searchLength)
}

module.exports.tokenizer = tokenizer

// const tokenizerProcess = tokenizer('木瓜是一种好吃的水果。')
