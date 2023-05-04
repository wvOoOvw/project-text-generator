const DictChinese = require('./Dict.Chinese.json')
const DictEnglish = require('./Dict.English.json')
const DictSP = require('./Dict.SP.json')

const DictObject = {}

DictChinese.forEach(i => {
  var useObject = DictObject

  i.split('').forEach(i_ => { useObject[i_] = useObject[i_] ? useObject[i_] : {}; useObject = useObject[i_]; })
})

DictEnglish.forEach(i => {
  var useObject = DictObject

  i.split('').forEach(i_ => { useObject[i_] = useObject[i_] ? useObject[i_] : {}; useObject = useObject[i_]; })
})

DictSP.forEach(i => {
  var useObject = DictObject

  i.split('').forEach(i_ => { useObject[i_] = useObject[i_] ? useObject[i_] : {}; useObject = useObject[i_]; })
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
  var searchObject = DictObject
  var searchIndex = 1
  var searchResult = ''

  while (searchIndex) {
    const current = text.slice(index + searchIndex - 1, index + searchIndex)

    if (!searchObject[current]) {
      searchIndex = 0
    }

    if (searchObject[current]) {
      searchResult = searchResult + current
      searchObject = searchObject[current]
      searchIndex = searchIndex + 1
    }
  }

  var result = searchResult ? searchResult : text.slice(index, index + 1)

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

const tokenizerProcess = tokenizer(`秋天天气真好啊123`)

while (tokenizerProcess.next) console.log(tokenizerProcess.next().result)
