const DictChinese = require('./Dict.Chinese.json')
// const DictEnglish = require('./Dict.English.json')
const DictSP = require('./Dict.SP.json')

const Dict = [DictChinese, DictSP]

const DictObject = {}

Dict.forEach(dict => {
  dict.forEach(i => {
    var useObject = DictObject

    i.split('').forEach((i_, index_) => {
      useObject[i_] = useObject[i_] ? useObject[i_] : {}
      useObject[i_]['_use'] = useObject[i_]['_use'] ? useObject[i_]['_use'] : index_ === i.length - 1
      useObject = useObject[i_]
    })
  })
})

const tokenizer = (text) => {
  const process = { text: text, step: 0, result: [], next: () => next() }

  const next = () => {

    const functions = [
      () => {
        process.index = 0
        process.step = process.step + 1
      },
      () => {
        var searchObject = DictObject
        var searchIndex = 1
        var searchResult = ''
        var searchCache = ''

        while (searchIndex) {
          const current = process.text.slice(process.index + searchIndex - 1, process.index + searchIndex)

          if (!searchObject[current]) {
            searchIndex = 0
          }

          if (searchObject[current]) {
            if (searchObject[current]['_use']) searchResult = searchCache + current
            searchCache = searchCache + current
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

        if (process.text.length === process.index) process.step = process.step + 1
      }
    ]

    if (functions[process.step] !== undefined) functions[process.step]()
    if (functions[process.step] === undefined) process.next = undefined

    return process
  }

  return process
}

module.exports.tokenizer = tokenizer

// const tokenizerProcess = tokenizer(`觥饭不及壶`)

// while (tokenizerProcess.next) console.log(tokenizerProcess.next().result)
