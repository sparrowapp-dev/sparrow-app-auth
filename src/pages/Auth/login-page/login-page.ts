import { loginUser } from "$lib/services/auth.service";
import type { loginUserPostBody } from '$lib/utils/dto';
import { checkValidation, loginSchema } from '$lib/utils/validation';
import { navigate } from 'svelte-navigator';

//------------------------------Navigation-------------------------------//
export const navigateToRegister = () => {
	navigate('/register');
};

//---------------- Handle Login ------------------//
const handleLogin = async (loginCredentials: loginUserPostBody) => {
	const response = await loginUser(loginCredentials);
	console.log(response);
	// if (response.isSuccessful) {
	// 	setAuthJwt(constants.AUTH_TOKEN, response?.data?.data?.accessToken.token);
	// 	setAuthJwt(constants.REF_TOKEN, response?.data?.data?.refreshToken.token);
	// 	setUser(jwtDecode(response.data?.data?.accessToken?.token));
	// 	navigate('/dashboard/collections');
	// 	_activeSidebarTabViewModel.addActiveTab('collections');
	// 	return response;
	// } else {
	// 	navigate('/');
	// 	isResponseError.set(true);
	// 	throw 'error login user: ' + response.message;
	// }
};

//------------------------- Handle Login Validation -----------------//
export const handleLoginValidation = async (
  loginCredentials: loginUserPostBody,
) => {
  const { isError, errorObject } = await checkValidation(
    loginSchema,
    loginCredentials,
  );
  if (isError) {
    return errorObject;
  }

  return handleLogin(loginCredentials);
};
