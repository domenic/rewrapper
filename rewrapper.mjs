export default function (text, columnLength) {
  const lines = text.split("\n");
  const unwrapped = smooshOverwrappedLines(lines);
  const rewrapped = wrapLines(unwrapped, columnLength);
  return rewrapped.join("\n");
}

function smooshOverwrappedLines(lines) {
  const smooshedLines = [];

  let lastLineIsSmushable = false;
  for (const line of lines) {
    const trimmedLine = line.trim();

    if (isStandaloneLine(trimmedLine)) {
      smooshedLines.push(line);
      lastLineIsSmushable = false;
    } else {
      if (lastLineIsSmushable) {
        smooshedLines[smooshedLines.length - 1] += " " + trimmedLine;
      } else {
        smooshedLines.push(line.trimRight());
      }

      lastLineIsSmushable = !mustBreakAfter(trimmedLine);
    }
  }

  return smooshedLines;
}

function wrapLines(lines, columnLength) {
  const linesRewrapped = [];
  for (const line of lines) {
    if (line.length <= columnLength || !shouldRewrap(line)) {
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

function shouldRewrap(line) {
  const trimmed = line.trim();

  return !/^<dt(?:[a-z- "=]+)?>.*<\/dt>/.test(trimmed);
}

function mustBreakAfter(trimmedLine) {
  return trimmedLine.endsWith("</dt>");
}

function isStandaloneLine(trimmedLine) {
  return /^<\/?[a-z- "=]+>$/i.test(trimmedLine) || trimmedLine.length === 0;
}

function getLeadingIndent(line) {
  return /^(\s*)/.exec(line)[1];
}
