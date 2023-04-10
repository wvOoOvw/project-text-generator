const fs = require('fs')
const path = require('path')

const dirs = fs.readdirSync(path.resolve(__dirname, './dicts'))

dirs.forEach(i => {
  const item = fs.readFileSync(path.resolve(__dirname, './dicts/' + i)).toString()

  const item_ = item.split('\n').map(i => `"${i}"`).join(',')

  const json = `[${item_}]`

  fs.writeFileSync(path.resolve(__dirname, './dicts/' + i.replace('txt', 'json')), json)
})