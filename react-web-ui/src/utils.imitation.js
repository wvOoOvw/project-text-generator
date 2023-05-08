import Imitation from 'imitation-imm/src/index'

const ImitationINS = new Imitation()

ImitationINS.state = {
  loading: 0,

  message: '',

  playgroundView: 'default',

  library: null,
  train: '',
  run: '',
}

export default ImitationINS