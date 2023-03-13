function reverseFormatNumber(val, locale) {
  var group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, '');
  var decimal = new Intl.NumberFormat(locale).format(1.1).replace(/1/g, '');
  var reversedVal = val.replace(new RegExp('\\' + group, 'g'), '');
  reversedVal = reversedVal.replace(new RegExp('\\' + decimal, 'g'), '.');
  return Number.isNaN(reversedVal) ? 0 : reversedVal;
}

export const formatNumberComparator = (v1, v2) =>
  reverseFormatNumber(v1, 'en-US') - reverseFormatNumber(v2, 'en-US');
