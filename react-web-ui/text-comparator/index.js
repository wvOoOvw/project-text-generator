function cosineSimilarity(vec1, vec2) {
  if (vec1.length !== vec2.length) return 0

  let dotProduct = 0;
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
  }

  const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + Math.pow(val, 2), 0));
  const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + Math.pow(val, 2), 0));

  const similarity = dotProduct / (magnitude1 * magnitude2);

  return similarity;
}

function euclideanDistance(vec1, vec2) {
  if (vec1.length !== vec2.length) return 0

  let sumOfSquares = 0;

  for (let i = 0; i < vec1.length; i++) {
    const diff = vec1[i] - vec2[i];
    sumOfSquares += Math.pow(diff, 2);
  }

  const distance = Math.sqrt(sumOfSquares);

  return 1 / (1 + distance);
}

const comparator = (token, library) => {
  const process = { token: token, step: 0, index: 0, library: library, result: [], next: () => next() }

  const next = () => {

    const functions = [
      () => {
        const currentVectors = process.library[2][process.token]
        const targetVectors = process.library[2][process.index]

        const compareResult = cosineSimilarity(currentVectors, targetVectors) * euclideanDistance(currentVectors, targetVectors)

        process.result.push({ token: process.library[0][process.index], index: process.index, percent: compareResult })

        process.index = process.index + 1

        if (process.library[2][process.index] === undefined) process.step = process.step + 1
      }
    ]

    if (functions[process.step] !== undefined) functions[process.step]()
    if (functions[process.step] === undefined) process.next = undefined

    return process

  }

  return process
}

module.exports.comparator = comparator