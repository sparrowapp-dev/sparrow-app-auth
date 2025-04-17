import { notifications } from "$lib/components/toast-notification/ToastNotification";
import { acceptTeamInvite } from "$lib/services/auth.service";
import { navigate } from "svelte-navigator";
export const handleAcceptTeamInvite = async (
  teamId: string, inviteId: string
) => {
  const response = await acceptTeamInvite(teamId, inviteId);
  if (response.isSuccessful) {
    notifications.success("Invitation accepted successfully");
    return response;
  } else {
    //  window.location.href = 'sparrow://';
    notifications.error("Failed to accept invitation");
  }
};
