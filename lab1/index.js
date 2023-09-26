const generateCities = (amount) => {
  const cities = []
  while (amount > 0) {
    let x = (Math.random() * 1024).toFixed(2)
    let y = (Math.random() * 1024).toFixed(2)
    cities.push({ x: x, y: y, cityNumber: amount })
    amount--
  }
  return cities
}

const measureDistance = (city1, city2) => {
  return Math.sqrt(
    Math.pow(city2.x - city1.x, 2) + Math.pow(city2.y - city1.y, 2)
  )
}

const calcPathLen = (cities) => {
  let distance = 0
  for (let i = 1; i < cities.length; i++) {
    distance += measureDistance(cities[i], cities[i - 1])
  }
  distance += measureDistance(cities[0], cities[cities.length - 1])
  return distance
}

const generatePath = (citiesArr) => {
  let path = { cities: [], distance: 0 }
  let cities = [...citiesArr]
  while (cities.length > 0) {
    let index = Math.floor(Math.random() * (cities.length - 1))
    if (!path.cities.includes(cities[index]) || cities[index] !== undefined) {
      path.cities.push(cities[index])
      cities.splice(index, 1)
    }
  }

  path.distance = calcPathLen(path.cities)

  return path
}

const generatePaths = (cities) => {
  let paths = []

  for (let i = 0; i < 30; i++) {
    let decision = generatePath(cities)
    paths.push(decision)
  }
  return paths
}

const sortByDistance = (x, y) => {
  if (x.distance > y.distance) return 1
  if (x.distance < y.distance) return -1
  else return 0
}

const selectParents = (paths) => {
  let parents = []
  const sortedPaths = paths.toSorted(sortByDistance)
  const fpIndex = Math.floor(Math.random() * (paths.length - 1))
  parents.push(sortedPaths[fpIndex])
  if (sortedPaths[fpIndex + 1] === undefined) {
    parents.push(sortedPaths[fpIndex - 1])
    paths.splice(
      paths.findIndex((el) => el === sortedPaths[fpIndex - 1]),
      1
    )
  } else if (fpIndex === 0) {
    parents.push(sortedPaths[fpIndex + 1])
    paths.splice(
      paths.findIndex((el) => el === sortedPaths[fpIndex + 1]),
      1
    )
  } else if (
    Math.abs(
      sortedPaths[fpIndex].distance - sortedPaths[fpIndex + 1].distance
    ) <
    Math.abs(sortedPaths[fpIndex].distance - sortedPaths[fpIndex - 1].distance)
  ) {
    parents.push(sortedPaths[fpIndex + 1])
    paths.splice(
      paths.findIndex((el) => el === sortedPaths[fpIndex + 1]),
      1
    )
  } else {
    parents.push(sortedPaths[fpIndex - 1])
    paths.splice(
      paths.findIndex((el) => el === sortedPaths[fpIndex - 1]),
      1
    )
  }

  paths.splice(
    paths.findIndex((el) => el === sortedPaths[fpIndex]),
    1
  )

  return parents
}

const twoPointCrossover = (parent1, parent2) => {
  const numCities = parent1.cities.length
  const child1 = new Array(numCities).fill(-1)
  const child2 = new Array(numCities).fill(-1)

  let point1 = Math.floor(Math.random() * (numCities - 3) + 1)
  let point2 = Math.floor(Math.random() * (numCities - 3) + 1)

  while (point1 === point2) {
    point2 = Math.floor(Math.random() * numCities + 1)
  }

  if (point1 > point2) {
    ;[point1, point2] = [point2, point1]
  }

  for (let i = point1; i <= point2; i++) {
    child1[i] = parent1.cities[i]
    child2[i] = parent2.cities[i]
  }

  for (let i = 0; i < numCities; i++) {
    if (i < point1 || point2 < i) {
      if (!child1.includes(parent1.cities[i])) {
        child1[i] = parent1.cities[i]
      } else if (!child1.includes(parent2.cities[i])) {
        child1[i] = parent2.cities[i]
      }
      if (!child2.includes(parent2.cities[i])) {
        child2[i] = parent2.cities[i]
      } else if (!child2.includes(parent1.cities[i])) {
        child2[i] = parent1.cities[i]
      }
    }
  }

  for (let i = 0; i < numCities; i++) {
    if (child1[i] === -1) {
      for (let j = 0; j < numCities; j++) {
        if (!child1.includes(parent1.cities[j])) {
          child1[i] = parent1.cities[j]
        }
      }
    }
    if (child2[i] === -1) {
      for (let j = 0; j < numCities; j++) {
        if (!child2.includes(parent2.cities[j])) {
          child2[i] = parent2.cities[j]
        }
      }
    }
  }
  return [
    { cities: child1, distance: calcPathLen(child1) },
    { cities: child2, distance: calcPathLen(child2) },
  ]
}

const mutate = (cities, mutationPercent) => {
  const randomNumber = Math.floor(Math.random() * 101)
  if (randomNumber < mutationPercent) {
    let randomIndex1 = Math.floor(Math.random() * (cities.length - 2) + 1)
    let randomIndex2 = Math.floor(Math.random() * (cities.length - 2) + 1)
    let el1 = cities[randomIndex1]
    let el2 = cities[randomIndex2]
    cities[randomIndex2] = el1
    cities[randomIndex1] = el2
  }
}

const createNewGeneration = (paths, mutationPercent) => {
  let newGeneration = []
  while (paths.length > 0) {
    let parents = selectParents(paths)
    let children = twoPointCrossover(...parents)
    newGeneration = [...newGeneration, ...children]
  }
  newGeneration.forEach((child) => {
    mutate(child.cities, mutationPercent)
    child.distance = calcPathLen(child.cities)
  })
  return newGeneration
}

const prompt = require("prompt-sync")({ sigint: true })

const main = () => {
  let citiesAmount
  do {
    citiesAmount = prompt("Enter cities amount:")
  } while (Number.isNaN(citiesAmount))

  let iterations
  do {
    iterations = prompt("Enter iterations amount:")
  } while (Number.isNaN(iterations))

  let mutationPercent
  do {
    mutationPercent = prompt("Enter mutation percent:")
  } while (Number.isNaN(mutationPercent))

  const cities = generateCities(citiesAmount)
  let paths = generatePaths(cities)
  const bestPaths = []
  for (let i = 0; i < iterations; i++) {
    paths = createNewGeneration(paths, mutationPercent)
    const sortedPaths = paths.toSorted(sortByDistance)
    console.log(
      `Gen ${i + 1} the shortest path: `,
      sortedPaths[0].cities.map((city) => city.cityNumber),
      ", with distance: ",
      sortedPaths[0].distance
    )
    bestPaths.push(sortedPaths[0])
  }

  console.log(
    `Yet the best path from all generations: ${
      bestPaths.sort(sortByDistance)[0].cities.map((city) => city.cityNumber)
    } with distance of: ${bestPaths[0].distance}`
  )
}

main()
