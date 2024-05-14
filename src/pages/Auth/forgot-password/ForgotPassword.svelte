<script lang="ts">
	import starIcon from '$lib/assets/starIcon.svg';

	import { handleForgotPassword, handleForgotPasswordValidation } from './forgot-password';
	import sparrowicon from '$lib/assets/logoSparrowSquare.svg';

	import {  navigate } from 'svelte-navigator';
	import { notifications } from '$lib/components/toast-notification/ToastNotification';
	import Button from '$lib/components/button/Button.svelte';

	let validationErrors: any = {};

	let forgotPasswordCredential = {
		email: ''
	};
	let responseError = "";
	let isEmailTouched = false;
	let forgotPasswordLoader = false;
</script>

<div class="parent d-flex align-items-center justify-content-center text-white rounded">
	<div
		class="position-relative overflow-hidden auth-content rounded-4 container d-flex flex-column align-items-center justify-content-center w-100"
	>
		<div style="position: absolute; top: 0; left: 0; height: 100%; width: 100%; background: var(--bg-container);
			backdrop-filter: blur( 50px );
			-webkit-backdrop-filter: blur( 50px );border: 1px solid var(--bg-container-border);
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
				class="container-header pt-4 pb-3 sparrow-fs-28 text-whiteColor text-center ms-2 me-2 fw-bold"
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
								if(response.message === "Bad Request"){
									responseError= "Email Id is not registered."
								}
								else{
									notifications.error(response?.message);
								}
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
								responseError = "";
							}}
						/>
						{#if validationErrors?.email && isEmailTouched}
							<small class="form-text text-dangerColor"> {validationErrors?.email}</small>
							{:else if responseError}
							<small class="form-text text-dangerColor"> {responseError}</small>
							
						{/if}
					</div>
					<div class="sendButton">
						<button class="btn btn-primary text-whiteColor w-100">Send Request</button>
					</div>
				</form>
			</div>
		</div>
</div>
<style>
	.parent {
		min-height: 100vh;
		overflow: auto;
	}
	.auth-content {
		margin: 30px !important;
		max-width: 504px;
		padding: 48px 48px 64px 48px !important;
	}
	input {
		background-color: transparent;
	}
</style>
