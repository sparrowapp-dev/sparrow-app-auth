<script lang="ts">
	import { handleEntryValidation, handleEntry } from './EntryPoint.ViewModel';
	import sparrowicon from '$lib/assets/sparrow-icon-bg.svg';
	import { navigate } from 'svelte-navigator';
	import Redirect from '../redirect/Redirect.svelte';

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
				class="container-header pt-4 pb-5 fs-28 text-whiteColor text-center ms-2 me-2 fw-bold"
				style="font-size: 28px;"
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
						if (response?.authProvider) {
							// Registered with google auth
							isEntry = true;
							redirectRules.title = `Redirecting you to sign in with google account...`;
							redirectRules.description = `${entryCredentials?.email} is already registered using google account.`;
							redirectRules.loadingMessage = `Please wait while we are redirecting you to your google account....`;
							setTimeout(() => {
								navigate('https://api.sparrowapp.dev/api/auth/google/callback');
							}, 5000);
						} else if (response?.email) {
							// registered with email
							isEntry = true;
							redirectRules.title= `Redirecting to your account...`;
							redirectRules.description = `${entryCredentials?.email} has been previously used to login via email account.`;
							redirectRules.loadingMessage = `Please wait while we are redirecting you to your email account....`;
							setTimeout(() => {
								navigate(`/login/${entryCredentials?.email}`);
							}, 5000);
						} else {
							navigate(`/register/${entryCredentials?.email}`);
						}
					}
				}}
			>
				<p class="card-subtitle sparrow-fs-20 mb-3">Sign In or Create an Account</p>
				<div class="mb-3">
					<label for="exampleInputEmail1" class="form-label text-red sparrow-fs-14">Email</label>
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
						bind:value={entryCredentials.email}
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
			<div class="w-100 d-flex align-items-center justify-content-center">
				<a href="mailto:email@example.com" class="px-2">Need Help?</a>
				<span class="px-2">|</span>
				<a href="mailto:email@example.com" class="px-2">Report Issue</a>
			</div>
		</div>
	</div>
{/if}

<style>
	.btn-primary {
		background: linear-gradient(270deg, #6147ff -1.72%, #1193f0 100%);
	}
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
	a {
		text-decoration: none;
	}
</style>
