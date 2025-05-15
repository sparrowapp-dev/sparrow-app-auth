<script lang="ts">
	import { handleEntryValidation, handleEntry } from './EntryPoint.ViewModel';
	import { sendMagicCodeEmail } from '$lib/services/auth.service';
	import sparrowicon from '$lib/assets/logoSparrowSquare.svg';
	import { navigate } from 'svelte-navigator';
	import SupportHelp from '$lib/components/help/SupportHelp.svelte';
	import { notifications } from '$lib/components/toast-notification/ToastNotification';
	import Oauth from '$lib/components/o-auth/Oauth.svelte';
	import Button from '$lib/components/button/Button.svelte';
	import BgContainer from '$lib/components/bgContainer/BgContainer.svelte';
	import { onMount } from 'svelte';
	import AiSparkle from '$lib/assets/AiSparkle.svelte';
	import Spinner from '$lib/components/transition/Spinner.svelte';
	import CircleTick from '$lib/assets/CircleTick.svelte';
	import MixpanelEvent from '$lib/utils/mixpanel/MixpanelEvent';
	import Tabs from '$lib/components/tabs/Tabs.svelte';
	import CloudCube from '$lib/assets/CloudCube.svelte';
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
	let isSubmitting = false; // Add this new state variable
	let showContinueButton = false;
	onMount(() => {
		// Check the query parameters in the URL
		const urlParams = new URLSearchParams(window.location.search);
		const source = urlParams.get('source'); // Get 'source' from query param
		if (source === 'web') {
			localStorage.setItem('source', 'web');
		} else if (source === 'admin') {
			localStorage.setItem('source', 'admin');
		} else {
			localStorage.setItem('source', 'desktop');
		}
	});

	let emailExists = false;

	const checkEmailExistenceOnInput = async (email) => {
		if (!email) {
			entryLoader = false;
			return;
		}

		isEmailTouched = true;
		entryLoader = true;
		showContinueButton = false;
		emailExists = false; // Reset before the check starts
		try {
			const response = await handleEntry({ email }); // Reuse the same `handleEntry` function
			if (response.isSuccessful) {
				// Check if the email is registered
				showContinueButton = true;
				emailExists =
					response?.data?.registeredWith === 'email' || response?.data?.registeredWith === 'google';
			} else {
				showContinueButton = false;
				emailExists = false; // Email not registered
			}
		} catch (error) {
			showContinueButton = false;
			emailExists = false; // Handle errors gracefully
		}
		entryLoader = false;
	};

	const handleMagicCodeAndRedirect = async (email: string) => {
		try {
			const magicCodeResponse = await sendMagicCodeEmail({ email });
			if (magicCodeResponse.isSuccessful) {
				navigate(`/verify-magic-code/${email}/${magicCodeResponse.data}`); // Updated this line
			} else {
				if (magicCodeResponse?.message === 'Cooldown Active') {
					navigate('/cool-down-active');
				} else {
					notifications.error(magicCodeResponse?.message);
				}
			}
		} catch (error) {
			notifications.error('Failed to send magic code.');
		}
	};

	let checkTimeout;
