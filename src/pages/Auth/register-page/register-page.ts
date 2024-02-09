import { registerUser } from '$lib/services/auth.service';
import type { registerUserPostBody } from '$lib/utils/dto';
import { checkValidation, registrationSchema } from '$lib/utils/validation';
import { navigate } from 'svelte-navigator';

const handleRegister = async (userData: registerUserPostBody) => {
	const response = await registerUser(userData);
	if (response.isSuccessful) {
		navigate(`sparrow://welcome?response=${JSON.stringify(response)}`);
	} else {
		throw 'error registering user: ' + response.message;
	}
};

export const handleRegisterValidation = async (userData: registerUserPostBody) => {
	const { isError, errorObject } = await checkValidation(registrationSchema, userData);
	if (isError) {
		return errorObject;
	}
	return handleRegister(userData);
};
