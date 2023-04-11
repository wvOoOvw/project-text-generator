import Imitation from 'imitation-imm/src/index'

import context from './context.json'

const ImitationINS = new Imitation()

ImitationINS.state = {
  loading: 0,

  message: '',

  playgroundView: 'train',

  context: context,
}

export default ImitationINS