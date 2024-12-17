import { getUser } from '$lib/services/auth.service';
import { checkValidation, entrySchema } from '$lib/utils/validation';

//---------------- Handle Login ------------------//
export const handleEntry = async (entryCredentials) => {
	return  await getUser(entryCredentials.email);
};

//------------------------- Handle Login Validation -----------------//
export const handleEntryValidation = async (entryCredentials) => {
	const { errorObject : response } = await checkValidation(entrySchema, entryCredentials);
    return response;
};
