function calculateSimilarity(str1, str2) {
  const m = str1.length;
  const n = str2.length;

  if (m === 0) return n;
  if (n === 0) return m;

  const d = [];
  for (let i = 0; i <= m; i++) {
    d[i] = [i];
  }
  for (let j = 0; j <= n; j++) {
    d[0][j] = j;
  }

  for (let j = 1; j <= n; j++) {
    for (let i = 1; i <= m; i++) {
      if (str1[i - 1] === str2[j - 1]) {
        d[i][j] = d[i - 1][j - 1];
      } else {
        d[i][j] = Math.min(
          d[i - 1][j] + 1, // 删除操作
          d[i][j - 1] + 1, // 插入操作
          d[i - 1][j - 1] + 1 // 替换操作
        );
      }
    }
  }

  return 1 - d[m][n] / Math.max(m, n);
}

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
      if (process.library[3][key] === undefined) return
      if (process.library[3][key][value] === undefined) return
      process.library[3][key][value].forEach(i => process.searchResult.push({ token: i[0], weight: i[1] * Math.pow(0.1, index + 1) }))
    }

    if (index > -1) {
      const key = `0-${index + 1}`
      const value = searchCurrent.slice(0, index + 1).join('-')
      if (process.library[3][key] === undefined) return
      if (process.library[3][key][value] === undefined) return
      process.library[3][key][value].forEach(i => process.searchResult.push({ token: i[0], weight: i[1] * Math.pow(10, index + 1) }))
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

    const checkList = [[/^“$/, /^”$/], [/^<$/, /^>$/], [/^（$/, /^）$/], [/^《$/, /^》$/]]

    checkList.forEach(i_ => {
      const index = searchTokenReverse.findIndex(i => i.match(i_[0]))
      const index_ = searchTokenReverse.findIndex(i => i.match(i_[1]))

      if (i.token.match(i_[0]) !== null) {
        if (index !== -1 && index_ === -1) i.weight = i.weight / 10000
        if (index !== -1 && index_ !== -1 && index < index_) i.weight = i.weight / 10000
      }

      if (i.token.match(i_[1]) !== null) {
        if (index === -1 && index_ === -1) i.weight = i.weight / 10000
        if (index === -1 && index_ !== -1) i.weight = i.weight / 10000
        if (index !== -1 && index_ === -1) i.weight = i.weight * 10000
        if (index !== -1 && index_ !== -1 && index < index_) i.weight = i.weight * 10000
        if (index !== -1 && index_ !== -1 && index > index_) i.weight = i.weight / 10000
      }
    })

    return i
  })

  process.searchResult = process.searchResult.length === 0 ? [{ token: process.library[0][0], weight: 1 }] : process.searchResult
}

const match = (process) => {
  var toTop = process.setting.toTop + (1 - process.setting.toTop) * (process.cacheRepeat.index / process.setting.repeatMaxTime)

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
