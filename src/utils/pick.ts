/**
 * Create an object composed of the picked object properties
 * @param object
 * @param keys
 * @returns {Object}
 */
const pick = (object: object, keys: []) => {
	return keys.reduce((obj, key) => {
		if (object && Object.prototype.hasOwnProperty.call(object, key)) {
			obj[key] = object[key];
		}
		return obj;
	}, {});
};

export default pick;
