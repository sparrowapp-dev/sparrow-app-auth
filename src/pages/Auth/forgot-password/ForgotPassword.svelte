<script lang="ts">
	import starIcon from '$lib/assets/starIcon.svg';
	import AngleUp from '$lib/assets/angle-up.svelte';
	import BgContainer from '$lib/components/bgContainer/BgContainer.svelte';
	import { handleForgotPassword, handleForgotPasswordValidation } from './forgot-password';
	import sparrowicon from '$lib/assets/logoSparrowSquare.svg';

	import {  navigate } from 'svelte-navigator';
	import { notifications } from '$lib/components/toast-notification/ToastNotification';
	import Button from '$lib/components/button/Button.svelte';
	import AiSparkle from '$lib/assets/AiSparkle.svelte';
	import SupportHelp from '$lib/components/help/SupportHelp.svelte';

	let validationErrors: any = {};

	let forgotPasswordCredential = {
		email: ''
	};
	let responseError = "";
	let isEmailTouched = false;
	let forgotPasswordLoader = false;
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

	<div style="display: flex ; flex-direction:column; align-items:center; margin-bottom:44px;">
		<p
			class="container-header sparrow-fw-600 text-whiteColor text-center ms-2 me-2 mb-1"
			style="font-size:24px; font-weight: 400; padding-top:20px; line-height:28px; text-align:center;"
		>
			Forgot Password?
		</p>
		<p class="" style="color: lightGray; font-size:12px;">Let us help you</p>
	</div>

	<form
		class="login-form text-whiteColor ps-1 pe-1 gap-16 w-100"
		on:submit|preventDefault={async () => {
			isEmailTouched = true;
			validationErrors = await handleForgotPasswordValidation(forgotPasswordCredential);
			if(!validationErrors?.email){
				forgotPasswordLoader = true;
				const response  = await handleForgotPassword(forgotPasswordCredential);
				if (response?.isSuccessful) {
					localStorage.setItem(`timer-${forgotPasswordCredential.email}`, new Date().getTime());
					navigate(`/update/password/${forgotPasswordCredential.email}`);
					notifications.success("Verification code has been sent to your registered Email ID. ")
				} else {
					if(response.message === "Bad Request"){
						responseError= "Email ID is not registered."
					}
					else{
						notifications.error(response?.message);
					}
				}
				forgotPasswordLoader = false;
			}
		}}
	>
	
		<div class="mb-3">
			<div>
				<label for="exampleInputEmail1" class="form-label text-colorWhite sparrow-fs-14 d-flex">Email ID<p class="ms-1 mb-0 sparrow-fw-600 text-dangerColor">*</p></label>
			</div>
			<input
				type="email"
				class="form-control sparrow-fs-16 border:{validationErrors?.email && isEmailTouched
					? '3px'
					: '1px'} solid {validationErrors?.email && isEmailTouched ? 'border-error' : 'border-default'}"
				id="exampleInputEmail1"
				aria-describedby="emailHelp"
				placeholder="Enter your registered email ID"
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
			<Button
						disable={forgotPasswordLoader}
						title={"Send code"}
						buttonClassProp={"w-100 py-2 align-items-center d-flex justify-content-center sparrow-fs-16"}
						type={"primary"}
						loader={forgotPasswordLoader}
				  	/>
		</div>


		<div class="d-flex align-items-start ms-1 mt-2">
			<div style="height: 24px; width:24px;">
				<AiSparkle height={'24px'} width={'24px'} />
			</div>
			<p class="text-center pt-1 mb-0" style="font-size:12px; color: #CCCCCCE5;">
				Enter you email ID to receive a verification code
			</p>
		</div>


		<div class="mt-4">
			<SupportHelp/>
		</div>


	</form>
</BgContainer>
<style>
	input {
		background-color: transparent;
	}
</style>
