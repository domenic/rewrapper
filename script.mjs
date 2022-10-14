import rewrap from "./rewrapper.mjs";

const input = document.querySelector("#text-to-rewrap");
const output = document.querySelector("#result");
const columnLength = document.querySelector("#column-length");

input.addEventListener("input", updateOutput);
columnLength.addEventListener("input", updateOutput);

// To catch reloads if the algorithm has changed during development:
updateOutput();

function updateOutput() {
  output.value = rewrap(input.value, columnLength.valueAsNumber);
}
