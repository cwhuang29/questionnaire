export const toCapitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export const snakeCaseToTitleCase = (s) =>
  s
    .split('_')
    .filter((ss) => ss.length)
    .map((sss) => toCapitalize(sss))
    .join('');

export const snakeCaseToCamelCase = (s) => {
  const tmp = snakeCaseToTitleCase(s);
  return `${tmp.charAt(0).toLowerCase()}${tmp.slice(1)}`;
};
