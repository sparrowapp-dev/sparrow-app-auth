<script lang="ts">
	import { Link, navigate } from 'svelte-navigator';
	import { isLoading, isResponseError } from '$lib/store/auth.store';
	import googleLogo from '$lib/assets/googlelogo.svg';
	import eyeHide from '$lib/assets/eye-hide.svg';
	import eyeShow from '$lib/assets/eye-show.svg';
	import { handleLogin, handleLoginValidation } from './login-page';
	import sparrowicon from '$lib/assets/logoSparrowSquare.svg';
	import LoginLoader from '$lib/components/transition/LoginLoader.svelte';
	import Redirect from '../redirect/Redirect.svelte';
	import constants from '$lib/utils/constants';
	import SupportHelp from '$lib/components/help/SupportHelp.svelte';
	import Oauth from '$lib/components/o-auth/Oauth.svelte';
	import starIcon from '$lib/assets/starIcon.svg';
	import { notifications } from '$lib/components/toast-notification/ToastNotification';
	import Button from '$lib/components/button/Button.svelte';
	import BgContainer from '$lib/components/bgContainer/BgContainer.svelte';
	import AiSparkle from '$lib/assets/AiSparkle.svelte';

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
		copyLink: () => {},
		loadingMessage: 'Please wait while we sign you in....'
	};
	let loginLoader = false;

	let userFromDesktop = localStorage.getItem('isUserFromDesktop');
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
		<div class="d-flex align-items-start gap-2">
			<div
				class="text-white d-flex justify-content-center align-items-center bg-sparrowPrimaryColor"
				style="height: 23px; width: 23px; border-radius: 6px;"
			>
				<img height="20px" width="20px" src={sparrowicon} alt="" class="" />
			</div>
			<p style="font-weight:500;">Sparrow</p>
		</div>

		<div style="display: flex ; flex-direction:column; align-items:center;">
			<p
				class="container-header sparrow-fw-600 text-whiteColor text-center ms-2 me-2 mb-1"
				style="font-size:24px; font-weight: 400; padding-top:20px; line-height:28px; text-align:center;"
			>
				Welcome Back!
			</p>
			<p class="" style="color: lightGray; font-size:12px; margin-bottom:15%;">
				Let’s get back to work
			</p>
		</div>
		<form
			class="login-form w-100 text-whiteColor ps-1 pe-1 gap-16 mb-2"
			novalidate
			on:submit|preventDefault={async () => {
				isPasswordTouched = true;
				isEmailTouched = true;
				validationErrors = await handleLoginValidation(loginCredentials);
				if (!validationErrors?.email && !validationErrors?.password) {
					loginLoader = true;
					const result = await handleLogin(loginCredentials);
					if (result.isSuccessful) {
						const response = result.data;
						if (response?.isEmailVerified) {
							isLogin = true;
							const accessToken = response?.accessToken?.token;
							const refreshToken = response?.refreshToken?.token;
							const sparrowRedirect = `sparrow://?accessToken=${accessToken}&refreshToken=${refreshToken}&response=${JSON.stringify(response)}&event=login&method=email`;
							const sparrowWebRedirect =
								constants.SPARROW_WEB_URL +
								`?accessToken=${accessToken}&refreshToken=${refreshToken}&response=${JSON.stringify(response)}&event=login&method=email`;
							if (userFromDesktop === 'true') {
								let data = JSON.parse(window.atob(accessToken?.split('.')[1]));
									let firstName = data.name;
				                        firstName = firstName.split(' ')[0];
				                        firstName = firstName.length > 11 ? firstName.substring(0, 5) + "..." : firstName;
									redirectRules.title = `Welcome Back ${firstName}`;
								setTimeout(() => {
									
									redirectRules.description = `Redirecting you to desktop app...`;
									redirectRules.message = `the link if the application does not open automatically.`;
									redirectRules.loadingMessage = '';
									redirectRules.isSpinner = false;
									navigate(sparrowRedirect);
									redirectRules.buttonClick = () => {
										navigate(sparrowRedirect);
									};
									redirectRules.copyLink = () => {
										if (navigator.clipboard) {
											notifications.success("Link copied to clipboard.");
											return navigator.clipboard.writeText(sparrowRedirect);
										} 
									};
								}, 1000);
							} else {
								navigate(sparrowWebRedirect);
							}
						} else {
							localStorage.setItem(`timer-verify-${loginCredentials.email}`, new Date().getTime());
							notifications.success('Verification code has been sent to your registered Email ID.');
							navigate(`/verify/email/${loginCredentials.email}`);
						}
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
					loginLoader = false;
				}
			}}
		>
			<!-- <p class="card-subtitle sparrow-fs-20 sparrow-fw-500 mb-3">Sign In</p> -->
			<div class="mb-3">
				<label for="exampleInputEmail1" class="form-label text-lightGray sparrow-fs-14 d-flex"
					>Email ID
					<p class="ms-1 mb-0 sparrow-fw-600 text-dangerColor">*</p>
				</label>
				<!-- <img src={starIcon} alt="" class="mb-3" style="width: 7px;" /> -->
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
					placeholder="Please enter your registered Email ID"
					autocomplete="off"
					autocorrect="off"
					autocapitalize="none"
					disabled={id ? true : false}
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
				<label for="exampleInputPassword1" class="form-label text-lightGray sparrow-fs-14 d-flex"
					>Password
					<p class="ms-1 mb-0 sparrow-fw-600 text-dangerColor">*</p></label
				>
				<!-- <img src={starIcon} alt="" class="mb-3" style="width: 7px;" /> -->
				<div class="d-flex position-relative">
					<input
						type="password"
						autocomplete="off"
						id="exampleInputPassword1"
						placeholder="Enter your password"
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
						maxlength="32"
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
						>Invalid email ID or password. Please enter your valid email ID and password.</small
					>
				{/if}
			</div>
			<div class="d-flex mb-4 align-items-center justify-content-end">
				<Link
					to="/forgot/password"
					class="text-decoration-none text-primaryColor sparrow-fs-12 sparrow-fw-500"
					>Forgot Password?</Link
				>
			</div>

			<div class="mb-1">
				<Button
					disable={loginLoader}
					title={'Login'}
					buttonClassProp={'w-100 py-2 align-items-center d-flex justify-content-center sparrow-fs-16'}
					type={'primary'}
					loader={loginLoader}
				/>
			</div>
		</form>
		<div class="d-flex align-items-start ms-1">
			<div style="height: 24px; width:24px;">
				<AiSparkle height={'24px'} width={'24px'} />
			</div>
			<p class="text-center sparrow-fs-12 pt-1 mb-0" style="margin-left:-10px; color: #CCCCCCE5;">
				Looking for a password less Login? <span
					on:click={() => {
						const isDesktopUser = localStorage.getItem('isUserFromDesktop');
						if (isDesktopUser === 'true') {
							navigate('/init?source=desktop');
						} else {
							navigate('/init?source=web');
						}
					}}
					style="color:#3760F7; cursor:pointer;">continue with magic code</span
				>
			</p>
		</div>
		<!-- <Oauth /> -->
		<div style="margin-top: 24px;">
			<SupportHelp />
		</div>
	</BgContainer>
{/if}

<style>
	.eye-icon {
		right: 5px;
		top: 50%;
		transform: translateY(-50%);
		background-color: transparent;
	}

	.btn-primary {
		background: var(--primary-color);
	}
	.btn-primary:hover {
		background: var(--primary-btn-color-hover);
	}
	.btn-primary:active {
		background: var(--button-pressed);
	}
	input {
		background-color: transparent !important;
	}
	input:disabled {
		opacity: 0.5;
	}
</style>
