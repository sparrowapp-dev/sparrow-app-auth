<script lang="ts">
	import lineIcon from '$lib/assets/line.svg';
	import { errorMessageText, isLoading, username } from '$lib/store/auth.store';
	import { handleVerifyEmail, isSuccessfulResponse } from './update-password';
	import sparrowicon from '$lib/assets/logoSparrowSquare.svg';
	import { writable } from 'svelte/store';
	import { onDestroy, onMount } from 'svelte';
	import { navigate } from 'svelte-navigator';
	import { notifications } from '$lib/components/toast-notification/ToastNotification';
	import { forgotPassword, sendUserEmailVerification } from '$lib/services/auth.service';
	import Button from '$lib/components/button/Button.svelte';
	import BgContainer from '$lib/components/bgContainer/BgContainer.svelte';
	import Redirect from '../redirect/Redirect.svelte';
	import constants from '$lib/utils/constants';
	import SupportHelp from '$lib/components/help/SupportHelp.svelte';

	import CircleCheck from '$lib/assets/CircleCheck.svelte';
	export let id: string;

	let seconds = 300; // Changed from 600 to 300 (5 minutes)
	const verifyString = writable('');
	let verifyLength: string = '';
	let isRegistered = false;
	let redirectRules = {
		title: 'Welcome to Sparrow!',
		description: 'Bridging Frontend and Backend Development.',
		message: `the token if you are facing any issue in redirecting to the login page`,
		isSpinner: true,
		buttonText: 'Open Desktop App',
		buttonClick: () => {},
		copyLink: () => {},
		loadingMessage: 'Please wait while we sign you in....'
	};

	let timer: number;
	const calculateRemainingTime = () => {
		const currentTime = new Date().getTime();
		const storedTime = parseInt(localStorage.getItem(`timer-${id}`));
		if (storedTime) {
			const elapsedTime = Math.floor((currentTime - storedTime) / 1000);
			const remainingTime = Math.max(300 - elapsedTime, 0); // Changed from 60 to 300
			return remainingTime;
		} else {
			return 0;
		}
	};

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	};

	const startTimer = () => {
		clearInterval(timer);
		timer = setInterval(() => {
			seconds = calculateRemainingTime();
			if (seconds === 0) clearInterval(timer);
		}, 1000);
	};

	onMount(() => {
		seconds = calculateRemainingTime();
		startTimer();
	});
	onDestroy(() => clearInterval(timer));

	let verifyCodeCredential = {
		email: id || '',
		verificationCode: ''
	};

	let verifyCode: string = '';

	let validationErrors;

	let verificationCode1: string = '';
	let verificationCode2: string = '';
	let verificationCode3: string = '';
	let verificationCode4: string = '';
	let verificationCode5: string = '';
	let verificationCode6: string = '';

	let emailText: string = id || '';

	let userFromDesktop = localStorage.getItem('isUserFromDesktop');

	let showResendSuccess = false;
	let isResendDisabled = false;

	const handleVerificationCode = () => {
		verifyCode =
			verificationCode1 +
			verificationCode2 +
			verificationCode3 +
			verificationCode4 +
			verificationCode5 +
			verificationCode6;
		verifyCodeCredential.verificationCode = verifyCode;

		if (verifyCode.length === 6) {
			verifyString.set(verifyCode);
		}
	};

	verifyString.subscribe((value) => {
		if (value) {
			verifyLength = value;
		}
	});

	let isLoadingPage: boolean;
	isLoading.subscribe((value) => {
		isLoadingPage = value;
	});

	let verificationCodeError: boolean;
	isSuccessfulResponse.subscribe((value) => {
		verificationCodeError = value;
	});

	let errorMessage: string = '';
	errorMessageText.subscribe((value) => {
		if (value) {
			errorMessage = value;
		}
	});
	let resentCodeLoader = false;
	const handleResend = async () => {
		isResendDisabled = true;
		resentCodeLoader = true;
		const response = await forgotPassword({ email: id });
		if (response.isSuccessful) {
			showResendSuccess = true;
			notifications.success('Verification code sent successfully.');
			localStorage.setItem(`timer-${id}`, new Date().getTime());
			startTimer();
			verificationCode1 = '';
			verificationCode2 = '';
			verificationCode3 = '';
			verificationCode4 = '';
			verificationCode5 = '';
			verificationCode6 = '';
			onCodeInput();
		} else {
			notifications.error(response.message);
		}
		resentCodeLoader = false;
		isResendDisabled = false;
	};
	const onCodeInput = () => {
		errorMessageText.set('');
		isSuccessfulResponse.set(false);
	};
	let verifyCodeLoader = false;
	onDestroy(() => {
		onCodeInput();
	});

	function handlePaste(event: ClipboardEvent) {
		event.preventDefault();
		const clipboardData = event?.clipboardData || window?.clipboardData;
		const pastedText = clipboardData.getData('text').trim().slice(0, 6); // Considering you have 6 input fields
		verificationCode1 = '';
		verificationCode2 = '';
		verificationCode3 = '';
		verificationCode4 = '';
		verificationCode5 = '';
		verificationCode6 = '';
		// Update the values in the array
		const otpInputs = pastedText.split('');

		// Update the input fields
		if (otpInputs[0]) {
			verificationCode1 = otpInputs[0];
		} else {
			document.getElementById('verificationCode1')?.focus();
			onCodeInput();
			handleVerificationCode();
			return;
		}
		if (otpInputs[1]) {
			verificationCode2 = otpInputs[1];
		} else {
			document.getElementById('verificationCode2')?.focus();
			onCodeInput();
			handleVerificationCode();
			return;
		}
		if (otpInputs[2]) {
			verificationCode3 = otpInputs[2];
		} else {
			document.getElementById('verificationCode3')?.focus();
			onCodeInput();
			handleVerificationCode();
			return;
		}
		if (otpInputs[3]) {
			verificationCode4 = otpInputs[3];
		} else {
			document.getElementById('verificationCode4')?.focus();
			onCodeInput();
			handleVerificationCode();
			return;
		}
		if (otpInputs[4]) {
			verificationCode5 = otpInputs[4];
		} else {
			document.getElementById('verificationCode5')?.focus();
			onCodeInput();
			handleVerificationCode();
			return;
		}
		if (otpInputs[5]) {
			verificationCode6 = otpInputs[5];
		} else {
			document.getElementById('verificationCode6')?.focus();
			onCodeInput();
			handleVerificationCode();
			return;
		}
		document.getElementById('verificationCode6')?.focus();
		onCodeInput();
		handleVerificationCode();
	}

	let selectedInput = '';
	const handleFocus = (inputId) => {
		selectedInput = inputId;
	};
	const handleBlur = () => {
		selectedInput = '';
	};
