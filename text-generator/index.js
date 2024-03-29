const getWeight = (object) => {
  var total = 0

  if (object.w !== undefined) total = total + object.w

  Object.keys(object).filter(i => i !== 'w').forEach(i => total = total + getWeight(object[i]))

  return total
}

const search = (process) => {
  process.searchResult = []

  const memoryContextLength = process.setting.memoryContextLength

  const all = [...process.token, ...process.result]
  const reverse = [...process.token, ...process.result].reverse()
  const min = Math.max(all.length - memoryContextLength, 0)
  const max = all.length
  const use = all.slice(min, max).map(i => process.library[0].indexOf(i))

  process.searchResult = use.reduce((t, i, index) => {
    if (t.length > 0) return t

    var cache = process.library[2][0]

    const list = use.slice(index, use.length)

    list.forEach(i => cache = cache && cache[i] && cache[i].w === undefined ? cache[i] : null)

    if (cache) return Object.entries(cache).map(i => ({ tokenIndex: i[0], token: process.library[0][i[0]], weight: getWeight(i[1]) }))

    return t
  }, process.searchResult)

  process.searchResult = process.searchResult.map(i => {
    if (i.token.match(/[！？。，]/)) {
      const index = reverse.findIndex(i => i.match(/[！？。，]/))
      if (index > -1 && index < process.setting.punctuationSpace) i.weight = i.weight / 4
    }

    const checkList = [[/^‘$/, /^’$/], [/^“$/, /^”$/], [/^<$/, /^>$/], [/^（$/, /^）$/], [/^《$/, /^》$/]]

    checkList.forEach(i_ => {
      const index = reverse.findIndex(i => i.match(i_[0]))
      const index_ = reverse.findIndex(i => i.match(i_[1]))

      if (i.token.match(i_[0]) !== null) {
        if (index !== -1 && index_ === -1) i.weight = i.weight / 4
        if (index !== -1 && index_ !== -1 && index < index_) i.weight = i.weight / 4
      }

      if (i.token.match(i_[1]) !== null) {
        if (index === -1 && index_ === -1) i.weight = i.weight / 4
        if (index === -1 && index_ !== -1) i.weight = i.weight / 4
        if (index !== -1 && index_ !== -1 && index > index_) i.weight = i.weight / 4
        if (index !== -1 && index_ !== -1 && index < index_) i.weight = i.weight * 4
        if (index !== -1 && index_ === -1) i.weight = i.weight * 4
      }
    })

    return i
  })
}

const match = (process) => {
  process.matchResult = null

  var topP = process.setting.topP + (1 - process.setting.topP) * (process.cacheRepeat.index / 4)
  var temperature = process.setting.temperature + (0 - process.setting.temperature) * (process.cacheRepeat.index / 4)

  const weightMiddle = process.searchResult.reduce((t, i) => t + i.weight, 0) / process.searchResult.length

  process.searchResult = process.searchResult.map(i => { i.weight = weightMiddle + (i.weight - weightMiddle) * temperature; return i })

  var allWeight = process.searchResult.reduce((t, i) => t + i.weight, 0)

  process.searchResult = process.searchResult.sort((a, b) => b.weight - a.weight)
  process.searchResult = process.searchResult.map((i, index) => { i.percent = i.weight / allWeight; i.percentAccumulation = index === 0 ? i.percent : i.percent + process.searchResult[index - 1].percentAccumulation; return i })
  process.searchResult = process.searchResult.filter(i => i.percentAccumulation - i.percent <= topP)

  var allWeight = process.searchResult.reduce((t, i) => t + i.weight, 0)

  process.searchResult = process.searchResult.sort((a, b) => b.weight - a.weight)
  process.searchResult = process.searchResult.map((i, index) => { i.percent = i.weight / allWeight; i.percentAccumulation = index === 0 ? i.percent : i.percent + process.searchResult[index - 1].percentAccumulation; return i })

  const random = Math.random()

  process.matchResult = process.searchResult.reduce((t, i) => t === null && random < i.percentAccumulation ? i.token : t, process.matchResult)

  if (process.matchResult === null && process.token.length === 0) process.matchResult = process.library[0][Math.floor(Math.random() * process.library[0].length)]
}

const repeat = (process) => {
  if (process.setting.repeatLength === 0 || process.result.length < process.setting.repeatLength) return

  const allToken = [...process.token, ...process.result]

  const origin = process.result.slice(process.result.length - process.setting.repeatLength, process.result.length)
  const target = allToken.slice(Math.max(allToken.length - process.setting.repeatLength - process.setting.createTokenLength, 0), allToken.length - process.setting.repeatLength)

  const originString = origin.join('')
  const targetString = target.join('')

  if (targetString.includes(originString)) {
    process.result = process.result.slice(0, process.result.length - process.setting.repeatLength)
    process.cacheRepeat.result = process.result
    process.cacheRepeat.index = process.cacheRepeat.result === process.result ? process.cacheRepeat.index + 1 : 0
  }
}

const generator = (token, setting, library) => {
  const process = { token: token, setting: setting, library: library, step: 0, result: [], next: () => next() }

  const next = () => {

    const functions = [
      () => {
        if (Array.isArray(process.library) === false) process.step = -1
        if (Array.isArray(process.library) === true) process.step = process.step + 1
      },
      () => {
        process.index = 0
        process.step = process.step + 1
        process.cacheRepeat = { result: '', index: 0 }
      },
      () => {
        repeat(process)
        search(process)
        match(process)

        process.index = process.index + 1

        if (process.matchResult !== null) process.result.push(process.matchResult)

        if (process.matchResult === null) process.step = -1
        if (process.cacheRepeat.index > process.setting.repeatMaxTime) process.step = -1
        if (process.setting.stopToken && process.setting.stopToken.includes(process.matchResult)) process.step = -1
        if (process.result.length === process.setting.createTokenLength) process.step = -1
      }
    ]

    if (functions[process.step] !== undefined) functions[process.step]()
    if (functions[process.step] === undefined) process.next = null

    return process

  }

  return process
}

module.exports.generator = generator