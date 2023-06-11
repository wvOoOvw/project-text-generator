function calculateSimilarity(str1, str2) {
  const m = str1.length;
  const n = str2.length;

  if (m === 0 && n === 0) return 1;
  if (m === 0) return 0;
  if (n === 0) return 0;

  const d = [];
  for (let i = 0; i <= m; i++) d[i] = [i];
  for (let j = 0; j <= n; j++) d[0][j] = j;

  for (let j = 1; j <= n; j++) {
    for (let i = 1; i <= m; i++) {
      if (str1[i - 1] === str2[j - 1]) d[i][j] = d[i - 1][j - 1];
      if (str1[i - 1] !== str2[j - 1]) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + 1);
    }
  }

  return 1 - d[m][n] / Math.max(m, n);
}

const search = (process) => {
  process.searchResult = []

  const memoryLength = process.setting.memoryContextLength

  const searchTokenReverse = [...process.token, ...process.result].reverse()
  const searchTokenIndex = [...process.token, ...process.result].map(i => process.library[0].indexOf(i))

  const searchIndex = searchTokenIndex.length - 1
  const searchLastToken = searchTokenIndex[searchIndex]

  if (process.library[3][searchLastToken] === undefined) return

  process.searchResult = process.library[3][searchLastToken].reduce((t, i) => {
    const paragraph = process.library[2][i[0]]
    const paragraphIndex = i[1]
    const paragraphWeight = 1
    const paragraphResult = paragraph[paragraphIndex + 1]
    const paragraphAbove = paragraph.slice(0, paragraphIndex + 1)

    if (paragraphResult === undefined) return t

    var length = 1

    while (length) {
      if (length > memoryLength) break
      if (length === memoryLength) break
      if (paragraph[paragraphIndex - length] === undefined) break
      if (searchTokenIndex[searchIndex - length] === undefined) break
      if (paragraph[paragraphIndex - length] !== searchTokenIndex[searchIndex - length]) break
      length = length + 1
    }

    // const similarityLength = Math.min(searchTokenIndex.length, paragraphAbove.length, 32)

    // const calculateSimilarityParmas = [
    //   searchTokenIndex.slice(searchTokenIndex.length - similarityLength, Math.max(searchTokenIndex.length - length, 0)),
    //   paragraphAbove.slice(paragraphAbove.length - similarityLength, Math.max(paragraphAbove.length - length, 0))
    // ]

    // const similarity = calculateSimilarity(...calculateSimilarityParmas)

    const similarity = 1

    t.push({ token: paragraphResult, weight: paragraphWeight, length: length, similarity: similarity })

    return t
  }, [])

  process.searchResult = process.searchResult.reduce((t, i) => {
    const find = t.find(i_ => i_[0].token === i.token)

    if (find === undefined) t.push([i])
    if (find !== undefined) find.push(i)

    return t
  }, [])

  process.searchResult = process.searchResult.reduce((t, i) => {
    const token = process.library[0][i[0].token]
    const weight = i.reduce((t, i) => t + i.weight * i.length * i.similarity, 0)

    t.push({ token: token, weight: weight })

    return t
  }, [])

  process.searchResult = process.searchResult.map(i => {
    if (i.token.match(/[！？。，]/)) {
      const index = searchTokenReverse.findIndex(i => i.match(/[！？。，]/))
      if (index > -1 && index < process.setting.punctuationSpace) i.weight = i.weight / 4
    }

    const checkList = [[/^‘$/, /^’$/], [/^“$/, /^”$/], [/^<$/, /^>$/], [/^（$/, /^）$/], [/^《$/, /^》$/]]

    checkList.forEach(i_ => {
      const index = searchTokenReverse.findIndex(i => i.match(i_[0]))
      const index_ = searchTokenReverse.findIndex(i => i.match(i_[1]))

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
  var toTop = process.setting.toTop + (1 - process.setting.toTop) * (process.cacheRepeat.index / 4)
  var temperature = process.setting.temperature + (0 - process.setting.temperature) * (process.cacheRepeat.index / 4)

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

  process.matchResult = process.searchResult.reduce((t, i) => t === '' && random < i.percentAccumulation ? i.token : t, '')
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

    if (process.matchResult !== '') process.result.push(process.matchResult)
    if (process.matchResult === '') process.next = undefined
    if (process.cacheRepeat.index > 4) process.next = undefined
    if (process.setting.stopToken && process.setting.stopToken.includes(process.matchResult)) process.next = undefined
    if (process.result.length === process.setting.createTokenLength) process.next = undefined

    return process
  }

  return process
}

module.exports.generator = generator
