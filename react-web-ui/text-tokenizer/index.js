const DictChinese = require('./Dict.Chinese.json')
// const DictEnglish = require('./Dict.English.json')
const DictSP = require('./Dict.SP.json')

const Dict = [DictChinese, DictSP]

const DictObject = {}

Dict.forEach(dict => {
  dict.forEach(i => {
    var useObject = DictObject

    i.split('').forEach(i_ => { useObject[i_] = useObject[i_] ? useObject[i_] : {}; useObject = useObject[i_]; })
  })
})

const tokenizer = (text) => {
  const process = { text: text, index: 0, result: [], next: () => next() }

  const next = () => {
    var searchObject = DictObject
    var searchIndex = 1
    var searchResult = ''

    while (searchIndex) {
      const current = process.text.slice(process.index + searchIndex - 1, process.index + searchIndex)

      if (!searchObject[current]) {
        searchIndex = 0
      }

      if (searchObject[current]) {
        searchResult = searchResult + current
        searchObject = searchObject[current]
        searchIndex = searchIndex + 1
      }
    }

    var matchResult = searchResult ? searchResult : process.text.slice(process.index, process.index + 1)

    if (matchResult.match(/^[\d]+$/)) {
      while (process.text[process.index + matchResult.length] && process.text[process.index + matchResult.length].match(/^[a-z|A-Z|\d|-|\/|\.]+$/)) {
        matchResult = matchResult + process.text[process.index + matchResult.length]
      }
    }

    if (matchResult.match(/^[a-z|A-Z]+$/)) {
      while (process.text[process.index + matchResult.length] && process.text[process.index + matchResult.length].match(/^[a-z|A-Z|\d|-|'|\/]+$/)) {
        matchResult = matchResult + process.text[process.index + matchResult.length]
      }
    }

    if (matchResult.match(/^[与其]+$/)) {
      if (process.text[process.index + matchResult.length] && DictObject['其'][process.text[process.index + matchResult.length]]) matchResult = '与'
    }

    process.index = process.index + matchResult.length

    if (matchResult) process.result.push(matchResult)

    if (process.text.length === process.index) process.next = undefined

    return process
  }

  return process
}

module.exports.tokenizer = tokenizer

// const tokenizerProcess = tokenizer(`秋天天气真好啊123`)

// while (tokenizerProcess.next) console.log(tokenizerProcess.next().result)
