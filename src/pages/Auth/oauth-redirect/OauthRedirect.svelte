<script lang="ts">
	import { onMount } from 'svelte';
	import { navigate } from 'svelte-navigator';
	import Redirect from '../redirect/Redirect.svelte';
	import constants from '$lib/utils/constants';
	import RegisterRedirectComponent from '../redirect/RegisterRedirectComponent.svelte';
	import { notifications } from '$lib/components/toast-notification/ToastNotification';
	import { AppEdition } from '$lib/utils/enums/enums';

	let redirctSource = localStorage.getItem('source');

	let accessToken = '';
	let refreshToken = '';
	let source = '';
	let showRegisterComponent = true;
	let sparrowRedirect = '';
	let sparrowWebRedirect = '';
	let sparrowAdminRedirect = '';

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		accessToken = urlParams.get('accessToken') as string;
		refreshToken = urlParams.get('refreshToken') as string;
		source = urlParams.get('source') as string;
		sparrowRedirect = `sparrow://?selfHostbackendUrl=${constants.APP_EDITION === AppEdition.SELFHOSTED ? constants.API_URL : ""}&accessToken=${accessToken}&refreshToken=${refreshToken}&event=${source}&method=google`;
		sparrowWebRedirect =
			constants.SPARROW_WEB_URL +
			`?accessToken=${accessToken}&refreshToken=${refreshToken}&event=${source}&method=google`;
		sparrowAdminRedirect =
			constants.SPARROW_ADMIN_URL +
			`?accessToken=${accessToken}&refreshToken=${refreshToken}&event=${source}&method=google`;
		if (source === 'register') {
			showRegisterComponent = true;
		} else {
			showRegisterComponent = false;
			if (accessToken && refreshToken) {
				if (redirctSource === 'desktop') {
					let data = JSON.parse(window.atob(accessToken?.split('.')[1]));
					let firstName = data.name;
					firstName = firstName.split(' ')[0];
					firstName = firstName.length > 11 ? firstName.substring(0, 5) + '...' : firstName;
					redirectRules.title = `Welcome Back ${firstName}`;
					setTimeout(() => {
						redirectRules.description = `Redirecting you to desktop app...`;
						redirectRules.message = `the token if you are facing any issue in redirecting to the login page`;

						redirectRules.loadingMessage = '';
						redirectRules.isSpinner = false;
						window.location.href = sparrowRedirect;
					}, constants.API_REDIRECT_TIMEOUT);
				} else if (redirctSource === 'admin') {
					navigate(sparrowAdminRedirect);
				} else {
					navigate(sparrowWebRedirect);
				}
			} else {
				if (redirctSource === 'desktop') {
					navigate('/init');
				} else if (redirctSource === 'admin') {
					navigate('/init?source=admin');
				} else {
					navigate('/init?source=web');
				}
			}
		}
	});

	let redirectRules = {
		title: 'Welcome to Sparrow!',
		description: 'Bridging Frontend and Backend Development.',
		message: `the token if you are facing any issue in redirecting to the login page`,
		isSpinner: true,
		buttonText: 'Open Desktop App',
		buttonClick: () => {
			window.location.href = sparrowRedirect;
		},
		copyLink: () => {
			if (navigator.clipboard) {
				notifications.success('Link copied to clipboard.');
				return navigator.clipboard.writeText(sparrowRedirect);
			}
		},
		loadingMessage: 'Please wait while we sign you in....'
	};

	function handleContinueButtonClick() {
		showRegisterComponent = false;
		if (accessToken && refreshToken) {
			if (redirctSource === 'desktop') {
				let data = JSON.parse(window.atob(accessToken?.split('.')[1]));
				let firstName = data.name;
				firstName = firstName.split(' ')[0];
				firstName = firstName.length > 11 ? firstName.substring(0, 5) + '...' : firstName;
				redirectRules.title = `Welcome ${firstName}`;
				setTimeout(() => {
					redirectRules.description = `Redirecting you to desktop app...`;
					redirectRules.message = `the token if you are facing any issue in redirecting to the login page`;
					redirectRules.loadingMessage = '';
					redirectRules.isSpinner = false;
					window.location.href = sparrowRedirect;
				}, constants.API_REDIRECT_TIMEOUT);
			} else if (redirctSource === 'admin') {
				navigate(sparrowAdminRedirect);
			} else {
				navigate(sparrowWebRedirect);
			}
		} else {
			if (redirctSource === 'desktop') {
				navigate('/init');
			} else if (redirctSource === 'admin') {
				navigate('/init?source=admin');
			} else {
				navigate('/init?source=web');
			}
		}
	}
</script>

{#if showRegisterComponent}
	<RegisterRedirectComponent {handleContinueButtonClick} />
{:else if accessToken && refreshToken}
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
{/if}
