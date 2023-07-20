import Imitation from 'imitation-imm/src/index'

const ImitationINS = new Imitation()

ImitationINS.state = {
  loading: 0,

  message: '',

  visitorId: '',

  playgroundView: 'Action',

  library: null,
}

export default ImitationINS