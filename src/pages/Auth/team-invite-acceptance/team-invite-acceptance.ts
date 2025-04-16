import { notifications } from "$lib/components/toast-notification/ToastNotification";
import { acceptTeamInvite } from "$lib/services/auth.service";
import { navigate } from "svelte-navigator";
export const handleAcceptTeamInvite = async (
  teamId: string, inviteId: string, email: string
) => {
  const response = await acceptTeamInvite(teamId, email);
  if (response.isSuccessful) {
    // Redirect to the sparrow app
    //  window.location.href = 'sparrow://';
  } else {
    //  window.location.href = 'sparrow://';
    notifications.error(response?.message || "Failed to accept invitation");
  }
};
