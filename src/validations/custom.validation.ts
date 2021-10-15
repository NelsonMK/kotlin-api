export const password = (value: any, helpers: any) => {
	if (value.length < 5) {
		return helpers.message('Password must be at least 5 characters');
	}
	return value;
};
