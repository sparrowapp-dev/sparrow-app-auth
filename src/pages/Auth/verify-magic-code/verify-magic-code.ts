import { verifyMagicCode } from '$lib/services/auth.service';
import { errorMessageText } from '$lib/store/auth.store';
import type { verifyMagicCodePostBody } from '$lib/utils/dto';
import { writable } from 'svelte/store';

export const isSuccessfulResponse = writable(false);

export const handleVerifyUserEmail = async (verifyCodeCredential: verifyMagicCodePostBody) => {
	const response = await verifyMagicCode(verifyCodeCredential);
	console.log('Verification response:', response); // Add logging for debugging
	if (response.isSuccessful) {  
		errorMessageText.set("");
		isSuccessfulResponse.set(false); // Ensure this is set to false on success
	} else { 
		isSuccessfulResponse.set(true);
		if (response.message === 'magicCode should not be empty' || response.message === "magicCode must be longer than or equal to 6 characters") {
			errorMessageText.set('Please enter the 6-digit verification code.');
		}

		if (response.message === 'Wrong Code') {
			errorMessageText.set('Wrong verification code');
		}
	}
	return response;
};
