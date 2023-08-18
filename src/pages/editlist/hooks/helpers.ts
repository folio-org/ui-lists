export const removeSpaces = (object: {[key: string]: boolean | string}) => {
  const result = {} as {[key: string]: boolean | string};

  for (const key in object) {
    // eslint-disable-next-line no-prototype-builtins
    if (object.hasOwnProperty(key)) {
      const value = object[key];
      if (typeof value === 'string') {
        result[key] = value.trim();
      } else {
        result[key] = value;
      }
    }
  }

  return result;
};

export const checkIsStateChanged = (
  originalState: {[key: string]: boolean | string},
  currentState: {[key: string]: boolean | string}
) => {
  return JSON.stringify(removeSpaces(originalState)) !== JSON.stringify(removeSpaces(currentState));
};
