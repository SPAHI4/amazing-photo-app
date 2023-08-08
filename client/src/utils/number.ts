// 0.5 -> 1/2
export const convertShutterSpeed = (shutterSpeed: number): string | null => {
  if (shutterSpeed === 0) {
    return null;
  }

  if (shutterSpeed >= 1) {
    return `${Math.round(shutterSpeed)}`;
  }

  const denominator = Math.round(1 / shutterSpeed);

  return `1/${denominator}`;
};
