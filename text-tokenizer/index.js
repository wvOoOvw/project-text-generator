const DictObject = require('./Dict.Object.json')

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

        if (matchResult.match(/^[a-z|A-Z|\d|-|%|\/|\.]+$/)) {
          while (process.text[process.index + matchResult.length] && process.text[process.index + matchResult.length].match(/^[a-z|A-Z|\d|-|%|\/|\.]+$/)) {
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
    if (functions[process.step] === undefined) process.next = null

    return process
  }

  return process
}

module.exports.tokenizer = tokenizer

// const tokenizerProcess = tokenizer(`皮糜烂的，80%都是混合真菌感染\n\n这种情况要想把感染源遏`)

// while (tokenizerProcess.next) console.log(tokenizerProcess.next().result)
