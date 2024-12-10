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
	import BgContainer from '$lib/components/bgContainer/BgContainer.svelte';
	import { onMount } from 'svelte';
	import PrivacyPolicy from '$lib/components/privacy-policy/PrivacyPolicy.svelte';
	import AiSparkle from '$lib/assets/AiSparkle.svelte';
	import Spinner from '$lib/components/transition/Spinner.svelte';
	import CircleTick from '$lib/assets/CircleTick.svelte';
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

	onMount(() => {
		// Check the query parameters in the URL
		const urlParams = new URLSearchParams(window.location.search);
		const source = urlParams.get('source'); // Get 'source' from query param
		if (source === 'web') {
			localStorage.setItem('isUserFromDesktop', 'false');
		} else {
			localStorage.setItem('isUserFromDesktop', 'true');
		}
	});

	let emailExists = false;

	const checkEmailExistenceOnInput = async (email) => {
  if (!email) return;

  isEmailTouched = true;
  entryLoader = true;
    emailExists = false; // Reset before the check starts
  try {
    const response = await handleEntry({ email }); // Reuse the same `handleEntry` function
    if (response.isSuccessful) {
      // Check if the email is registered
      emailExists =
        response?.data?.registeredWith === 'email' ||
        response?.data?.registeredWith === 'google';
    } else {
      emailExists = false; // Email not registered
    }
  } catch (error) {
    emailExists = false; // Handle errors gracefully
  }
  entryLoader = false;
};

	


	let checkTimeout;
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
				Welcome to Sparrow!
			</p>
			<p class="" style="color: lightGray; font-size:12px;">The only API Sidekick you need</p>
		</div>

		<Oauth />

		<div class="divider w-100">
			<span class="line"></span>
			<span class="text" style="color:var(--editor-angle-bracket)">Or</span>
			<span class="line"></span>
		</div>

		<form
			class="login-form w-100 text-whiteColor ps-1 pe-1 mb-2"
			novalidate
			on:submit|preventDefault={async () => {
				isEmailTouched = true;
				validationErrors = await handleEntryValidation(entryCredentials);
				if (!validationErrors?.email) {
					entryLoader = true;
					const response = await handleEntry(entryCredentials);
					debugger;
					if (response.isSuccessful) {
						if (
							response?.data?.registeredWith === 'email' ||
							response?.data?.registeredWith === 'google'
						) {
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
			<!-- <p class="card-subtitle sparrow-fs-20 sparrow-fw-500 mb-3">Sign In or Create an Account</p> -->
			<div class="mb-3">
				<label for="exampleInputEmail1" class="form-label text-Gray sparrow-fs-14 d-flex"
					>Email ID
					<p class="ms-1 mb-0 sparrow-fw-600 text-dangerColor">*</p></label
				>
				<!-- <img src={starIcon} alt="" class="mb-3" style="width: 7px;" /> -->

				<div class="d-flex position-relative mt-1">
					<input
						type="email"
						class="form-control sparrow-fs-16 border:{validationErrors?.email && isEmailTouched
							? '3px'
							: '1px'} solid {validationErrors?.email && isEmailTouched
							? 'border-error'
							: 'border-default'}"
						id="exampleInputEmail1"
						aria-describedby="emailHelp"
						placeholder="Enter your email addresss"
						autocorrect="off"
						autocapitalize="none"
						autocomplete="off"
						bind:value={entryCredentials.email}
						on:blur={async () => {
							isEmailTouched = true;
							validationErrors = await handleEntryValidation(entryCredentials);
							clearTimeout(checkTimeout);
							checkTimeout = setTimeout(() => checkEmailExistenceOnInput(entryCredentials.email), 1000);
						
						}}
						on:input={async () => {
							validationErrors = await handleEntryValidation(entryCredentials);
							clearTimeout(checkTimeout);
							checkTimeout = setTimeout(() => checkEmailExistenceOnInput(entryCredentials.email), 1000);
							
						}}
					/>

					<button
						type="button"
						on:click={() => {}}
						class=" border-0 position-absolute eye-icon d-flex align-items-center"
					>
						{#if entryLoader}
							<!-- Show loader while checking -->
							<Spinner size={'16px'} />
						{:else if emailExists}
							<!-- Show success icon if email exists -->
							<CircleTick height={'16px'} width={'16px'} />
			
							
						{/if}
					</button>
				</div>

				{#if validationErrors?.email && isEmailTouched}
					<small class="form-text text-dangerColor"> {validationErrors?.email}</small>
				{/if}
			</div>

			<div>
				<button
					class="btn btn-primary w-100 text-blackColor"
					style="height:44px;"
					on:click={() => {
						// skipLoginHandler();
					}}
					id="create_account_or_sign_in"
				>
					Send magic code
				</button>
			</div>
		</form>

		<div class="d-flex p-2">
			<div style="height: 24px; width:24px;">
				<AiSparkle height={'24px'} width={'24px'} />
			</div>
			<p class="text-center">
				We will email you a magic code for password free Sign in or you can <span
					style="color:#3760F7;">continue with password</span
				>
			</p>
		</div>
		<!-- <PrivacyPolicy/> -->
		<SupportHelp />
	</BgContainer>
{/if}

<style>
	.eye-icon {
		right: 5px;
		top: 50%;
		transform: translateY(-50%);
		background-color: transparent;
	}
	.outline-none {
		outline: none;
	}
	.btn-primary {
		font-weight: 400;
		border-radius: 10px;
		font-size: 14px;
		background-color: white;
		color: var(--text-primary-300);
		border: 1px solid #ffffff;
	}

	.btn-primary:hover {
		background-color: #6147ff; /* purple-600 */
		border-color: transparent;
	}

	.btn-primary:active {
		box-shadow: inset 0px 0px 12px 5px rgba(0, 0, 0, 0.55);
	}
	.btn-primary:disabled {
		background-color: var(--bg-secondary-100);
		border: 1px solid #ffffff;
	}

	input {
		background-color: transparent !important;
	}

	.divider {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 14px 0;
		font-family: Arial, sans-serif;
	}

	.divider .line {
		flex: 1;
		height: 1px;
		background: linear-gradient(to right, #62636c00, #bfc0d2);
	}

	.divider .line:last-child {
		background: linear-gradient(to left, #62636c00, #bfc0d2);
	}

	.divider .text {
		margin: 0 10px;
		color: #bfc0d2;
		font-size: 14px;
	}
</style>