</script>

{#if isRegistered}
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

		<div style="margin-top:20px; display: flex ; flex-direction:column; align-items:center;">
			<p
				class="container-header sparrow-fw-600 text-whiteColor text-center ms-2 me-2 mb-1"
				style="font-size:24px; font-weight: 400;  line-height:28px; text-align:center;"
			>
			Complete Verification
			</p>
			<p class="" style="color: lightGray; font-size:14px;">We are almost there</p>
		</div>

		<div class="login-form text-lightGray ps-1 pe-1 gap-16">
			<div class="d-flex flex-column align-items-left mb-2">
				<div class="text-center sparrow-fs-14 sparrow-fs-300 mt-5">
					<p class="sparrow-fs-12">
						We have sent a verification code at <br />
						<span class="email-text">{emailText}</span>
					</p>
					<div>
						<div class="d-flex flex-column">
							<div class="d-flex mb-2 align-items-center justify-content-start" style="gap: 6px;">



								<div
									class="input-container {selectedInput === 'verificationCode1'
										? 'selected'
										: ''} {verificationCodeError ? 'error' : ''}"
								>
									<input
										type="text"
										autocorrect="off"
										autocapitalize="none"
										autocomplete="off"
										id="verificationCode1"
										disabled={seconds === 0}
										bind:value={verificationCode1}
										on:focus={() => handleFocus('verificationCode1')}
										on:blur={handleBlur}
										on:click={(e) => e.target.select()}
										on:input={(e) => {
											if (verificationCode1.length === 1) {
												document.getElementById('verificationCode2')?.focus();
												document.getElementById('verificationCode2')?.select();
											} else if (e.inputType === 'insertText' && verificationCode1.length > 1) {
												verificationCode1 = verificationCode1.charAt(1);
												document.getElementById('verificationCode2')?.focus();
												document.getElementById('verificationCode2')?.select();
											}
											onCodeInput();
										}}
										on:input={handleVerificationCode}
										on:paste={handlePaste}
									/>
									{#if selectedInput === 'verificationCode1'}
										<div class="line-icon">
											<img
												src={lineIcon}
												alt=""
												style="filter: invert(36%) sepia(70%) saturate(747%) hue-rotate(189deg) brightness(96%) contrast(101%);"
											/>
										</div>
									{/if}
								</div>

								<div
									class="input-container {selectedInput === 'verificationCode2'
										? 'selected'
										: ''} {verificationCodeError ? 'error' : ''}"
								>
									<input
										type="text"
										autocorrect="off"
										autocapitalize="none"
										autocomplete="off"
										id="verificationCode2"
										bind:value={verificationCode2}
										disabled={seconds === 0}
										on:focus={() => handleFocus('verificationCode2')}
										on:blur={handleBlur}
										on:click={(e) => e.target.select()}
										on:input={(e) => {
											if (verificationCode2.length === 1) {
												document.getElementById('verificationCode3')?.focus();
												document.getElementById('verificationCode3')?.select();
											} else if (e.inputType === 'insertText' && verificationCode2.length > 1) {
												verificationCode2 = verificationCode2.charAt(1);
												document.getElementById('verificationCode3')?.focus();
												document.getElementById('verificationCode3')?.select();
											}
											onCodeInput();
										}}
										on:keydown={(e) => {
											if (e.key === 'Backspace' && verificationCode2.length === 0) {
												document.getElementById('verificationCode1')?.focus();
											}
										}}
										on:input={handleVerificationCode}
										on:paste={handlePaste}
									/>
									{#if selectedInput === 'verificationCode2'}
										<div class="line-icon">
											<img
												src={lineIcon}
												alt=""
												style="filter: invert(36%) sepia(70%) saturate(747%) hue-rotate(189deg) brightness(96%) contrast(101%);"
											/>
										</div>
									{/if}
								</div>

								<div
									class="input-container {selectedInput === 'verificationCode3'
										? 'selected'
										: ''} {verificationCodeError ? 'error' : ''}"
								>
									<input
										type="text"
										autocorrect="off"
										autocapitalize="none"
										autocomplete="off"
										id="verificationCode3"
										bind:value={verificationCode3}
										disabled={seconds === 0}
										on:focus={() => handleFocus('verificationCode3')}
										on:blur={handleBlur}
										on:click={(e) => e.target.select()}
										on:input={(e) => {
											if (verificationCode3.length === 1) {
												document.getElementById('verificationCode4')?.focus();
												document.getElementById('verificationCode4')?.select();
											} else if (e.inputType === 'insertText' && verificationCode3.length > 1) {
												verificationCode3 = verificationCode3.charAt(1);
												document.getElementById('verificationCode4')?.focus();
												document.getElementById('verificationCode4')?.select();
											}
											onCodeInput();
										}}
										on:keydown={(e) => {
											if (e.key === 'Backspace' && verificationCode3.length === 0) {
												document.getElementById('verificationCode2')?.focus();
											}
										}}
										on:input={handleVerificationCode}
										on:paste={handlePaste}
									/>
									{#if selectedInput === 'verificationCode3'}
										<div class="line-icon">
											<img
												src={lineIcon}
												alt=""
												style="filter: invert(36%) sepia(70%) saturate(747%) hue-rotate(189deg) brightness(96%) contrast(101%);"
											/>
										</div>
									{/if}
								</div>

								<img src={lineIcon} alt="" />

								<div
									class="input-container {selectedInput === 'verificationCode4'
										? 'selected'
										: ''} {verificationCodeError ? 'error' : ''}"
								>
							
								<input
										type="text"
										autocorrect="off"
										autocapitalize="none"
										autocomplete="off"
										id="verificationCode4"
										bind:value={verificationCode4}
										disabled={seconds === 0}
										on:focus={() => handleFocus('verificationCode4')}
										on:blur={handleBlur}
										on:click={(e) => e.target.select()}
										on:input={(e) => {
											if (verificationCode4.length === 1) {
												document.getElementById('verificationCode5')?.focus();
												document.getElementById('verificationCode5')?.select();
											} else if (e.inputType === 'insertText' && verificationCode4.length > 1) {
												verificationCode4 = verificationCode4.charAt(1);
												document.getElementById('verificationCode5')?.focus();
												document.getElementById('verificationCode5')?.select();
											}
											onCodeInput();
										}}
										on:keydown={(e) => {
											if (e.key === 'Backspace' && verificationCode4.length === 0) {
												document.getElementById('verificationCode3')?.focus();
											}
										}}
										on:input={handleVerificationCode}
										on:paste={handlePaste}
									/>
									{#if selectedInput === 'verificationCode4'}
										<div class="line-icon">
											<img
												src={lineIcon}
												alt=""
												style="filter: invert(36%) sepia(70%) saturate(747%) hue-rotate(189deg) brightness(96%) contrast(101%);"
											/>
										</div>
									{/if}
								</div>

								<div
									class="input-container {selectedInput === 'verificationCode5'
										? 'selected'
										: ''} {verificationCodeError ? 'error' : ''}"
								>
									<input
										type="text"
										autocorrect="off"
										autocapitalize="none"
										autocomplete="off"
										id="verificationCode5"
										bind:value={verificationCode5}
										disabled={seconds === 0}
										on:focus={() => handleFocus('verificationCode5')}
										on:blur={handleBlur}
										on:click={(e) => e.target.select()}
										on:input={(e) => {
											if (verificationCode5.length === 1) {
												document.getElementById('verificationCode6')?.focus();
												document.getElementById('verificationCode6')?.select();
											} else if (e.inputType === 'insertText' && verificationCode5.length > 1) {
												verificationCode5 = verificationCode5.charAt(1);
												document.getElementById('verificationCode6')?.focus();
												document.getElementById('verificationCode6')?.select();
											}
											onCodeInput();
										}}
										on:keydown={(e) => {
											if (e.key === 'Backspace' && verificationCode5.length === 0) {
												document.getElementById('verificationCode4')?.focus();
											}
										}}
										on:input={handleVerificationCode}
										on:paste={handlePaste}
									/>
									{#if selectedInput === 'verificationCode5'}
										<div class="line-icon">
											<img
												src={lineIcon}
												alt=""
												style="filter: invert(36%) sepia(70%) saturate(747%) hue-rotate(189deg) brightness(96%) contrast(101%);"
											/>
										</div>
									{/if}
								</div>

								<div
									class="input-container {selectedInput === 'verificationCode6'
										? 'selected'
										: ''} {verificationCodeError ? 'error' : ''}"
								>
									<input
										type="text"
										autocorrect="off"
										autocapitalize="none"
										autocomplete="off"
										id="verificationCode6"
										bind:value={verificationCode6}
										disabled={seconds === 0}
										on:focus={() => handleFocus('verificationCode6')}
										on:blur={handleBlur}
										on:click={(e) => e.target.select()}
										on:input={(e) => {
											if (verificationCode6.length > 1) {
												verificationCode6 = verificationCode6.charAt(1);
											}
											onCodeInput();
										}}
										on:keydown={(e) => {
											if (e.key === 'Backspace' && verificationCode6.length === 0) {
												document.getElementById('verificationCode5')?.focus();
											}
										}}
										on:input={handleVerificationCode}
										on:paste={handlePaste}
									/>
									{#if selectedInput === 'verificationCode6'}
										<div class="line-icon">
											<img
												src={lineIcon}
												alt=""
												style="filter: invert(36%) sepia(70%) saturate(747%) hue-rotate(189deg) brightness(96%) contrast(101%);"
											/>
										</div>
									{/if}
								</div>

								
							</div>
							{#if verificationCodeError === true}
								<small class="form-text" style="color: #FE8C98;">
									{errorMessage}
								</small>
							{/if}
						</div>

						{#if showResendSuccess && seconds > 0}
							<div
								style=" display:flex; align-items:center; justify-content:center; background-color: #272E34; border-radius:6px; width:fit-content; padding:8px 16px; margin:30px auto;"
							>
								<CircleCheck height={'16px'} width={'16px'} color={'#00DF80'} />
								<p class="mb-0 ms-2">Code Resend successfully.</p>
							</div>
						{/if}

						{#if seconds > 0}
							<p class="mt-5 sparrow-fs-12" style="color: #CCCCCC; font-weight:400; ">
								Code will expire in {formatTime(seconds)}
							</p>
						{:else}
							<p class="mt-5 text-dangerColor">Code Expired.</p>
						{/if}
					</div>
				</div>

				<Button
				buttonStyleProp={"height:44px;"}
					disable={!seconds}
					title={'Verify Code'}
					buttonClassProp={'w-100 py-2 align-items-center d-flex justify-content-center sparrow-fs-16'}
					type={'primary'}
					loader={verifyCodeLoader}
					onClick={async () => {
						verifyCodeLoader = true;
						let response = await handleVerifyEmail(verifyCodeCredential);
						if (response?.isSuccessful) {
							isRegistered = true;
							const accessToken = response?.data.accessToken?.token;
							const refreshToken = response?.data.refreshToken?.token;
							const sparrowRedirect = `sparrow://?accessToken=${accessToken}&refreshToken=${refreshToken}&response=${JSON.stringify(response.data)}&event=register&method=email`;
							const sparrowWebRedirect =
								constants.SPARROW_WEB_URL +
								`?accessToken=${accessToken}&refreshToken=${refreshToken}&response=${JSON.stringify(response)}&event=register&method=email`;

							if (userFromDesktop === 'true') {
								let data = JSON.parse(window.atob(accessToken?.split('.')[1]));
								let firstName = data.name;
				                        firstName = firstName.split(' ')[0];
				                        firstName = firstName.length > 11 ? firstName.substring(0, 5) + "..." : firstName;
									redirectRules.title = `Welcome Back ${firstName}`;
								setTimeout(() => {
									redirectRules.description = `Redirecting you to desktop app...`;
									redirectRules.message = `the token if you are facing any issue in redirecting to the login page`;
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
								}, 5000);
							} else {
								navigate(sparrowWebRedirect);
							}
						}

						verifyCodeLoader = false;
					}}
				/>
			</div>

			<div class="d-flex gap-3 align-items-center justify-content-center mt-3">
				<p style="font-size: 13px; text-align:center; line-height:15px;" class="mb-0">
					If you haven't received the code, <br />
					click on the link in the mail or
					<span
						on:click={handleResend}
						style="font-size: 13px; color:#3670F7;"
						class="cursor-pointer text-decoration-none"
						class:disabled={isResendDisabled}
					>
						Resend code
					</span>
				</p>
			</div>
		</div>
		<div class="mt-4">
			<SupportHelp />
		</div>
	</BgContainer>
{/if}

<style>
	input {
		background-color: transparent;
	}
	.cursor-pointer {
		cursor: pointer;
	}
	input:disabled {
		background-color: transparent;
		border-color: #62636c !important;
		opacity: 0.7;
	}
	.input-container {
		position: relative;
		width: 41px;
		height: 54px;
		background-color: transparent;
		border: 1px solid #62636c;
		border-radius: 5px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.input-container.selected {
		border-color: #3670f7;
	}
	.input-container.error {
		border-color: #fe8c98;
	}
	.input-container input {
		width: 100%;
		height: 45px;
		outline: none;
		border: none;
		background-color: transparent;
		color: white;
		text-align: center;
		caret-color: transparent;
		font-size: 22px;
	}
	.line-icon {
		position: absolute;
		bottom: 0;
		width: 100%;
		text-align: center;
	}
	.email-text {
		display: inline-block;
		max-width: 260px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.disabled {
		pointer-events: none;
		opacity: 0.5;
	}
</style>
