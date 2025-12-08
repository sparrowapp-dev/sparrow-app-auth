import { notifications } from "$lib/components/toast-notification/ToastNotification";
import { acceptTeamInvite } from "$lib/services/auth.service";
import { navigate } from "svelte-navigator";
export const handleAcceptTeamInvite = async (
  teamId: string, inviteId: string, email: string
) => {
  const response = await acceptTeamInvite(teamId, inviteId,email);
  if (response.isSuccessful) {
    notifications.success("Invitation accepted successfully");
    return response;
  } else if(response.message === "User is already a member of the hub"){
    notifications.warning("You are already a member of this hub");
  } else if(response.message === "Plan limit reached."){
    notifications.error("The user limit for the Hub Plan has been reached.");
  } else {
    //  window.location.href = 'sparrow://';
    notifications.error("Failed to accept invitation");
  }
};
