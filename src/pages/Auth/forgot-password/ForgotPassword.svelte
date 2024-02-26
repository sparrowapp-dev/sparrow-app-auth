<script lang="ts">
	import starIcon from '$lib/assets/starIcon.svg';

	import { handleForgotPassword, handleForgotPasswordValidation } from './forgot-password';
	import sparrowicon from '$lib/assets/sparrow-icon-bg.svg';

	import {  navigate } from 'svelte-navigator';
	import { notifications } from '$lib/components/toast-notification/ToastNotification';

	let validationErrors: any = {};

	let forgotPasswordCredential = {
		email: ''
	};

	let isEmailTouched = false;
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
			<form
				class="login-form text-whiteColor ps-1 pe-1 gap-16"
				on:submit|preventDefault={async () => {
					isEmailTouched = true;
					validationErrors = await handleForgotPasswordValidation(forgotPasswordCredential);
					if(!validationErrors?.email){
						const response  = await handleForgotPassword(forgotPasswordCredential);
						if (response?.isSuccessful) {
							navigate(`/update/password/${forgotPasswordCredential.email}`);
						} else {
							notifications.error(response?.message);
						}
					}
				}}
			>
				<div class="d-flex flex-column align-items-left justify-content-center mb-2">
					<div class="d-flex align-items-center justify-content-start mb-3 gap-3">
						<p class="text-whiteColor sparrow-fs-20  mb-0">Change Password</p>
					</div>
					<p class="text-lightGray">
						Please enter your Email ID so that we can send you a verification code to process your
						request.
					</p>
				</div>
				<div class="mb-3">
					<label for="exampleInputEmail1" class="form-label text-red sparrow-fs-14">Email</label>
					<img src={starIcon} alt="" class="mb-3" />
					<input
						type="email"
						class="form-control sparrow-fs-16 border:{validationErrors?.email && isEmailTouched
							? '3px'
							: '1px'} solid {validationErrors?.email && isEmailTouched ? 'border-error' : 'border-default'}"
						id="exampleInputEmail1"
						aria-describedby="emailHelp"
						placeholder="Please enter your registered email id"
						autocorrect="off"
						autocapitalize="none"
						autocomplete="off"
						bind:value={forgotPasswordCredential.email}
						on:blur={async()=>{
							isEmailTouched = true;
							validationErrors = await handleForgotPasswordValidation(forgotPasswordCredential);
						}}
						on:input={async()=>{
							validationErrors = await handleForgotPasswordValidation(forgotPasswordCredential);
						}}
					/>
					{#if validationErrors?.email && isEmailTouched}
						<small class="form-text text-dangerColor"> {validationErrors?.email}</small>
					{/if}
				</div>
				<div class="sendButton">
					<button class="btn btn-primary text-whiteColor w-100">Send Request</button>
				</div>
			</form>
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
</style>
