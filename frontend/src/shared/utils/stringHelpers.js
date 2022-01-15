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

export const toTransactionNumber = (s) => {
  const str = s.toString();
  const flag = Number.isNaN(str.charAt(0));
  const prefix = flag ? str.charAt(0) : '';
  const startIdx = flag ? 1 : 0;
  const ss = str.slice(startIdx).split('.');

  ss[0] = ss[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return prefix + ss.join('.');
};
