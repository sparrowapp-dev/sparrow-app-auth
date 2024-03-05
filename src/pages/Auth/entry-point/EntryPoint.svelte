<script lang="ts">
	import { handleEntryValidation, handleEntry } from './EntryPoint.ViewModel';
	import sparrowicon from '$lib/assets/sparrow-icon-bg.svg';
	import { navigate } from 'svelte-navigator';
	import Redirect from '../redirect/Redirect.svelte';
	import constants from '$lib/utils/constants';
	import SupportHelp from '$lib/components/help/SupportHelp.svelte';
	import { notifications } from '$lib/components/toast-notification/ToastNotification';
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
			class="entry-point rounded container d-flex flex-column align-items-center justify-content-center w-100"
		>
			<div class="text-white d-flex justify-content-center align-items-center">
				<img src={sparrowicon} width="60px" alt="" class="" />
			</div>
			<p
				class="container-header pt-4 pb-5 sparrow-fs-28 text-whiteColor text-center ms-2 me-2 fw-bold"
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
						entryLoader = true;
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
								}, 1000);
							} else {
								navigate(`/register/${entryCredentials?.email}`);
							}
						} else {
							notifications.error(response?.message);
						}
						entryLoader = false;
					}
				}}
			>
				<p class="card-subtitle sparrow-fs-20 mb-3">Sign In or Create an Account</p>
				<div class="mb-3">
					<label for="exampleInputEmail1" class="form-label text-red sparrow-fs-14">Email</label>
					<img src={starIcon} alt="" class="mb-3" style="width: 7px;" />
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
					<Button
						disable={entryLoader}
						title={"Continue"}
						buttonClassProp={"w-100 py-2 align-items-center d-flex justify-content-center sparrow-fs-16"}
						type={"primary-gradient"}
						loader={entryLoader}
				  	/>
				</div>
			</form>
			<SupportHelp />
		</div>
	</div>
{/if}

<style>
	.parent {
		min-height: 100vh;
		overflow: auto;
	}
	.entry-point {
		margin: 30px !important;
		background: linear-gradient(to bottom, rgba(51, 51, 51, 0.16), rgba(42, 42, 51, 1));
		max-width: 504px;
		padding: 48px 48px 64px 48px !important;
	}
	input {
		background-color: transparent;
	}
</style>
