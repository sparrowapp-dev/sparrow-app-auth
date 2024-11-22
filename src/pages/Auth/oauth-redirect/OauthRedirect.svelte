<script lang="ts">
	import { onMount } from 'svelte';
	import { navigate } from 'svelte-navigator';
	import Redirect from '../redirect/Redirect.svelte';
	import constants from '$lib/utils/constants';

	let userFromDesktop = localStorage.getItem('isUserFromDesktop');

	let accessToken = "";
	let refreshToken = "";
	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		accessToken = urlParams.get('accessToken') as string;
		refreshToken = urlParams.get('refreshToken') as string; 
		const source = urlParams.get('source');
		const sparrowRedirect = `sparrow://?accessToken=${accessToken}&refreshToken=${refreshToken}&event=${source}&method=google`;
		const sparrowWebRedirect = constants.SPARROW_WEB_URL +`?accessToken=${accessToken}&refreshToken=${refreshToken}&event=${source}&method=google`;

		if (accessToken && refreshToken) {
			if(userFromDesktop === "true"){
			setTimeout(() => {
				let data = JSON.parse(window.atob(accessToken?.split('.')[1]));
				redirectRules.title = `Welcome ${data.name}`;
				redirectRules.description = `Redirecting you to desktop app...`;
				redirectRules.message = `If the application does not open automatically,
				please click below.`;
				
				redirectRules.loadingMessage = '';
				redirectRules.isSpinner = false;
				navigate(sparrowRedirect);
				redirectRules.buttonClick = () => {
					navigate(sparrowRedirect);
				};
			}, constants.API_REDIRECT_TIMEOUT);
		}
			else{
				navigate(sparrowWebRedirect)
			}
		}
		else{
			if(userFromDesktop === "true"){
				navigate("/init")
			}
			else{
				navigate("/init?source=web")
			}			
		}
	});
	let redirectRules = {
		title: 'Welcome to Sparrow!',
		description: 'Bridging Frontend and Backend Development.',
		message: `Easily document and manage APIs for seamless collaboration between frontend and backend teams. Get started now to simplify your development workflows.`,
		isSpinner: true,
		buttonText: 'Open Desktop App',
		buttonClick: () => {},
		loadingMessage: 'Please wait while we sign you in....'
	};
</script>

{#if accessToken && refreshToken}
	<Redirect
		title={redirectRules.title}
		description={redirectRules.description}
		message={redirectRules.message}
		isSpinner={redirectRules.isSpinner}
		buttonText={redirectRules.buttonText}
		buttonClick={redirectRules.buttonClick}
		loadingMessage={redirectRules.loadingMessage}
	/>
{/if}
