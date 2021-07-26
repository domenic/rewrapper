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

function rewrap(text, columnLength) {
  const lines = text.split("\n");
  const unwrapped = unwrapNonStandaloneLines(lines);
  const rewrapped = wrapLines(unwrapped, columnLength);
  return rewrapped.join("\n");
}

function unwrapNonStandaloneLines(lines) {
  const unwrappedLines = [];

  let lastLineIsSmushable = false;
  for (const line of lines) {
    if (shouldStandalone(line)) {
      unwrappedLines.push(line);
      lastLineIsSmushable = false;
    } else {
      if (lastLineIsSmushable) {
        unwrappedLines[unwrappedLines.length - 1] += " " + line.trim();
      } else {
        unwrappedLines.push(line.trimRight());
      }
      lastLineIsSmushable = true;
    }
  }

  return unwrappedLines;
}

function wrapLines(lines, columnLength) {
  const linesRewrapped = [];
  for (const line of lines) {
    if (line.length <= columnLength) {
      linesRewrapped.push(line);
    } else {
      linesRewrapped.push(...wrapLine(line, columnLength));
    }
  }

  return linesRewrapped;
}

function wrapLine(line, columnLength) {
  const leadingIndent = getLeadingIndent(line, columnLength);

  const brokenLines = [];
  let currentLine = "";
  let spaceBefore = "";
  for (const word of line.split(" ")) {
    if (currentLine.length + spaceBefore.length + word.length < columnLength) {
      currentLine += spaceBefore + word;
    } else {
      brokenLines.push(currentLine);
      currentLine = leadingIndent + word;
    }
    spaceBefore = " ";
  }
  brokenLines.push(currentLine);

  return brokenLines;
}

function shouldStandalone(line) {
  const trimmed = line.trim();

  return trimmed.length === 0 || /^<\/?[a-z-]+>$/i.test(trimmed) || /^<!--.*?-->$/i.test(trimmed);
}

function getLeadingIndent(line) {
  return /^(\s*)/.exec(line)[1];
}
