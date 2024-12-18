const jwtDecode = (
	jwt: string
): {
	email: string;
	name: string;
	_id: string;
} => {
	try {
		return JSON.parse(window.atob(jwt.split('.')[1]));
	} catch (err) {
		return {
			email: '',
			name: '',
			_id: ''
		};
	}
};

export { jwtDecode };
