function findAllIndex(arr, target) {
  var indexs = []
  var index = arr.indexOf(target)

  while (index !== -1) {
    indexs.push(index)
    index = arr.indexOf(target, index + 1)
  }

  return indexs
}

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

  const memoryLength = process.setting.memoryContextLength

  const searchMinIndex = Math.max(searchToken.length - memoryLength, 0)
  const searchMaxIndex = searchToken.length

  const searchCurrent = searchToken.slice(searchMinIndex, searchMaxIndex).map(i => process.library[0].indexOf(i)).reverse()

  const searchObject = {}

  searchCurrent.forEach((i, index) => {
    if (process.library[5][index] === undefined) return
    if (process.library[5][index][i] === undefined) return

    process.library[5][index][i].map(i => process.library[4][i]).forEach(i => {
      if (index !== 0 && searchObject[i[0]] === undefined) return

      searchObject[i[0]] = searchObject[i[0]] ? searchObject[i[0]] : []
      
      if (i.slice(1, index + 1).join('/') === searchCurrent.slice(0, index).join('/')) {
        searchObject[i[0]].push({ token: i[0], weight: i[i.length - 1], position: index, type: 'base' })
      }
      if (i.slice(1, index + 1).join('/') !== searchCurrent.slice(0, index).join('/')) {
        searchObject[i[0]].push({ token: i[0], weight: i[i.length - 1], position: index, type: 'extra' })
      }
    })
  })

  console.log(searchObject)

  process.searchResult = Object.values(searchObject).reduce((t, i) => {
    const base = i.filter(i => i.type === 'base')

    if (base.length !== 0) {
      const baseMaxNumber = Math.max(...base.map(i => i.position)) + 1
      const baseMaxWeight = Math.max(...base.map(i => i.weight))

      const extra = i.filter(i => i.type === 'extra')
      const extraNumber = extra.length
      const extraWeight = extra.reduce((t, i) => t + i.weight, 0)

      t.push({ token: process.library[0][i[0].token], baseMaxNumber, baseMaxWeight, extraNumber, extraWeight })
    }

    return t
  }, [])

  var maxWeight = process.searchResult.reduce((t, i) => Math.max(t, i.baseMaxWeight), 0)
  var allWeight = process.searchResult.reduce((t, i) => t + i.baseMaxWeight, 0)
  var allNumber = process.searchResult.length
  var averageWeight = allWeight / allNumber
  var divideWeight = allWeight / 8

  process.searchResult = process.searchResult.map(i => {
    i.weight = i.baseMaxWeight
    if (i.baseMaxNumber > 1) i.weight = i.weight + Math.pow(4, i.baseMaxNumber - 1) * i.baseMaxWeight
    if (i.baseMaxNumber > 1) i.weight = i.weight + Math.pow(4, i.baseMaxNumber - 1) * divideWeight
    i.weight = i.weight + i.weight * i.extraWeight / (i.extraWeight + i.weight)
    return i
  })

  process.searchResult = process.searchResult.map(i => {
    if (i.token.match(/[！？。，]/)) {
      const index = searchTokenReverse.findIndex(i => i.match(/[！？。，]/))
      if (index > -1 && index < process.setting.punctuationSpace) i.weight = Math.pow(i.weight, 1 / 4)
    }

    const checkList = [[/^“$/, /^”$/], [/^<$/, /^>$/], [/^（$/, /^）$/], [/^《$/, /^》$/]]

    checkList.forEach(i_ => {
      const index = searchTokenReverse.findIndex(i => i.match(i_[0]))
      const index_ = searchTokenReverse.findIndex(i => i.match(i_[1]))

      if (i.token.match(i_[0]) !== null) {
        if (index !== -1 && index_ === -1) i.weight = i.weight * Math.pow(1 / allWeight, 2)
        if (index !== -1 && index_ !== -1 && index < index_) i.weight = i.weight * Math.pow(1 / allWeight, 2)
      }

      if (i.token.match(i_[1]) !== null) {
        if (index === -1 && index_ === -1) i.weight = i.weight * Math.pow(1 / allWeight, 2)
        if (index === -1 && index_ !== -1) i.weight = i.weight * Math.pow(1 / allWeight, 2)
        if (index !== -1 && index_ !== -1 && index > index_) i.weight = i.weight * Math.pow(1 / allWeight, 2)
        if (index !== -1 && index_ !== -1 && index < index_) i.weight = i.weight * Math.pow(allWeight, 2)
        if (index !== -1 && index_ === -1) i.weight = i.weight * Math.pow(allWeight, 2)
      }
    })

    return i
  })

  process.searchResult = process.searchResult.length === 0 ? [{ token: process.library[0][0], weight: 1 }] : process.searchResult
}

const match = (process) => {
  var toTop = process.setting.toTop + (1 - process.setting.toTop) * (process.cacheRepeat.index / process.setting.repeatMaxTime)
  var temperature = process.setting.temperature + (0 - process.setting.temperature) * (process.cacheRepeat.index / process.setting.repeatMaxTime)

  const weightMiddle = process.searchResult.reduce((t, i) => t + i.weight, 0) / process.searchResult.length

  process.searchResult = process.searchResult.map(i => { i.weight = weightMiddle + (i.weight - weightMiddle) * temperature; return i })

  var allWeight = process.searchResult.reduce((t, i) => t + i.weight, 0)

  process.searchResult = process.searchResult.sort((a, b) => b.weight - a.weight)
  process.searchResult = process.searchResult.map((i, index) => { i.percent = i.weight / allWeight; i.percentAccumulation = index === 0 ? i.percent : i.percent + process.searchResult[index - 1].percentAccumulation; return i })
  process.searchResult = process.searchResult.filter(i => i.percentAccumulation - i.percent <= toTop)

  var allWeight = process.searchResult.reduce((t, i) => t + i.weight, 0)

  process.searchResult = process.searchResult.sort((a, b) => b.weight - a.weight)
  process.searchResult = process.searchResult.map((i, index) => { i.percent = i.weight / allWeight; i.percentAccumulation = index === 0 ? i.percent : i.percent + process.searchResult[index - 1].percentAccumulation; return i })

  const random = Math.random()

  process.matchResult = process.searchResult.reduce((t, i) => t === null && random < i.percentAccumulation ? i.token : t, null)
}

const repeat = (process) => {
  if (process.setting.repeatLength === 0 || process.setting.repeatDistance === 0 || process.result.length < process.setting.repeatLength) return

  const allToken = [...process.token, ...process.result]

  const origin = process.result.slice(process.result.length - process.setting.repeatLength, process.result.length)
  const target = allToken.slice(Math.max(allToken.length - process.setting.repeatLength - process.setting.repeatDistance, 0), allToken.length - process.setting.repeatLength)

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
