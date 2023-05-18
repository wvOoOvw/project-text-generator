import Imitation from 'imitation-imm/src/index'

const ImitationINS = new Imitation()

ImitationINS.state = {
  loading: 0,

  message: '',

  advence: false,

  playgroundView: 'default',

  library: [[], [], {}],

  trainPrompt: '',
  
  runPrompt: '',
}

export default ImitationINS