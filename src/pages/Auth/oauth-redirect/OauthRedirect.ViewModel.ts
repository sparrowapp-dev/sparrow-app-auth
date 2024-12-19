import { updateOccaisonalUpdatesStatus } from '$lib/services/auth.service';


export const updateOccaisonalUpdates = async (updatesPayload) => {
	const response = await updateOccaisonalUpdatesStatus(updatesPayload);
    return response;
};
