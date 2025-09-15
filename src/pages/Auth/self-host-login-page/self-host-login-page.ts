import { loginUser, selfHostLoginUser } from '$lib/services/auth.service';
import type { loginUserPostBody } from '$lib/utils/dto';
import { checkValidation, loginSchema } from '$lib/utils/validation';
import { navigate } from 'svelte-navigator';

//------------------------------Navigation-------------------------------//
export const navigateToRegister = () => {
	navigate('/register');
};

//---------------- Handle Login ------------------//
export const handleLogin = async (loginCredentials: loginUserPostBody) => {
	const baseUrl = sessionStorage.getItem('selfhost-backendurl') || '';
	if (!baseUrl) {
		return { isSuccessful: false, message: 'Hub URL not found. Please try again.' };
	}
	return await selfHostLoginUser(baseUrl, loginCredentials);
};

//------------------------- Handle Login Validation -----------------//
export const handleLoginValidation = async (loginCredentials: loginUserPostBody) => {
	const { isError, errorObject } = await checkValidation(loginSchema, loginCredentials);
	if (isError) {
		return errorObject;
	}

	return;
};
