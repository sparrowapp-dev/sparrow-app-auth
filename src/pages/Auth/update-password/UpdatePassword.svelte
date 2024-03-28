<script lang="ts">
	import lineIcon from '$lib/assets/line.svg';
	import starIcon from '$lib/assets/starIcon.svg';
	import { errorMessageText, isLoading, username } from '$lib/store/auth.store';
	import { handleVerifyEmail, isSuccessfulResponse } from './update-password';
	import sparrowicon from '$lib/assets/sparrow-icon-bg.svg';
	import { writable } from 'svelte/store';
	import { onDestroy, onMount } from 'svelte';
	import { Link, navigate } from 'svelte-navigator';
	import { notifications } from '$lib/components/toast-notification/ToastNotification';
	import { forgotPassword } from '$lib/services/auth.service';
	import Spinner from '$lib/components/transition/Spinner.svelte';
	import Button from '$lib/components/button/Button.svelte';
	export let id: string;

	let seconds = 0;
	const verifyString = writable('');
	let verifyLength: string = '';

	let timer: number;
	const calculateRemainingTime = () => {
		const currentTime = new Date().getTime();
		const storedTime = parseInt(localStorage.getItem(`timer-${id}`));
		if (storedTime) {
			const elapsedTime = storedTime ? Math.floor((currentTime - storedTime) / 1000) : 0;
			const remainingTime = Math.max(60 - elapsedTime, 0);
			return remainingTime;
		} else {
			return 0;
		}
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
		resentCodeLoader = true;
		const response = await forgotPassword({ email: id });
		if (response.isSuccessful) {
			notifications.success('Verification code sent successfully');
			localStorage.setItem(`timer-${id}`, new Date().getTime());
			startTimer();
		} else {
			notifications.error(response.message);
		}
		resentCodeLoader = false;
	};
	const onCodeInput = () => {
		errorMessageText.set('');
		isSuccessfulResponse.set(false);
	};
	let verifyCodeLoader = false;
	onDestroy(() => {
		onCodeInput();
	});

	function handlePaste(event) {
		event.preventDefault();
		const clipboardData = event?.clipboardData || window?.clipboardData;
		const pastedText = clipboardData.getData('text').trim().slice(0, 6); // Considering you have 6 input fields

		// Update the values in the array
		const otpInputs = pastedText.split('');

		// Update the input fields
		if (otpInputs[0]) {
			verificationCode1 = otpInputs[0];
		}
		if (otpInputs[1]) {
			verificationCode2 = otpInputs[1];
		}
		if (otpInputs[2]) {
			verificationCode3 = otpInputs[2];
		}
		if (otpInputs[3]) {
			verificationCode4 = otpInputs[3];
		}
		if (otpInputs[4]) {
			verificationCode5 = otpInputs[4];
		}
		if (otpInputs[5]) {
			verificationCode6 = otpInputs[5];
		}
		onCodeInput();
		handleVerificationCode();
	}
</script>

