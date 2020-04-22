/**
 * Maps a value of an attribute to a property value.
 * @param {*} value Some value set by LWC
 * @return {boolean} The value it should return in the first place.
 */
export const booleanProperty = (value) => {
  if (typeof value !== 'boolean') {
    value = ['true', '', true].indexOf(value) !== -1;
  }
  return value;
};
