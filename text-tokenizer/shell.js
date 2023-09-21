const DictChinese = require('./Dict.Chinese.json')
const DictEnglish = require('./Dict.English.json')
const DictSP = require('./Dict.SP.json')

const Dict = [DictChinese]

const DictObject = {}

Dict.forEach(dict => {
  dict.forEach(i => {
    var useObject = DictObject

    i.split('').forEach((i_, index_) => {
      useObject[i_] = useObject[i_] ? useObject[i_] : {}
      useObject[i_]['_use'] = useObject[i_]['_use'] ? useObject[i_]['_use'] : index_ === i.length - 1
      useObject = useObject[i_]
    })
  })
})

const fs = require('fs')
const path = require('path')

fs.writeFileSync(path.resolve(__dirname, './Dict.Object.json'), JSON.stringify(DictObject))