</script>

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
		<p class="" style="color: lightGray; font-size:12px;">The only API Sidekick you need.</p>
	</div>

	<Tabs variant="primary">
		<div slot="managed">
			<form
				class="login-form w-100 text-whiteColor ps-1 pe-1 mb-2 mt-4"
				novalidate
				on:submit|preventDefault={async () => {
					isSubmitting = true;
					isEmailTouched = true;
					validationErrors = await handleEntryValidation(entryCredentials);
					if (!validationErrors?.email) {
						entryLoader = true;
						const response = await handleEntry(entryCredentials);
						if (response.isSuccessful) {
							if (
								response?.data?.registeredWith === 'email' ||
								response?.data?.registeredWith === 'google'
							) {
								// Send magic code before redirecting
								localStorage.setItem(
									`timer-verify-magic-code-${entryCredentials.email}`,
									new Date().getTime()
								);

								await handleMagicCodeAndRedirect(entryCredentials?.email);
							} else {
								// New user - redirect to registration
								navigate(`/register/${entryCredentials?.email}`);
							}
						} else {
							notifications.error(response?.message);
						}
						entryLoader = false;
					}
					isSubmitting = false;
				}}
			>
				<!-- <p class="card-subtitle sparrow-fs-20 sparrow-fw-500 mb-3">Sign In or Create an Account</p> -->
				<div class="mb-3">
					<label for="exampleInputEmail1" class="form-label text-Gray sparrow-fs-14 d-flex"
						>Email ID
						<p class="ms-1 mb-0 sparrow-fw-600 text-dangerColor">*</p></label
					>

					<div class="d-flex position-relative mt-1">
						<input
							type="email"
							class="form-control pe-5 sparrow-fs-16 border:{validationErrors?.email &&
							isEmailTouched
								? '3px'
								: '1px'} solid {validationErrors?.email && isEmailTouched
								? 'border-error'
								: 'border-default'}"
							id="exampleInputEmail1"
							aria-describedby="emailHelp"
							placeholder="Enter your email ID"
							autocorrect="off"
							autocapitalize="none"
							autocomplete="off"
							bind:value={entryCredentials.email}
							on:blur={async () => {
								isEmailTouched = true;
								validationErrors = await handleEntryValidation(entryCredentials);
								clearTimeout(checkTimeout);
								checkTimeout = setTimeout(
									() => checkEmailExistenceOnInput(entryCredentials.email),
									1000
								);
							}}
							on:input={async () => {
								entryLoader = true;
								validationErrors = await handleEntryValidation(entryCredentials);
								clearTimeout(checkTimeout);
								checkTimeout = setTimeout(
									() => checkEmailExistenceOnInput(entryCredentials.email),
									1000
								);
							}}
						/>

						<button
							type="button"
							on:click={() => {}}
							class=" border-0 position-absolute eye-icon d-flex align-items-center"
						>
							{#if entryLoader}
								<Spinner size={'16px'} />
							{:else if emailExists && entryCredentials.email.trim().length > 0}
								<CircleTick height={'16px'} width={'16px'} />
							{/if}
						</button>
					</div>

					{#if validationErrors?.email && isEmailTouched}
						<small class="form-text text-dangerColor"> {validationErrors?.email}</small>
					{/if}
				</div>

				<div>
					<Button
						disable={entryLoader || isSubmitting}
						title={!emailExists && showContinueButton ? 'Continue' : 'Send Magic Code'}
						buttonClassProp={'w-100 align-items-center d-flex justify-content-center sparrow-fs-16'}
						type={'primary'}
					/>
				</div>
			</form>

			<div class="divider w-100">
				<span class="line"></span>
				<span class="text" style="color:var(--editor-angle-bracket)">Or</span>
				<span class="line"></span>
			</div>

			<Oauth />
			<div class="d-flex align-items-start ms-1" style="gap: 4px;">
				<div style="height: 24px; width:24px;">
					<AiSparkle height={'24px'} width={'24px'} />
				</div>
				<p class="text-center sparrow-fs-12 pt-1 mb-0" style="margin-left:-10px; color: #CCCCCCE5;">
					We will email you a magic code for password free Sign in or you can <span
						on:click={() => {
							navigate('/password-login');
							MixpanelEvent('Continue_with_password');
						}}
						style="color:#3760F7; cursor:pointer;">continue with password</span
					>
				</p>
			</div>
		</div>
		<div slot="self-hosted">
			<div class="d-flex justify-content-center mt-4">
				<CloudCube />
			</div>
			<div class="self-hosting-container">
				<p class="d-flex justify-content-center text-center" style="margin: 0px; color:#ffffff;">
					Self Hosting is Coming Soon!
				</p>
				<p
					class="d-flex justify-content-center text-center"
					style="margin: 0px; color:#9B9DA1; font-size:12px;"
				>
					Gain full control of your deployment with our upcoming self-hosting feature. Stay tuned!
				</p>
			</div>
		</div>
	</Tabs>
	<div style="margin-top: 24px;">
		<SupportHelp />
	</div>
</BgContainer>

<style>
	.eye-icon {
		right: 5px;
		top: 50%;
		transform: translateY(-50%);
		background-color: transparent;
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
		width: 111px;
		height: 1px;
		background: linear-gradient(to right, #62636c00, #bfc0d2);
	}

	.divider .line:last-child {
		background: linear-gradient(to left, #62636c00, #bfc0d2);
	}

	.divider .text {
		margin: 0 3px;
		color: #bfc0d2;
		font-size: 14px;
	}
	.self-hosting-container {
		width: 310px;
	}
</style>
