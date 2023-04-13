const generator = (token, setting, library) => {
  const process = { token: token, setting: setting, library: library, result: [], next: () => next() }

  const next = () => {
    const matchResult = match([...process.token, ...process.result], process.setting, process.library)

    process.result.push(matchResult)

    if (process.result.length === process.setting.createTokenLength) process.next = undefined

    return process
  }

  return process
}

const match = (token, setting, library) => {
  var searchLength = Math.min(setting.memoryContext, token.length)
  var searchIndex = 1
  var searchResult = []

  while (searchIndex < searchLength + 1) {
    searchCurrent = token.slice(token.length - searchIndex, token.length)

    let cache = library

    searchCurrent.forEach(i => {
      cache = cache && cache[i] && cache[i].children && Object.keys(cache[i].children).length ? cache[i].children : null
    })

    if (cache) searchResult.push(cache)

    searchIndex = searchIndex + 1
  }

  if (searchResult.length === 0) return Object.keys(library)[0]

  const currentResult = Object.entries(searchResult[searchResult.length - 1]).map(i => ({ name: i[0], weight: i[1].weight }))

  const weightMiddle = currentResult.reduce((t, i) => t + i.weight, 0) / currentResult.length

  currentResult.forEach(i => i.weight = weightMiddle + (i.weight - weightMiddle) * setting.temperature)

  const weightAll = currentResult.reduce((t, i) => t + i.weight, 0)

  var percentResult = currentResult
  percentResult = percentResult.sort((a, b) => b.weight - a.weight)
  percentResult = percentResult.map((i, index) => { i.percent = i.weight / weightAll; return i })
  percentResult.reduce((t, i) => { i.toTop = t <= setting.toTop; return t + i.percent}, 0)
  percentResult = percentResult.filter(i => i.toTop)

  const weightAllAfterCollection = percentResult.reduce((t, i) => t + i.weight, 0)

  var percentResultAfterCollection = percentResult
  percentResultAfterCollection = percentResultAfterCollection.sort((a, b) => b.weight - a.weight)
  percentResultAfterCollection = percentResultAfterCollection.map((i, index) => { i.percent = i.weight / weightAllAfterCollection; i.percent = index === 0 ? i.percent : i.percent + percentResultAfterCollection[index - 1].percent; return i })

  const random = Math.random()

  var result

  percentResultAfterCollection.forEach(i => !result && random < i.percent ? result = i.name : null)

  return result
}

module.exports.generator = generator
