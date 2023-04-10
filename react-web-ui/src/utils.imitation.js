import Imitation from 'imitation-imm/src/index'

import context from './context.json'
// import context from './context2.json'

const ImitationINS = new Imitation()

ImitationINS.state = {
  loading: 0,

  message: '',

  infromationExpand: true,

  context: context,

  neuronLinkAction: null,

  neuronInformationAction: null,

  neuronMouseEnter: null,

  neuronLinkInformationMouseEnter: null,

  playgroundView: 'train',

  runContext: null,

  runLogMouseEnterArray: []
}

export default ImitationINS