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

const safeNumber = (n, l) => Number(Number(n).toFixed(l))

const tokenFormat = (token, action) => {
  if (!token) return []

  var r = []

  if (action === 1) {
    token.forEach((i, index) => {
      if (token[index] === ' ' && token[index - 1] && token[index + 1] && token[index - 1].match(/^[a-z|A-Z|'|,|\.]+$/) && token[index + 1].match(/^[a-z|A-Z|'|,|\.]+$/)) return
      r.push(token[index])
    })

    return r
  }

  if (action === 2) {
    token.forEach((i, index) => {
      r.push(token[index])
      if (token[index].match(/^[a-z|A-Z|'|,|\.]+$/) && token[index + 1] && token[index + 1].match(/^[a-z|A-Z|'|,|\.]+$/)) r.push(' ')
      if (token[index] === '.' && token[index + 1] && token[index + 1].match(/^[a-z|A-Z|'|,|\.]+$/)) r.push(' ')
      if (token[index] === ',' && token[index + 1] && token[index + 1].match(/^[a-z|A-Z|'|,|\.]+$/)) r.push(' ')
    })

    return r
  }
}

const requestRender = () => {
  if (window.requestIdleCallback) return window.requestIdleCallback

  if (window.requestAnimationFrame) return window.requestAnimationFrame

  return (callback) => setTimeout(() => callback, 35);
}

export { baseIp, hash, safeNumber, tokenFormat, requestRender }
