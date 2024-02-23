import { registerUser } from '$lib/services/auth.service';
import type { registerUserPostBody } from '$lib/utils/dto';
import { checkValidation, registrationSchema } from '$lib/utils/validation';
import { navigate } from 'svelte-navigator';

export const handleRegister = async (userData) : boolean => {
	const response = await registerUser({
		email: userData.email, 
		name: userData.firstName + " " + userData.lastName, 
		password: userData.password
	});
	if (response.isSuccessful) {
		// navigate(`sparrow://welcome?response=${JSON.stringify(response)}`);
		return response.data.data;
	} else {
		return false;
		// throw 'error registering user: ' + response.message;
	}
};

export const handleRegisterValidation = async (userData: registerUserPostBody) => {
	const { isError, errorObject } = await checkValidation(registrationSchema, userData);
	if (isError) {
		return errorObject;
	}
	return;
};
