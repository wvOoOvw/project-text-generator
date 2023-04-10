const Segment = require('../segment/index')

const segment = new Segment()

segment.useDefault()


const _generate = (library, prompt, option) => {

}

const _train = (library, prompt, option) => {
  const tokenizer = segment.doSegment(prompt)

  console.log(tokenizer)
}

export { _generate, _train }