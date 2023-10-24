let cols
const vals = []
const rDiv = document.querySelector("#results")

function handleFileSelect(event) {
  const file = event.target.files[0]

  if (file) {
    const reader = new FileReader()
    reader.onload = function (e) {
      const csvData = e.target.result
      processData(csvData)
    }
    reader.readAsText(file)
  }
}

function processData(data) {
  const lines = data.split("\n")
  cols = lines[0].trim().split(",")

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()

    if (line) {
      const row = line.split(",")
      vals.push(row)
    }
  }
}

function handleSubmit(event) {
  event.preventDefault()
  rDiv.innerHTML = "Results: <br/>"
  const form = document.getElementById("myForm")
  const formData = new FormData(form)
  let params = {}
  for (const [key, value] of formData.entries()) {
    if (value) {
      params[key] = value
    }
  }
  params = filterParams(params)
  const res = decide(params, vals, cols).slice(0,3)
  res.forEach((item) => rDiv.innerHTML += `${item.value} (${item.possibility})` + "<br/>")
}

function handleClear() {
  const radios = document.querySelectorAll("input[type=radio]")
  const nums = document.querySelectorAll("input[type=number]")
  radios.forEach((radio) => (radio.checked = false))
  nums.forEach((num) => (num.value = ""))
}
