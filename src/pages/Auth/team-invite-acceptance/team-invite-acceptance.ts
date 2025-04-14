import { notifications } from "$lib/components/toast-notification/ToastNotification";
import { acceptTeamInvite } from "$lib/services/auth.service";
export const handleAcceptTeamInvite = async (
  teamId: string, inviteId: string, email: string
) => {
  const response = await acceptTeamInvite(teamId, inviteId);
  if (response.isSuccessful) {
		notifications.success(response?.message || "Invitation accepted successfully");
	} else{
    notifications.error(response.message || "Failed to accept invitation");
  }
};
