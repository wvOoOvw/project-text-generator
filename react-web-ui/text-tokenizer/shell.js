const fs = require('fs')
const path = require('path')

const removeRepeat = (name) => {
  const origin = JSON.parse(fs.readFileSync(path.resolve(__dirname, './' + name)).toString())
  const result = [...new Set(origin)]
  fs.writeFileSync(fs.readFileSync(path.resolve(__dirname, './' + name), JSON.stringify(result)))
}

const move = () => {
  const in_ = JSON.parse(fs.readFileSync(path.resolve(__dirname, './names.json')).toString())

  const out_ = JSON.parse(fs.readFileSync(path.resolve(__dirname, './Dict.Chinese.json')).toString())

  in_.forEach(i => {
    out_.push(i.split('|')[0])
  })

  fs.writeFileSync(path.resolve(__dirname, './Dict.Chinese.json'), JSON.stringify(out_))
}
