import Imitation from 'imitation-imm/src/index'

import library from './library.json'

const ImitationINS = new Imitation()

ImitationINS.state = {
  loading: 0,

  message: '',

  playgroundView: 'default',

  library: library,
}

export default ImitationINS