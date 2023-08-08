import React from 'react';

const newLineRegex = /(\r\n|\r|\n)/g;
const breakLine = /(\r\n|\r|\n)/;

interface Nl2BrProps {
  children: string;
  breakLimit?: number;
}

export function Nl2Br({ children: str, breakLimit = 2 }: Nl2BrProps): React.ReactNode {
  const result = str.split(newLineRegex);
  const output = [];

  let consecutiveBreaks = 0;

  for (let i = 0; i < result.length; i += 1) {
    if (result[i].trim() === '') {
      if (consecutiveBreaks < breakLimit + 1) {
        output.push(result[i]);
        consecutiveBreaks += 1;
      }
    } else {
      consecutiveBreaks = 0;
      output.push(result[i]);
    }
  }

  return output.map((line, index) => {
    if (line.match(breakLine)) {
      // eslint-disable-next-line react/no-array-index-key
      return <br key={index} />;
    }
    return line;
  });
}