<div class="parent d-flex align-items-center justify-content-center text-white rounded">
	<div
		class="auth-content rounded container d-flex flex-column align-items-center justify-content-center w-100"
	>
		<div class="text-white d-flex justify-content-center align-items-center">
			<img src={sparrowicon} width="60px" alt="" class="" />
		</div>
		<p
			class="container-header pt-4 pb-5 sparrow-fs-28 text-whiteColor text-center ms-2 me-2 fw-bold"
		>
			Welcome to Sparrow!
		</p>
		<div class="login-form text-lightGray ps-1 pe-1 gap-16">
			<div class="d-flex flex-column align-items-left mb-2">
				<div class="d-flex align-items-center mb-3 gap-3">
					<p class="text-whiteColor sparrow-fs-20 mb-0">Change Password</p>
				</div>

				<div style="font-size: 15px;">
					<p>
						To ensure that this is really you, we have sent a verification code to your email

						<span class="fw-bold text-whiteColor cursor-pointer">{emailText}</span>
					</p>
					{#if seconds > 0}
						<div class="d-flex flex-column">
							<div class="d-flex align-items-center">
								<p class="mb-1 sparrow-fs-14">Verification Code</p>
								<img src={starIcon} alt="" class="mb-2 ms-1" style="width: 7px;" />
							</div>
							<div
								class="d-flex mb-2 align-items-center justify-content-start"
								style="padding: 6px, 12px, 6px, 12px;border-radius: 4px;border: 1px;gap:8px"
							>
								<input
									type="text"
									autocorrect="off"
									autocapitalize="none"
									autocomplete="off"
									id="verificationCode1"
									class="form-control text-center rounded fs-5 border:{verificationCodeError ===
									true
										? '3px'
										: '1px'} solid {verificationCodeError === true
										? 'border-error'
										: 'border-default'}"
									style="width:48px;height:36px;border-none"
									bind:value={verificationCode1}
									on:input={(e) => {
										if (verificationCode1.length === 1) {
											document.getElementById('verificationCode2')?.focus();
										} else if (e.inputType === 'insertText' && verificationCode1.length > 1) {
											verificationCode1 = verificationCode1.charAt(0);
											verificationCode2 = e.data;
											document.getElementById('verificationCode2')?.focus();
										}
										onCodeInput();
									}}
									on:input={handleVerificationCode}
									on:paste={handlePaste}
								/>
								<img src={lineIcon} alt="" />
								<input
									type="text"
									autocorrect="off"
									autocapitalize="none"
									autocomplete="off"
									id="verificationCode2"
									style="width:48px;height:36px;"
									class="form-control text-center rounded fs-5 border:{verificationCodeError ===
									true
										? '3px'
										: '1px'} solid {verificationCodeError === true
										? 'border-error'
										: 'border-default'}"
									bind:value={verificationCode2}
									on:input={(e) => {
										if (e.inputType === 'deleteContentBackward' && verificationCode2.length === 0) {
											verificationCode2 = '';
										} else if (verificationCode2.length === 1) {
											document.getElementById('verificationCode3')?.focus();
										} else if (e.inputType === 'insertText' && verificationCode2.length > 1) {
											verificationCode2 = verificationCode2.charAt(0);
											verificationCode3 = e.data;
											document.getElementById('verificationCode3')?.focus();
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
								<img src={lineIcon} alt="" />
								<input
									type="text"
									autocorrect="off"
									autocapitalize="none"
									autocomplete="off"
									id="verificationCode3"
									style="width:48px;height:36px;"
									class="form-control text-center rounded fs-5 border:{verificationCodeError ===
									true
										? '3px'
										: '1px'} solid {verificationCodeError === true
										? 'border-error'
										: 'border-default'}"
									bind:value={verificationCode3}
									on:input={(e) => {
										if (e.inputType === 'deleteContentBackward' && verificationCode3.length === 0) {
											verificationCode3 = '';
										} else if (verificationCode3.length === 1) {
											document.getElementById('verificationCode4')?.focus();
										} else if (e.inputType === 'insertText' && verificationCode3.length > 1) {
											verificationCode3 = verificationCode3.charAt(0);
											verificationCode4 = e.data;
											document.getElementById('verificationCode4')?.focus();
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
								<img src={lineIcon} alt="" />
								<input
									type="text"
									autocorrect="off"
									autocapitalize="none"
									autocomplete="off"
									id="verificationCode4"
									style="width:48px;height:36px;"
									class="form-control text-center rounded fs-5 border:{verificationCodeError ===
									true
										? '3px'
										: '1px'} solid {verificationCodeError === true
										? 'border-error'
										: 'border-default'}"
									bind:value={verificationCode4}
									on:input={(e) => {
										if (e.inputType === 'deleteContentBackward' && verificationCode4.length === 0) {
											verificationCode4 = '';
										} else if (verificationCode4.length === 1) {
											document.getElementById('verificationCode5')?.focus();
										} else if (e.inputType === 'insertText' && verificationCode4.length > 1) {
											verificationCode4 = verificationCode4.charAt(0);
											verificationCode5 = e.data;
											document.getElementById('verificationCode5')?.focus();
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
								<img src={lineIcon} alt="" />
								<input
									type="text"
									autocorrect="off"
									autocapitalize="none"
									autocomplete="off"
									id="verificationCode5"
									style="width:48px;height:36px; "
									class="form-control text-center rounded fs-5 border:{verificationCodeError ===
									true
										? '3px'
										: '1px'} solid {verificationCodeError === true
										? 'border-error'
										: 'border-default'}"
									bind:value={verificationCode5}
									on:input={(e) => {
										if (e.inputType === 'deleteContentBackward' && verificationCode5.length === 0) {
											verificationCode5 = '';
										} else if (verificationCode5.length === 1) {
											document.getElementById('verificationCode6')?.focus();
										} else if (e.inputType === 'insertText' && verificationCode5.length > 1) {
											verificationCode5 = verificationCode5.charAt(0);
											verificationCode6 = e.data;
											document.getElementById('verificationCode6')?.focus();
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
								<img src={lineIcon} alt="" />
								<input
									type="text"
									autocorrect="off"
									autocapitalize="none"
									autocomplete="off"
									id="verificationCode6"
									style="width:48px;height:36px;"
									class="form-control text-center rounded fs-5 border:{verificationCodeError ===
									true
										? '3px'
										: '1px'} solid {verificationCodeError === true
										? 'border-error'
										: 'border-default'}"
									bind:value={verificationCode6}
									on:input={(e) => {
										if (e.inputType === 'deleteContentBackward' && verificationCode6.length === 0) {
											verificationCode6 = '';
										} else if (verificationCode6.length === 1) {
											document.getElementById('verificationCode7')?.focus();
										} else if (verificationCode6.length > 1) {
											verificationCode6 = verificationCode6.charAt(0);
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
							</div>
							{#if verificationCodeError === true}<small class="form-text text-dangerColor"
									>{errorMessage === 'Unauthorized Access'
										? 'You have entered wrong code, please check your email.'
										: errorMessage}</small
								>
							{/if}
						</div>
					{/if}

					{#if seconds > 0}
						<p>
							The verification code will expire in <span class="fw-bold text-dangerColor"
								>{seconds} seconds</span
							>
						</p>
					{:else}
						<p class="fw-bold text-dangerColor">Verification code expired</p>
					{/if}
					{#if seconds > 0}
						<p>
							If your email ID is registered with us then you would have received an email in your
							inbox with verification code.
						</p>
					{:else}
						<p>Please try again to reset your password.</p>
					{/if}
				</div>
				{#if seconds > 0}
					<Button
						disable={verifyCodeLoader}
						title={'Verify'}
						buttonClassProp={'w-100 py-2 align-items-center d-flex justify-content-center sparrow-fs-16'}
						type={'primary-gradient'}
						loader={verifyCodeLoader}
						onClick={async () => {
							verifyCodeLoader = true;
							validationErrors = await handleVerifyEmail(verifyCodeCredential);
							verifyCodeLoader = false;
						}}
					/>
				{:else}
					<Button
						onClick={() => {
							navigate('/forgot/password');
						}}
						title={'Go Back'}
						buttonClassProp={'w-100 py-2 align-items-center d-flex justify-content-center sparrow-fs-16'}
						type={'primary-gradient'}
					/>
				{/if}
			</div>

			{#if seconds > 0}
				<div class="d-flex gap-3 align-items-center">
					<p style="font-size: 13px;" class="mb-0">No email in your inbox or spam folder?</p>
					{#if !resentCodeLoader}
						<span
							on:click={handleResend}
							style="font-size: 13px;"
							class="cursor-pointer text-decoration-none text-primaryColor fw-bold"
							>Resend
						</span>
					{:else}
						<Spinner size={'12px'} />
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.btn-primary {
		background: linear-gradient(270deg, #6147ff -1.72%, #1193f0 100%);
	}
	.parent {
		min-height: 100vh;
		overflow: auto;
	}
	.auth-content {
		margin: 30px !important;
		background: linear-gradient(to bottom, rgba(51, 51, 51, 0.16), rgba(42, 42, 51, 1));
		max-width: 504px;
		padding: 48px 48px 64px 48px !important;
	}
	input {
		background-color: transparent;
	}
	.cursor-pointer {
		cursor: pointer;
	}
</style>
