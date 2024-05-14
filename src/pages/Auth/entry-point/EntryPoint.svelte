<script lang="ts">
	import { handleEntryValidation, handleEntry } from './EntryPoint.ViewModel';
	import sparrowicon from '$lib/assets/logoSparrowSquare.svg';
	import { navigate } from 'svelte-navigator';
	import Redirect from '../redirect/Redirect.svelte';
	import constants from '$lib/utils/constants';
	import SupportHelp from '$lib/components/help/SupportHelp.svelte';
	import { notifications } from '$lib/components/toast-notification/ToastNotification';
	import Oauth from '$lib/components/o-auth/Oauth.svelte';
	import starIcon from '$lib/assets/starIcon.svg';
	import Button from '$lib/components/button/Button.svelte';

	let isEmailTouched = false;
	//---------------- Login Validation --------------------//
	let validationErrors: any = {};
	//------------ login Credentials ---------------//
	let entryCredentials: {
		email: string;
	} = {
		email: ''
	};
	let isEntry = false;

	let redirectRules = {
		title: 'Redirecting to your account...',
		description: '',
		message: ``,
		isSpinner: true,
		buttonText: 'Open Desktop App',
		buttonClick: () => {},
		loadingMessage: 'Please wait while we are redirecting you to your email account....'
	};
	let entryLoader = false;
</script>

{#if isEntry}
	<Redirect
		title={redirectRules.title}
		description={redirectRules.description}
		message={redirectRules.message}
		isSpinner={redirectRules.isSpinner}
		buttonText={redirectRules.buttonText}
		buttonClick={redirectRules.buttonClick}
		loadingMessage={redirectRules.loadingMessage}
	/>
{:else}
	<div class="parent d-flex align-items-center justify-content-center text-white rounded">
		<div
			class="position-relative overflow-hidden entry-point rounded-4 container d-flex flex-column align-items-center justify-content-center w-100"
		>
			<div style="position: absolute; top: 0; left: 0; height: 100%; width: 100%; background: var(--bg-container);
				backdrop-filter: blur( 50px );
				-webkit-backdrop-filter: blur( 50px );
				border-radius: 10px; z-index: 0;">
			</div>
			<div style="width: 39px;
				height: 104px;
				opacity: 0.256;background: var(--bg-container-one);
				border-radius: 100%; position: absolute; top: calc(250px - 72px); left: -20px;
				z-index: -1;
			"></div>
			<div style="width: 305px;
				height: 77px;background: var(--bg-container-two);
				opacity: 0.26;
				border-radius: 100%; position: absolute; top: 0; left: calc(250px - 152px); z-index: -1;
			"></div>
			<div style="width: 131px;
				height: 85px;
				opacity: 0.256;background: var(--bg-container-three);
				border-radius: 100%; position: absolute; top: calc(250px - 60px); right: 0px; z-index: -1;
			"></div>
			<div style="width: 305px;
				height: 77px;
				opacity: 0.26;background: var(--bg-container-four);
				border-radius: 100%; position: absolute; bottom: -35px; left: calc(250px - 150px); z-index: -1;
			"></div>
			<div class=" d-flex flex-column align-items-center justify-content-center w-100" style="z-index: 100;">
				<div class="text-white d-flex justify-content-center align-items-center bg-sparrowPrimaryColor" style="height: 60px; width: 60px; border-radius: 6px;">
					<img src={sparrowicon} alt="" class="" />
				</div>
				<p
					class="container-header pt-4 pb-4 sparrow-fs-28 sparrow-fw-600 text-whiteColor text-center ms-2 me-2"
				>
					Welcome to Sparrow!
				</p>
				<form
					class="login-form w-100 text-whiteColor ps-1 pe-1 mb-2"
					novalidate
					on:submit|preventDefault={async () => {
						isEmailTouched = true;
						validationErrors = await handleEntryValidation(entryCredentials);
						if (!validationErrors?.email) {
							const response = await handleEntry(entryCredentials);
							if (response.isSuccessful) {
								if (response?.data?.registeredWith === 'google') {
									// Registered with google auth
									isEntry = true;
									redirectRules.title = `Redirecting you to sign in with google account...`;
									redirectRules.description = `${entryCredentials?.email} is already registered using google account.`;
									redirectRules.loadingMessage = `Please wait while we are redirecting you to your google account....`;
									setTimeout(() => {
										navigate(constants.SPARROW_OAUTH);
									}, 1000);
								} else if (response?.data?.registeredWith === 'email') {
									// registered with email
									isEntry = true;
									redirectRules.title = `Redirecting to your account...`;
									redirectRules.description = `${entryCredentials?.email} has been previously used to login via email account.`;
									redirectRules.loadingMessage = `Please wait while we are redirecting you to your email account....`;
									setTimeout(() => {
										navigate(`/login/${entryCredentials?.email}`);
									}, 1000)
								} else {
									navigate(`/register/${entryCredentials?.email}`);
								}
							} else {
								notifications.error(response?.message);
							}
						}
					}}
				>
					<p class="card-subtitle sparrow-fs-20 sparrow-fw-500 mb-3">Sign In or Create an Account</p>
					<div class="mb-3">
						<label for="exampleInputEmail1" class="form-label text-lightGray sparrow-fs-14">Email</label>
						<!-- <img src={starIcon} alt="" class="mb-3" style="width: 7px;" /> -->
						<input
							type="email"
							class="form-control sparrow-fs-16 border:{validationErrors?.email && isEmailTouched
								? '3px'
								: '1px'} solid {validationErrors?.email && isEmailTouched
								? 'border-error'
								: 'border-default'}"
							id="exampleInputEmail1"
							aria-describedby="emailHelp"
							placeholder="Please enter your registered email id"
							autocorrect="off"
							autocapitalize="none"
							autocomplete="off"
							bind:value={entryCredentials.email}
							on:blur={async () => {
								isEmailTouched = true;
								validationErrors = await handleEntryValidation(entryCredentials);
							}}
							on:input={async () => {
								validationErrors = await handleEntryValidation(entryCredentials);
							}}
						/>

						{#if validationErrors?.email && isEmailTouched}
							<small class="form-text text-dangerColor"> {validationErrors?.email}</small>
						{/if}
					</div>

					<div class="mb-1">
						<button class="btn btn-primary w-100 text-whiteColor border-0">Continue</button>
					</div>
				</form>
				<Oauth />
				<SupportHelp />
			</div>
		</div>
	</div>
{/if}

<style>
	.btn-primary {
		background: var(--primary-color);
	}
	.parent {
		min-height: 100vh;
		overflow: auto;
	}
	.entry-point {
		margin: 30px !important;
		/* background: linear-gradient(to bottom, rgba(51, 51, 51, 0.16), rgba(42, 42, 51, 1)); */
		max-width: 504px;
		border-radius: 30px;
		border: 1px solid #FFFFFF17;
		padding: 48px !important;
	}
</style>
