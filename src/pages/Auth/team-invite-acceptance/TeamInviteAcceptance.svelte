<script lang="ts">
	import { onMount } from 'svelte';
	import { handleAcceptTeamInvite } from './team-invite-acceptance';
	import Redirect from '../redirect/Redirect.svelte';
	import BgContainer from '$lib/components/bgContainer/BgContainer.svelte';
	import sparrowicon from '$lib/assets/logoSparrowSquare.svg';
	import Spinner from '$lib/components/transition/Spinner.svelte';
	import Button from '$lib/components/button/Button.svelte';
	import { notifications } from '$lib/components/toast-notification/ToastNotification';
	import { navigate } from 'svelte-navigator';
	export let teamId;
	export let inviteId;
	export let email;

	onMount(async () => {
		await handleAcceptTeamInvite(teamId, inviteId);
        isSpinner = false;
	});

	 let title = 'Title';
	 let description = 'Description';
	 let message = 'Detailed Message';
	 let isSpinner = true;
	 let buttonText = 'Open Sparrow App';

	 let copyLink = () => {};
	 let loadingMessage = '';
	 let userTeams: TeamDetails[] = [];

     const sparrowRedirect = `sparrow://`;
  

    //  sparrow://?accessToken=${accessToken}&refreshToken=${refreshToken}&response=${JSON.stringify(response)}&event=login&method=email`;
     
     const  buttonClick = () => {
        navigate(sparrowRedirect);
     };

</script>

<div>
	<BgContainer>
		<div class="d-flex align-items-start gap-2">
			<div
				class="text-white d-flex justify-content-center align-items-center bg-sparrowPrimaryColor"
				style="height: 23px; width: 23px; border-radius: 6px;"
			>
				<img height="20px" width="20px" src={sparrowicon} alt="" class="" />
			</div>
			<p style="font-weight:500;">Sparrow</p>
		</div>

		<div class="" style="margin-top:20px ;">
			<p
				class=" container-header sparrow-fw-600 text-whiteColor text-center ms-2 me-2 mb-1"
				style="font-size:24px; font-weight: 400;  line-height:28px; text-align:center; max-width:300px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;"
			>
				Welcome
				<br />
				<span class="sparrow-fs-14" style="font-weight:400; color:#9B9DA1;"
					>To your Sparrow Space</span
				>
			</p>

			<!-- {#if  !isSpinner}
			<div class="mt-3 d-flex justify-content-center align-items-center flex-column">
				<p class="hubspot-help-text">View and manage hubs in the desktop app.</p>
				<ListCard TeamDetails={userTeams} />
			</div>
		{/if} -->

			{#if isSpinner}
				<div
					style="font-size: 14px;text-align:center"
					class="mt-3 text-lightGray d-flex align-items-center justify-content-center mt-4"
				>
					<Spinner size={'40px'} />
				</div>
			{/if}

			<div style="margin-top: 40px;">
				<div
					style="font-size: 14px;text-align:center;"
					class="text-lightGray d-flex align-items-center justify-content-center mt-3"
				>
					<div class="" style="width: 300px;">
						<Button
							title={buttonText}
							disable={isSpinner}
							buttonClassProp={'w-100 align-items-center d-flex justify-content-center sparrow-fs-14'}
							textStyleProp={"font-family: 'Inter', sans-serif; font-weight:500; line-height:143%;"}
							type={'primary'}
							onClick={buttonClick}
						/>
					</div>
				</div>
			</div>

			<div class="sparrow-fw-400" style="margin-top: 6px;">
				<div class="d-flex align-items-center justify-content-center">
					<div
						style="text-align:center; max-width: 400px; color:#9B9DA1; font-family: 'Inter', sans-serif;"
						class="mt-4 sparrow-fw-400 sparrow-fs-12"
					></div>
				</div>
			</div>
		</div>
	</BgContainer>
</div>
