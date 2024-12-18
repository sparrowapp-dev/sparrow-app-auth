import { verifyMagicCode } from '$lib/services/auth.service';
import { errorMessageTextMagicCode } from '$lib/store/auth.store';
import type { verifyMagicCodePostBody } from '$lib/utils/dto';
import { writable } from 'svelte/store';

export const isSuccessfulResponseMagicCode = writable(false);   

export const handleVerifyUserEmail = async (verifyCodeCredential: verifyMagicCodePostBody) => {
 
	const response = await verifyMagicCode(verifyCodeCredential); 
	if (response.isSuccessful) {   
		errorMessageTextMagicCode.set("");
		isSuccessfulResponseMagicCode.set(false); // Ensure this is set to false on success
	} else { 
		isSuccessfulResponseMagicCode.set(true);
		if (response.message === 'magicCode should not be empty' || response.message === "magicCode must be longer than or equal to 6 characters") {
			errorMessageTextMagicCode.set('Please enter the 6-digit verification code.');
		}

		if (response.message === 'Wrong Code') {
			errorMessageTextMagicCode.set('Please check the code again');
		}
	}
	return response;
};
