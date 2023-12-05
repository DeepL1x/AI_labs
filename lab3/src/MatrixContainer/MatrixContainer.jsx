import "./MatrixContainer.css"
import MatrixCell from "./MatrixCell/MatrixCell"
const MatrixContainer = ({
  data = [],
  setData = () => console.log("No setter assigned"),
  dimension = 5,
  editMode = false,
  title = "",
}) => {
  const cells = data.map((val, index) => (
    <MatrixCell
      key={index}
      checked={val}
      index={index}
      setData={setData}
      editMode={editMode}
    />
  ))
  return (
    <div className="matrix-container">
      {title && <h2>{title}:</h2>}
      <div
        className="matrix"
        style={{
          gridTemplateColumns: `repeat(${dimension}, 1fr)`,
          width: dimension * 50,
          height: dimension * 50,
        }}
      >
        {cells}
      </div>
    </div>
  )
}

export default MatrixContainer
