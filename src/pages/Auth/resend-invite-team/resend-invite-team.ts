import { notifications } from "$lib/components/toast-notification/ToastNotification";
import { resendInviteTeam } from "$lib/services/auth.service";
export const handleResendInviteTeam = async (
  teamId: string, inviteId: string
) => {
  const response = await resendInviteTeam(teamId, inviteId);
  if (response.isSuccessful) {
    notifications.success("Invite Resend successfully");
    return response;
  } else {
    notifications.error("Failed to Resend invite");
  }
};