<script lang="ts">
	import { Link, navigate } from 'svelte-navigator';
	import { isLoading, isResponseError } from '$lib/store/auth.store';
	import googleLogo from '$lib/assets/googlelogo.svg';
	import eyeHide from '$lib/assets/eye-hide.svg';
	import eyeShow from '$lib/assets/eye-show.svg';
	import { handleLogin, handleLoginValidation } from './login-page';
	import sparrowicon from '$lib/assets/sparrow-icon-bg.svg';
	import LoginLoader from '$lib/components/transition/LoginLoader.svelte';
	import Redirect from '../redirect/Redirect.svelte';
	import constants from '$lib/utils/constants';
	import SupportHelp from '$lib/components/help/SupportHelp.svelte';
	import Oauth from '$lib/components/o-auth/Oauth.svelte';
	import { notifications } from '$lib/components/toast-notification/ToastNotification';
	export let id;

	let isEmailTouched = false;
	let isPasswordTouched = false;
	let isLogin = false;
	let authenticationError = false;

	//---------------- Login Validation --------------------//
	let validationErrors: any = {};

	//------------ login Credentials ---------------//
	let loginCredentials = {
		email: id || '',
		password: ''
	};

	let isPasswordVisible = false;

	const togglePasswordVisibility = () => {
		isPasswordVisible = !isPasswordVisible;
		const passwordInput = document.getElementById(
			'exampleInputPassword1'
		) as HTMLInputElement | null;
		if (passwordInput) {
			passwordInput.type = isPasswordVisible ? 'text' : 'password';
		}
	};

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

{#if isLogin}
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
				class="login-form w-100 text-whiteColor ps-1 pe-1 gap-16 mb-2"
				novalidate
				on:submit|preventDefault={async () => {
					isPasswordTouched = true;
					isEmailTouched = true;
					validationErrors = await handleLoginValidation(loginCredentials);
					if (!validationErrors?.email && !validationErrors?.password) {
						const result = await handleLogin(loginCredentials);
						if (result.isSuccessful) {
							const response = result.data;
							isLogin = true;
							const accessToken = response?.accessToken?.token;
							const refreshToken = response?.refreshToken?.token;
							const sparrowRedirect = `sparrow://?accessToken=${accessToken}&refreshToken=${refreshToken}&response=${JSON.stringify(response)}`;
							setTimeout(() => {
								let data = JSON.parse(window.atob(accessToken?.split('.')[1]));
								redirectRules.title = `Welcome back ${data.name}`;
								redirectRules.description = `Redirecting you to desktop app...`;
								redirectRules.message = `If the application does not open automatically,
								please click below.`;

								redirectRules.loadingMessage = '';
								redirectRules.isSpinner = false;
								navigate(sparrowRedirect);
								redirectRules.buttonClick = () => {
									navigate(sparrowRedirect);
								};
							}, 1000);
						} else {
							const response = result.message;
							if (
								response === 'Could not authenticate. Please try again.' ||
								response === 'password must be longer than or equal to 8 characters'
							) {
								authenticationError = true;
							} else {
								notifications.error(response);
							}
						}
					}
				}}
			>
				<p class="card-subtitle sparrow-fs-20 mb-3">Sign In</p>
				<div class="mb-3">
					<label for="exampleInputEmail1" class="form-label text-red sparrow-fs-14">Email</label>
					<input
						type="email"
						class="form-control sparrow-fs-16 border:{(validationErrors?.email && isEmailTouched) ||
						authenticationError
							? '3px'
							: '1px'} solid {(validationErrors?.email && isEmailTouched) || authenticationError
							? 'border-error'
							: 'border-default'}"
						id="exampleInputEmail1"
						aria-describedby="emailHelp"
						placeholder="Please enter your registered email id"
						autocomplete="off"
						autocorrect="off"
						autocapitalize="none"
						bind:value={loginCredentials.email}
						on:blur={async () => {
							isEmailTouched = true;
							validationErrors = await handleLoginValidation(loginCredentials);
						}}
						on:input={async () => {
							validationErrors = await handleLoginValidation(loginCredentials);
							authenticationError = false;
						}}
					/>

					{#if validationErrors?.email && isEmailTouched}
						<small class="form-text text-dangerColor"> {validationErrors?.email}</small>
					{/if}
				</div>

				<div class="mb-4">
					<label for="exampleInputPassword1" class="form-label sparrow-fs-14">Password</label>
					<div class="d-flex position-relative">
						<input
							type="password"
							autocomplete="off"
							id="exampleInputPassword1"
							placeholder="Please enter your Password"
							autocorrect="off"
							autocapitalize="none"
							bind:value={loginCredentials.password}
							class="form-control sparrow-fs-16 pe-5 border:{(validationErrors?.password &&
								isPasswordTouched) ||
							authenticationError
								? '3px'
								: '1px'} solid {(validationErrors?.password && isPasswordTouched) ||
							authenticationError
								? 'border-error'
								: 'border-default'}"
							on:blur={async () => {
								isPasswordTouched = true;
								validationErrors = await handleLoginValidation(loginCredentials);
							}}
							on:input={async () => {
								validationErrors = await handleLoginValidation(loginCredentials);
								authenticationError = false;
							}}
						/>
						<button
							type="button"
							on:click={togglePasswordVisibility}
							class="border-0 position-absolute eye-icon d-flex align-items-center"
						>
							{#if isPasswordVisible}
								<img src={eyeShow} alt="eye-show" />
							{:else}
								<img src={eyeHide} alt="eye-hie" />
							{/if}
						</button>
					</div>

					{#if validationErrors?.password && isPasswordTouched}
						<small class="form-text text-dangerColor">{validationErrors?.password}</small>
					{:else if authenticationError}
						<small class="form-text text-dangerColor"
							>The email and password combination you entered appears to be incorrect. Please try
							again.</small
						>
					{/if}
				</div>
				<div class="d-flex mb-4 align-items-center justify-content-end">
					<Link to="/forgot/password" class="text-decoration-none text-primaryColor"
						>Forgot Password?</Link
					>
				</div>

				<div class="mb-1">
					<button class="btn btn-primary w-100 text-whiteColor border-0" on:click={() => {}}
						>Sign In</button
					>
				</div>
			</form>
			<Oauth />
			<SupportHelp />
		</div>
	</div>
{/if}

<style>
	.eye-icon {
		top: 5px;
		right: 5px;
		background-color: transparent;
	}

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
</style>
