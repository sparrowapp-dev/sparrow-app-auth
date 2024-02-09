import { forgotPassword } from '$lib/services/auth.service';
import type { EmailPostBody } from '$lib/utils/dto';
import { checkValidation, forgotPasswordSchema } from '$lib/utils/validation';
import { navigate } from 'svelte-navigator';

export const handleForgotPassword = async (forgotPasswordCredential: EmailPostBody) => {
	await forgotPassword(forgotPasswordCredential);
	navigate('/update/password');
};

//------------------------- Handle Login Validation -----------------//
export const handleForgotPasswordValidation = async (forgotPasswordCredential: EmailPostBody) => {
	const { isError, errorObject } = await checkValidation(
		forgotPasswordSchema,
		forgotPasswordCredential
	);
	if (isError) {
		return errorObject;
	}
	handleForgotPassword(forgotPasswordCredential);
	return {};
};
