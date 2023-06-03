const fs = require('fs')
const path = require('path')
const xlsx = require('node-xlsx')

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


const readXlsx = () => {
  const workSheetsFromFile = xlsx.parse(path.resolve(__dirname, './unigram_freq.csv'));

  const out_ = workSheetsFromFile[0].data.map(i => i[0])

  fs.writeFileSync(path.resolve(__dirname, './Dict.English.json'), JSON.stringify(out_))
}

const readTxt = () => {
  const txt = fs.readFileSync(path.resolve(__dirname, './cedict_ts.u8')).toString()

  const list_ = []

  txt.split(/\n/).forEach(i => list_.push(i.split(' ')[1]))

  fs.writeFileSync(path.resolve(__dirname, './Dict.Chinese2.json'), JSON.stringify(list_))
}

const compose = () => {
  const a = JSON.parse(fs.readFileSync(path.resolve(__dirname, './Dict.Chinese.json')).toString())
  const b = JSON.parse(fs.readFileSync(path.resolve(__dirname, './Dict.Chinese2.json')).toString())

  const r = [...a, ...b]

  const result = [...new Set(r)]

  fs.writeFileSync(path.resolve(__dirname, './Dict.Chinese3.json'), JSON.stringify(result))
}

const removeSp = () => {
  const a = fs.readFileSync(path.resolve(__dirname, './Dict.Chinese.json')).toString()
  const r = a.replaceAll(`"𣍰",`, '')
  fs.writeFileSync(path.resolve(__dirname, './Dict.Chinese2.json'), r)
}

const computeLength = () => {
  const a = JSON.parse(fs.readFileSync(path.resolve(__dirname, './Dict.Chinese.json')).toString())
  const b = JSON.parse(fs.readFileSync(path.resolve(__dirname, './Dict.Chinese2.json')).toString())

  console.log(a.length, b.length)
}