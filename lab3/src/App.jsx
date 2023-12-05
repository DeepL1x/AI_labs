import React, { useEffect } from "react"
import { useImmer } from "use-immer"
import "./App.css"
import MatrixContainer from "./MatrixContainer/MatrixContainer"
import { train, activate } from "./utils"

const App = () => {
  const [dimension, setDimension] = useImmer(5)
  const [data, setData] = useImmer(new Array(5 * 5).fill(-1))
  const [weights, setWeights] = useImmer([])
  const [patterns, setPatterns] = useImmer([])
  const [result, setResult] = useImmer(new Array(5 * 5).fill(-1))

  const handleAddToPatterns = () => {
    setPatterns((patterns) => [...patterns, data])
  }

  const handleTrain = () => {
    setWeights(train(patterns))
  }

  const handleFind = async () => {
    setResult(await activate(data, patterns, weights))
  }

  const handleDimensionChange = (e) => {
    setDimension(e.target.value)
  }

  useEffect(() => {
    setData(new Array(dimension * dimension).fill(-1))
    setResult(new Array(dimension * dimension).fill(-1))
    setWeights([])
    setPatterns([])
  }, [dimension])

  return (
    <>
      <h3>Dimension:</h3>
      <input type="number" value={dimension} onChange={handleDimensionChange} />
      <div style={{ display: "flex" }}>
        <MatrixContainer
          data={data}
          setData={setData}
          editMode={true}
          dimension={dimension}
          title="Your pattern"
        />
        <MatrixContainer
          data={result}
          editMode={false}
          dimension={dimension}
          title="Recognized pattern"
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={handleAddToPatterns}>Add to patterns</button>
        <button onClick={handleTrain}>Train</button>
        <button onClick={handleFind}>Find</button>
      </div>
      <h2>Saved patterns:</h2>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {patterns.map((pattern, index) => (
          <MatrixContainer
            data={pattern}
            editMode={false}
            key={index}
            dimension={dimension}
          />
        ))}
      </div>
    </>
  )
}

export default App
