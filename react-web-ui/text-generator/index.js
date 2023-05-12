const generator = (token, setting, library) => {
  const process = { token: token, setting: setting, library: library, result: [], cacheRepeat: { result: '', index: 0 }, next: () => next() }

  const next = () => {
    if (Array.isArray(process.library) === false) {
      process.next = undefined
      return process
    }

    var searchResult = []
    var matchResult

    const search = () => {
      const searchResult_ = []

      const searchToken = [...process.token, ...process.result]

      const searchMinIndex = Math.max(searchToken.length - process.setting.memoryContextLength, 0)
      const searchMaxIndex = searchToken.length

      const searchCurrent = searchToken.slice(searchMinIndex, searchMaxIndex).map(i => process.library[0].indexOf(i))

      searchCurrent.reverse().forEach((i, index) => {
        if (process.library[3][index] === undefined) return
        if (process.library[3][index][i] === undefined) return

        process.library[3][index][i].forEach(i => searchResult.push({ token: i[0], weight: Math.pow(0.8, index) * i[1] }))
      })

      searchResult.forEach((i) => {
        i.token = process.library[0][i.token]

        const find = searchResult_.find(i_ => i_.token === i.token)

        if (find === undefined) searchResult_.push(i)
        if (find !== undefined) find.weight = find.weight + i.weight
      }, [])

      searchResult = searchResult_.length === 0 ? [{ token: process.library[0][0], weight: 1 }] : searchResult_
    }

    search()

    const match = () => {
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

      searchResult.forEach(i => matchResult === undefined && random < i.percent ? matchResult = i.token : null)

      if (matchResult !== undefined) process.result.push(matchResult)
    }

    match()


    const repeat = () => {
      if (process.setting.repeatLength === 0 || process.result.length < process.setting.repeatLength) return

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

    repeat()

    process.index = process.index + 1

    if (matchResult === undefined) process.next = undefined
    if (process.cacheRepeat.index > 16) process.next = undefined
    if (process.setting.stopToken && process.setting.stopToken.includes(matchResult)) process.next = undefined
    if (process.result.length === process.setting.createTokenLength) process.next = undefined

    return process
  }

  return process
}

module.exports.generator = generator
