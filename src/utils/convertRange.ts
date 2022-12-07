export const convertRange = (number: number) => {
  const convert = number.toFixed(1);
  if (convert === '1.0') {
    return '1';
  } else if (convert === '2.0') {
    return '2';
  } else if (convert === '3.0') {
    return '3';
  } else if (convert === '4.0') {
    return '4';
  } else if (convert === '5.0') {
    return '5';
  }
  return convert;
};
