import Imitation from 'imitation-imm/src/index'

const ImitationINS = new Imitation()

ImitationINS.state = {
  loading: 0,

  message: '',

  visitorId: '',

  advence: false,

  playgroundView: 'Default',

  library: [[], [], [], {}, {}],

  trainPrompt: '中国的发展从古至今已经有六十年多了，一直秉持着社会主义的发展是中国的独有特色。',
  
  generatePrompt: '',
}

export default ImitationINS