import { loginUser } from '$lib/services/auth.service';
import type { loginUserPostBody } from '$lib/utils/dto';
import { checkValidation, loginSchema } from '$lib/utils/validation';
import { navigate } from 'svelte-navigator';

//------------------------------Navigation-------------------------------//
export const navigateToRegister = () => {
	navigate('/register');
};

//---------------- Handle Login ------------------//
export const handleLogin = async (loginCredentials: loginUserPostBody) => {
	const response = await loginUser(loginCredentials);
	if (response.isSuccessful) {
		// const accessToken = response?.data?.data?.accessToken.token;
		// const refreshToken = response?.data?.data?.refreshToken.token;
		// navigate('/success');
		// navigate(
		// 	`sparrow://?accessToken=${accessToken}&refreshToken=${refreshToken}&response=${JSON.stringify(response)}`
		// );
		return response.data.data;
	} else {
		return;
		// navigate('/');
		// throw 'error login user: ' + response.message;
	}
	return;
};

//------------------------- Handle Login Validation -----------------//
export const handleLoginValidation = async (loginCredentials: loginUserPostBody) => {
	const { isError, errorObject } = await checkValidation(loginSchema, loginCredentials);
	if (isError) {
		return errorObject;
	}

	return;
};
