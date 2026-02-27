<script lang="ts">
	import { onMount } from 'svelte';
	import Redirect from '../redirect/Redirect.svelte';
	import BgContainer from '$lib/components/bgContainer/BgContainer.svelte';
	import Spinner from '$lib/components/transition/Spinner.svelte';
	import { notifications } from '$lib/components/toast-notification/ToastNotification';
	import { navigate } from 'svelte-navigator';
	import { acceptInviteAndLogin } from '$lib/services/auth.service';
	export let teamId;
	export let inviteId;
	export let email;

	let isLogin = sessionStorage.getItem('inviteLoginDone') === 'true';

	let redirectRules = {
		title: 'Welcome to Sparrow!',
		description: '',
		message: 'If the application does not open automatically, use the button below.',
		isSpinner: true,
		buttonText: 'Open Desktop App',
		buttonClick: () => {},
		copyLink: () => {},
		loadingMessage: 'Please wait while we sign you in...'
	};

	onMount(async () => {
		if (sessionStorage.getItem('inviteLoginDone') === 'true') {
			isLogin = true;
			redirectRules.isSpinner = false;
			redirectRules.loadingMessage = '';
			return;
		}

		const res = await acceptInviteAndLogin(teamId, inviteId, email);

		if (res?.data?.accessToken?.token) {
			const { accessToken, refreshToken, teamId, teamName, workspaces, role } = res.data;

			const workspaceNames = workspaces?.map((w) => w.name).join(', ') ?? '';
			const deepLink =
				`sparrow://invite-login` +
				`?source=invite` +
				`&accessToken=${accessToken.token}` +
				`&refreshToken=${refreshToken.token}` +
				`&teamId=${teamId}` +
				`&teamName=${encodeURIComponent(teamName)}` +
				`&role=${encodeURIComponent(role)}` +
				`&workspaceNames=${encodeURIComponent(workspaceNames)}`;

			sessionStorage.setItem('inviteLoginDone', 'true');

			isLogin = true;

			let data = JSON.parse(window.atob(accessToken.token.split('.')[1]));
			let firstName = data.name.split(' ')[0];

			redirectRules.title = `Welcome ${firstName}`;

			setTimeout(() => {
				redirectRules.isSpinner = false;
				redirectRules.loadingMessage = '';

				navigate(deepLink);

				redirectRules.buttonClick = () => navigate(deepLink);

				redirectRules.copyLink = () => {
					navigator.clipboard.writeText(deepLink);
					notifications.success('Link copied to clipboard.');
				};
			}, 1000);
		}
	});
</script>

{#if isLogin}
	<Redirect
		title={redirectRules.title}
		description={redirectRules.description}
		message={redirectRules.message}
		isSpinner={redirectRules.isSpinner}
		buttonText={redirectRules.buttonText}
		buttonClick={redirectRules.buttonClick}
		copyLink={redirectRules.copyLink}
		loadingMessage={redirectRules.loadingMessage}
	/>
{:else}
	<BgContainer>
		<Spinner size="40px" />
	</BgContainer>
{/if}
