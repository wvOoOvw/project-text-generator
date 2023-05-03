const DictChinese = require('./Dict.Chinese.json')
const DictEnglish = require('./Dict.English.json')
const DictSP = require('./Dict.SP.json')

const DictLengthObject = {}

DictChinese.forEach(i => {
  const length = i.length

  DictLengthObject[length] = DictLengthObject[length] ? DictLengthObject[length] : []

  DictLengthObject[length].push(i)
})

DictEnglish.forEach(i => {
  const length = i.length

  DictLengthObject[length] = DictLengthObject[length] ? DictLengthObject[length] : []

  DictLengthObject[length].push(i)
})

DictSP.forEach(i => {
  const length = i.length

  DictLengthObject[length] = DictLengthObject[length] ? DictLengthObject[length] : []

  DictLengthObject[length].push(i)
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
  var searchLength = Math.min(Math.max(...Object.keys(DictLengthObject).map(i => Number(i))), text.length - index)
  var searchIndex = 1
  var searchResult = []

  while (searchIndex < searchLength + 1) {
    searchCurrent = text.slice(index, index + searchIndex)

    const resultLength = searchCurrent.length

    const find = DictLengthObject[resultLength] ? DictLengthObject[resultLength].find(i => i.toLocaleLowerCase() === searchCurrent.toLocaleLowerCase()) : null

    if (find) searchResult.push(searchCurrent)

    searchIndex = searchIndex + 1
  }

  var result = searchResult.length ? searchResult.pop() : text.slice(index, index + 1)

  if (result.match(/^\d+$/)) {
    while (text[index + result.length] && text[index + result.length].match(/^\d+$/)) {
      result = result + text[index + result.length]
    }
  }

  if (result.match(/^[a-z|A-Z|']+$/)) {
    while (text[index + result.length] && text[index + result.length].match(/^[a-z|A-Z|']+$/)) {
      result = result + text[index + result.length]
    }
  }

  return result
}

module.exports.tokenizer = tokenizer

// const tokenizerProcess = tokenizer(`I'm a girl`)

// while (tokenizerProcess.next) console.log(tokenizerProcess.next().result)
