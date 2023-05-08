const createBaseIp = () => {
  if (process.env === 'dev') {
    // return 'http://localhost'
    return 'http://192.168.1.10'
    // return 'http://124.223.91.122'
  }
  if (process.env === 'prod' || process.env === 'simple') {
    return window.location.origin
    // return 'http://124.223.91.122'
  }
}

const baseIp = createBaseIp()

const hash = (n = 16, l = 1) => {
  return new Array(l).fill(undefined).map(i => Array.from(Array(n), () => Math.floor(Math.random() * 36).toString(36)).join('')).join('-').toUpperCase()
}

const copy = (data) => {
  const input = document.createElement('input')
  document.body.appendChild(input)
  input.setAttribute('value', data)
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
}

const download = (data, name) => {
  const aLink = document.createElement('a')
  const evt = document.createEvent("MouseEvents")
  evt.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
  aLink.download = name
  aLink.href = data
  aLink.dispatchEvent(evt)
}

const safeNumber = (n, l) => Number(Number(n).toFixed(l))

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

const specialWord = v => {
  if (v === ' ') return '<|Sapce|>'
  if (v === '\n') return '<|Wrap|>'
  return v
}

const parseDirection = v => {
  if (v === 'LR') return ['left', 'right']
  if (v === 'RL') return ['right', 'left']
}

const tokenFormat = (token, action) => {
  if (!token) return []

  var r = []

  if (action === 1) {
    token.forEach((i, index) => {
      if (token[index] === ' ' && token[index - 1] && token[index + 1] && token[index - 1].match(/^[a-z|A-Z|']+$/) && token[index + 1].match(/^[a-z|A-Z|']+$/)) return
      r.push(token[index])
    })

    return r
  }

  if (action === 2) {
    token.forEach((i, index) => {
      r.push(token[index])
      if (token[index].match(/^[a-z|A-Z|']+$/) && token[index + 1] && token[index + 1].match(/^[a-z|A-Z|']+$/)) r.push(' ')
      if (token[index] === '.' && token[index + 1] && token[index + 1].match(/^[a-z|A-Z|']+$/)) r.push(' ')
      if (token[index] === ',' && token[index + 1] && token[index + 1].match(/^[a-z|A-Z|']+$/)) r.push(' ')
    })

    return r
  }
}

export { baseIp, hash, copy, download, safeNumber, arrayRandom, specialWord, parseDirection, tokenFormat }
