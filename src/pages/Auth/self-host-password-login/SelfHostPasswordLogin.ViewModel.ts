import { getSelfHostUser, getUser } from '$lib/services/auth.service';
import { checkValidation, entrySchema } from '$lib/utils/validation';

//---------------- Handle Login ------------------//
export const handleEntry = async (entryCredentials) => {
	const baseUrl = sessionStorage.getItem('selfhost-backendurl') || '';
	if (!baseUrl) {
		return { isSuccessful: false, message: 'Hub URL not found. Please try again.' };
	}
	return await getSelfHostUser(baseUrl, entryCredentials.email);
};

//------------------------- Handle Login Validation -----------------//
export const handleEntryValidation = async (entryCredentials) => {
	const { errorObject: response } = await checkValidation(entrySchema, entryCredentials);
	return response;
};
