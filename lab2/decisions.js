function filterParams(params) {
  let param_keys = Object.keys(params)
  let param_vals = Object.values(params)
  if (
    param_keys.includes("carry-ability") &&
    params["carry-ability"] === "true"
  ) {
    param_vals = param_vals.filter(
      (_, index) => index !== param_keys.indexOf("path-lb")
    )
    param_keys = param_keys.filter((key) => key !== "path-lb")
    param_vals = param_vals.filter(
      (_, index) => index !== param_keys.indexOf("physics")
    )
    param_keys = param_keys.filter((key) => key !== "physics")
    param_vals = param_vals.filter(
      (_, index) => index !== param_keys.indexOf("terrain-type")
    )
    param_keys = param_keys.filter((key) => key !== "terrain-type")
  }
  params = Object.fromEntries(
    param_keys.map((key, index) => [key, param_vals[index]])
  )
  return params
}

function decide(params, vals, keys) {
  const param_keys = Object.keys(params)
  const param_vals = Object.values(params)
  const param_len = param_keys.length
  const candidates = []
  console.log(params)
  for (const val of vals) {
    const candidate = { value: val[0], possibility: 0 }
    const val_len = Object.keys(val).length - 1
    const divider = val_len < param_len ? val_len : param_len
    for (let i = 0; i < param_len; i++) {
      const index = keys.indexOf(param_keys[i])
      if (index > -1) {
        if (isNaN(Number(val[index])) && val[index].includes(param_vals[i])) {
          candidate.possibility += 1 / divider
        } else {
          if (
            param_keys[i] === "budget-lb" &&
            Number(param_vals[i]) >= val[index]
          ) {
            candidate.possibility += 1 / divider
          }
          if (
            param_keys[i] === "psg-amount" &&
            val[index] >= Number(param_vals[i])
          ) {
            candidate["psg-amount"] = val[index]
            candidate.possibility += 1 / divider
          }
          if (
            param_keys[i] === "path-lb" &&
            val[index] <= Number(param_vals[i])
          ) {
            candidate.possibility += 1 / divider
          }
        }
      }
    }
    candidates.push(candidate)
  }
  return candidates
    .filter((val) => val.possibility > 0)
    .sort(candidatesSortCriteria)
}

function candidatesSortCriteria(a, b) {
  if (b.possibility === a.possibility) {
    return a["psg-amount"] - b["psg-amount"]
  }
  return b.possibility - a.possibility
}
