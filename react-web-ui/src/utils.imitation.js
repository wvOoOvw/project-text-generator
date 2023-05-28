import Imitation from 'imitation-imm/src/index'

const ImitationINS = new Imitation()

ImitationINS.state = {
  loading: 0,

  message: '',

  visitorId: '',

  advence: false,

  playgroundView: 'Default',

  library: [[], [], {}],

  trainPrompt: '',
  
  generatePrompt: '',
}

export default ImitationINS