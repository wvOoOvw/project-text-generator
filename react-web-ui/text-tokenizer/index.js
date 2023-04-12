const DictChinese = require('./Dict.Chinese.json')

const DictChineseLengthObject = {}

DictChinese.forEach(i => {
  const length = i.length

  DictChineseLengthObject[length] = DictChineseLengthObject[length] ? DictChineseLengthObject[length] : []

  DictChineseLengthObject[length].push(i)
})

const tokenizer = (text) => {
  const process = { text: text, index: 0, result: [], next: () => next() }

  const next = () => {
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
  var searchIndex = 1
  var searchResult = []

  while (searchIndex < searchLength + 1) {
    searchCurrent = text.slice(index, index + searchIndex)

    const resultLength = searchCurrent.length

    const find = DictChineseLengthObject[resultLength] ? DictChineseLengthObject[resultLength].find(i => i === searchCurrent) : null

    if (find) searchResult.push(searchCurrent)

    searchIndex = searchIndex + 1
  }

  return searchResult.length ? searchResult.pop() : text.slice(index, index + 1)
}

module.exports.tokenizer = tokenizer

// const tokenizerProcess = tokenizer('木瓜是一种好吃的水果。')

// while (tokenizerProcess.next) console.log(tokenizerProcess.next().result)
