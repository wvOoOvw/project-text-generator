const arrayRandom = (array, number) => {
  var r = []
  var c = [...array]

  new Array(number).fill().forEach(() => {
    const index = Math.floor(Math.random() * c.length)
    if (c[index]) {
      r.push(c[index])
      c = c.filter((i, index_) => index_ !== index)
    }
  })

  return r
}

const generator = (token, setting, library) => {
  const process = { token: token, setting: setting, library: library, result: [], cacheRepeat: { result: '', index: 0 }, next: () => next() }

  const next = () => {
    var searchToken = [...process.token, ...process.result]
    var searchLength = Math.min(process.setting.memoryContextLength, searchToken.length)
    var searchIndex = 1
    var searchResult
    var matchResult

    while (searchIndex < searchLength + 1) {
      searchCurrent = searchToken.slice(searchToken.length - searchIndex, searchToken.length)

      let cache = process.library

      searchCurrent.forEach(i => {
        cache = cache && cache[i] && cache[i].right && Object.keys(cache[i].right).length ? cache[i].right : null
      })

      if (cache) searchResult = cache

      searchIndex = searchIndex + 1
    }

    if (searchResult === undefined || Object.keys(searchResult).length === 0) searchResult = { ...process.library }

    if (searchResult !== undefined && Object.keys(searchResult).length !== 0) {
      searchResult = Object.entries(searchResult).map(i => ({ name: i[0], weight: i[1].weight }))

      const weightMiddle = searchResult.reduce((t, i) => t + i.weight, 0) / searchResult.length

      searchResult.forEach(i => i.weight = weightMiddle + (i.weight - weightMiddle) * process.setting.temperature)

      const weightAll = searchResult.reduce((t, i) => t + i.weight, 0)

      searchResult = searchResult.sort((a, b) => b.weight - a.weight)
      searchResult = searchResult.map((i, index) => { i.percent = i.weight / weightAll; return i })
      searchResult.reduce((t, i) => { i.toTop = t <= process.setting.toTop; return t + i.percent }, 0)
      searchResult = searchResult.filter(i => i.toTop)

      const weightAllAfterCollection = searchResult.reduce((t, i) => t + i.weight, 0)

      searchResult = searchResult.sort((a, b) => b.weight - a.weight)
      searchResult = searchResult.map((i, index) => { i.percent = i.weight / weightAllAfterCollection; i.percent = index === 0 ? i.percent : i.percent + searchResult[index - 1].percent; return i })

      const random = Math.random()

      searchResult.forEach(i => matchResult === undefined && random < i.percent ? matchResult = i.name : null)
    }

    if (matchResult !== undefined) process.result.push(matchResult)

    if (process.setting.repeatLength > 0 && process.result.length > process.setting.repeatLength) {
      const origin = process.result.slice(process.result.length - process.setting.repeatLength, process.result.length)
      const target = process.result.slice(Math.max(process.result.length - process.setting.repeatLength - process.setting.repeatDistance, 0), process.result.length - process.setting.repeatLength)

      const originString = origin.join('')
      const targetString = target.join('')

      if (targetString.includes(originString)) {
        process.result = process.result.slice(0, process.result.length - process.setting.repeatLength)
        process.cacheRepeat.result = process.result
        process.cacheRepeat.index = process.cacheRepeat.result === process.result ? process.cacheRepeat.index + 1 : 0
      }
    }

    if (process.cacheRepeat.index > 16) process.next = undefined
    if (matchResult === undefined) process.next = undefined
    if (process.setting.stopToken && process.setting.stopToken.includes(matchResult)) process.next = undefined
    if (process.result.length === process.setting.createTokenLength) process.next = undefined

    return process
  }

  return process
}

module.exports.generator = generator
