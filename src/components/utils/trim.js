export default function trim(str, maxLen = 54) {
  if (str.length > maxLen) {
    return str.substr(0, maxLen) + '...';
  }
  return str;
};
