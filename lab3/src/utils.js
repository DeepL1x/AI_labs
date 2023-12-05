import lodash from "lodash"

const transposeArray = (arr) => {
  const result = new Array(arr.length).fill().map(() => new Array(1).fill(0))
  for (let i = 0; i < arr.length; i++) {
    result[i][0] = arr[i]
  }
  return result
}

const train = (patterns) => {
  let weights = []
  for (let pattern of patterns) {
    const transposed = transposeArray(pattern)
    const multiplied = multiplyMatrices(transposed, [pattern])
    if (weights.length === 0) {
      weights = multiplied
    } else {
      weights = sumUpMatrices(weights, multiplied)
    }
  }
  for (let i = 0; i < weights.length; i++) {
    for (let j = 0; j < weights[i].length; j++) {
      weights[i][j] = weights[i][j] / weights[i].length
    }
  }
  return weights
}

const multiplyMatrices = (mtx1, mtx2) => {
  const result = new Array(mtx1.length)
    .fill()
    .map(() => new Array(mtx2[0].length))
  for (let i = 0; i < mtx1.length; ++i) {
    for (let j = 0; j < mtx2[0].length; ++j) {
      result[i][j] = 0
      for (let k = 0; k < mtx2.length; ++k) {
        result[i][j] += mtx1[i][k] * mtx2[k][j]
      }
    }
  }
  return result
}

const sumUpMatrices = (mtx1, mtx2) => {
  if (mtx1.length !== mtx2.length || mtx1[0].length !== mtx2[0].length) {
    throw new Error("Matrices must have the same dimensions")
  }

  const result = new Array(mtx1.length)
    .fill()
    .map(() => new Array(mtx1[0].length))

  for (let i = 0; i < mtx2.length; i++) {
    for (let j = 0; j < mtx2[0].length; j++) {
      result[i][j] = mtx1[i][j] + mtx2[i][j]
    }
  }
  return result
}

const activate = (data, patterns, weights) => {
  let result = transposeArray(data)
  let iterations = 0
  do {
    result = lodash
      .flatMap(multiplyMatrices(weights, result))
      .map((val) => Math.sign(val))
    iterations++
  } while (!findCoincidence(result, patterns) && iterations < 10)
  return result
}

const findCoincidence = (data, patterns) => {
  for (const pattern of patterns) {
    if (lodash.isEqual(data, pattern)) {
      return true
    }
  }
  return false
}
export { train, activate }
