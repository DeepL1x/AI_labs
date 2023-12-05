import "./MatrixCell.css"
const MatrixCell = ({
  checked = -1,
  index = 0,
  setData,
  editMode = false,
  isDisabled = false,
}) => {
  const handleOnClick = () => {
    if (editMode && !isDisabled) {
      setData((prev) => {
        prev[index] = checked === 1 ? -1 : 1
      })
    }
  }
  return (
    <div
      className="matrix-cell"
      style={{ backgroundColor: checked === 1 ? "black" : "white" }}
      onClick={handleOnClick}
    ></div>
  )
}
export default MatrixCell
