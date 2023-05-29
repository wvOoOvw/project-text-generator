const search = (process) => {
  process.searchResult = []

  const searchToken = [...process.token, ...process.result]
  const searchTokenReverse = [...process.token, ...process.result].reverse()

  const searchMinIndex = Math.max(searchToken.length - process.setting.memoryContextLength, 0)
  const searchMaxIndex = searchToken.length

  const searchCurrent = searchToken.slice(searchMinIndex, searchMaxIndex).map(i => process.library[0].indexOf(i)).reverse()

  searchCurrent.forEach((i, index) => {
    if (index > 0) {
      const key = `${index}-${index + 1}`
      const value = searchCurrent.slice(index, index + 1).join('-')
      if (process.library[2][key] === undefined) return
      if (process.library[2][key][value] === undefined) return
      process.library[2][key][value].forEach(i => process.searchResult.push({ token: i[0], weight: i[1] * Math.pow(0.1, index + 1) }))
    }

    if (index > -1) {
      const key = `0-${index + 1}`
      const value = searchCurrent.slice(0, index + 1).join('-')
      if (process.library[2][key] === undefined) return
      if (process.library[2][key][value] === undefined) return
      process.library[2][key][value].forEach(i => process.searchResult.push({ token: i[0], weight: i[1] * Math.pow(10, index + 1) }))
    }
  })

  process.searchResult = process.searchResult.map(i => { i.token = process.library[0][i.token]; return i })

  process.searchResult = process.searchResult.reduce((t, i) => {
    const find = t.find(i_ => i_.token === i.token)

    if (find === undefined) t.push(i)
    if (find !== undefined) find.weight = find.weight + i.weight

    return t
  }, [])

  process.searchResult = process.searchResult.map(i => {
    if (i.token.match(/[！？。，]/)) {
      const index = searchTokenReverse.findIndex(i => i.match(/[！？。，]/))
      if (index > -1 && index < process.setting.punctuationSpace) i.weight = i.weight / 10000
    }

    if (i.token.match(/”/)) {
      const index = searchTokenReverse.findIndex(i => i.match(/“/))
      const index_ = searchTokenReverse.findIndex(i => i.match(/”/))
      if (index > -1) {
        if (index_ === -1) i.weight = i.weight * 10000
        if (index_ > -1 && index < index_) i.weight = i.weight * 10000
      }
    }

    if (i.token.match(/（/)) {
      const index = searchTokenReverse.findIndex(i => i.match(/（/))
      const index_ = searchTokenReverse.findIndex(i => i.match(/）/))
      if (index > -1) {
        if (index_ === -1) i.weight = i.weight * 10000
        if (index_ > -1 && index < index_) i.weight = i.weight * 10000
      }
    }

    if (i.token.match(/《/)) {
      const index = searchTokenReverse.findIndex(i => i.match(/《/))
      const index_ = searchTokenReverse.findIndex(i => i.match(/》/))
      if (index > -1) {
        if (index_ === -1) i.weight = i.weight * 10000
        if (index_ > -1 && index < index_) i.weight = i.weight * 10000
      }
    }

    if (i.token.match(/</)) {
      const index = searchTokenReverse.findIndex(i => i.match(/</))
      const index_ = searchTokenReverse.findIndex(i => i.match(/>/))
      if (index > -1) {
        if (index_ === -1) i.weight = i.weight * 10000
        if (index_ > -1 && index < index_) i.weight = i.weight * 10000
      }
    }

    return i
  })

  process.searchResult = process.searchResult.length === 0 ? [{ token: process.library[0][0], weight: 1 }] : process.searchResult
}

const match = (process) => {
  var toTop = process.setting.toTop + (1 - process.setting.toTop) * (process.cacheRepeat.index / process.setting.repeatMaxTime)

  toTop = Math.max(toTop, 1)

  const weightMiddle = process.searchResult.reduce((t, i) => t + i.weight, 0) / process.searchResult.length

  process.searchResult = process.searchResult.map(i => { i.weight = weightMiddle + (i.weight - weightMiddle) * process.setting.temperature; return i })

  const weightAll = process.searchResult.reduce((t, i) => t + i.weight, 0)

  process.searchResult = process.searchResult.sort((a, b) => b.weight - a.weight)
  process.searchResult = process.searchResult.map((i, index) => { i.percent = i.weight / weightAll; i.percentAccumulation = index === 0 ? i.percent : i.percent + process.searchResult[index - 1].percentAccumulation; return i })
  process.searchResult = process.searchResult.filter(i => i.percentAccumulation - i.percent <= toTop)

  const weightAll_ = process.searchResult.reduce((t, i) => t + i.weight, 0)

  process.searchResult = process.searchResult.sort((a, b) => b.weight - a.weight)
  process.searchResult = process.searchResult.map((i, index) => { i.percent = i.weight / weightAll_; i.percentAccumulation = index === 0 ? i.percent : i.percent + process.searchResult[index - 1].percentAccumulation; return i })

  const random = Math.random()

  process.matchResult = process.searchResult.reduce((t, i) => t === null && random < i.percentAccumulation ? i.token : t, null)
}

const repeat = (process) => {
  if (process.setting.repeatLength === 0 || process.setting.repeatDistance === 0 || process.result.length < process.setting.repeatLength) return

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

const generator = (token, setting, library) => {
  const process = { token: token, setting: setting, library: library, result: [], cacheRepeat: { result: '', index: 0 }, next: () => next() }

  const next = () => {
    if (Array.isArray(process.library) === false) {
      process.next = undefined
      return process
    }

    repeat(process)
    search(process)
    match(process)

    console.log(process.searchResult, process.matchResult)

    process.index = process.index + 1

    if (process.matchResult !== undefined) process.result.push(process.matchResult)
    if (process.matchResult === undefined) process.next = undefined
    if (process.cacheRepeat.index > process.setting.repeatMaxTime) process.next = undefined
    if (process.setting.stopToken && process.setting.stopToken.includes(process.matchResult)) process.next = undefined
    if (process.result.length === process.setting.createTokenLength) process.next = undefined

    return process
  }

  return process
}

module.exports.generator = generator
