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

const specialWord = v => {
  if (v === ' ') return '(sapce)'
  if (v === '\n') return '(wrap)'
  return v
}

const parseDirection = v => {
  if (v === 'LR') return ['left', 'right']
  if (v === 'RL') return ['right', 'left']
}

export { baseIp, hash, copy, download, safeNumber, specialWord, parseDirection }
