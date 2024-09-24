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
      if (lastLineIsSmushable && !mustBreakBefore(trimmedLine)) {
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
  line = line.trimLeft();

  const brokenLines = [];
  let currentLine = leadingIndent;
  let spaceBefore = "";
  for (const word of line.split(" ")) {
    if (currentLine.length + spaceBefore.length + word.length <= columnLength) {
      currentLine += spaceBefore + word;
    } else {
      if (currentLine !== leadingIndent)
        brokenLines.push(currentLine);
      currentLine = leadingIndent + word;
    }
    spaceBefore = " ";
  }
  brokenLines.push(currentLine);

  return brokenLines;
}

function shouldRewrap(line) {
  const trimmedLine = line.trim();

  return !/^<(dt|th|td)(?:[a-z- "=]+)?>/.test(trimmedLine);
}

function mustBreakAfter(trimmedLine) {
  return trimmedLine.endsWith("</dt>") || trimmedLine.endsWith("</li>");
}

function mustBreakBefore(trimmedLine) {
  return trimmedLine.startsWith("<td") || trimmedLine.startsWith("<th");
}

function isStandaloneLine(trimmedLine) {
  return trimmedLine.length === 0 ||
         /^<\/?[a-z- "=]+>$/i.test(trimmedLine) ||
         /^<!--.*-->$/.test(trimmedLine);
}

function getLeadingIndent(line) {
  return /^(\s*)/.exec(line)[1];
}
