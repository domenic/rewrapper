const input = document.querySelector("#text-to-rewrap");
const output = document.querySelector("#result");
const columnLength = document.querySelector("#column-length");

input.addEventListener("input", updateOutput);
columnLength.addEventListener("input", updateOutput);

function updateOutput() {
  output.value = rewrap(input.value, columnLength.valueAsNumber);
}

function rewrap(text, columnLength) {
  const lines = text.split("\n");
  const linesSmushed = [];

  let lastLineIsSmushable = false;
  for (const line of lines) {
    if (isOnlyATag(line) || isOnlyWhitespace(line)) {
      linesSmushed.push(line);
      lastLineIsSmushable = false;
    } else {
      if (lastLineIsSmushable) {
        linesSmushed[linesSmushed.length - 1] += " " + line.trim();
      } else {
        linesSmushed.push(line.trimRight());
      }
      lastLineIsSmushable = true;
    }
  }

  const linesRewrapped = [];
  for (const line of linesSmushed) {
    if (line.length <= columnLength) {
      linesRewrapped.push(line);
    } else {
      let leftToRewrap = line.trim();
      const leadingIndent = getLeadingIndent(line);
      const charsPerLine = columnLength - leadingIndent.length;

      while (leftToRewrap.length > columnLength) {
        const spaceToSplitOnIndex = leftToRewrap.lastIndexOf(" ", charsPerLine);
        linesRewrapped.push(leadingIndent + leftToRewrap.substring(0, spaceToSplitOnIndex));
        leftToRewrap = leftToRewrap.substring(spaceToSplitOnIndex + 1);
      }
      linesRewrapped.push(leadingIndent + leftToRewrap);
    }
  }

  return linesRewrapped.join("\n");
}

function isOnlyATag(line) {
  return line.match(/^\s*<\/?[a-z-]+>\s*$/i);
}

function isOnlyWhitespace(line) {
  return line.match(/^\s*$/);
}

function getLeadingIndent(line) {
  return /^(\s*)/.exec(line)[1];
}
