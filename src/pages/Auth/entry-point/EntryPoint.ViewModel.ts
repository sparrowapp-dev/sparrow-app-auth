import { getConfig, getUser, loginUser } from '$lib/services/auth.service';
import type { loginUserPostBody } from '$lib/utils/dto';
import { checkValidation, entrySchema } from '$lib/utils/validation';
import { navigate } from 'svelte-navigator';

//---------------- Handle Login ------------------//
export const handleEntry = async (entryCredentials) => {
	return await getUser(entryCredentials.email);
};

//------------------------- Handle Login Validation -----------------//
export const handleEntryValidation = async (entryCredentials) => {
	const { errorObject: response } = await checkValidation(entrySchema, entryCredentials);
	return response;
};

// Get Config deatils of backend
export const handleGetConfig = async (hubUrl: string) => {
	hubUrl = hubUrl.trim();

	//if hubUrl end with / then remove it
	if (hubUrl.endsWith('/')) {
		hubUrl = hubUrl.slice(0, -1);
	}
	const response = await getConfig(hubUrl);
	return response;
};
