import { registerUser } from '$lib/services/auth.service';
import type { registerUserPostBody } from '$lib/utils/dto';
import { checkValidation, registrationSchema } from '$lib/utils/validation';
import { navigate } from 'svelte-navigator';

export const handleRegister = async (userData) => {
	const response = await registerUser({
		email: userData.email, 
		name: userData.firstName + " " + userData.lastName, 
		password: userData.password
	});
	return response;
};

export const handleRegisterValidation = async (userData) => {
	const { isError, errorObject } = await checkValidation(registrationSchema, userData);
	if (isError) {
		return errorObject;
	}
	return;
};
