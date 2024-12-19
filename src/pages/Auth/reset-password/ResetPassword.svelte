<script lang="ts">
	import vector1 from '$lib/assets/Vector1.svg';
	import vector2 from '$lib/assets/Vector2.svg';
	import vector3 from '$lib/assets/Vector3.svg';
	import starIcon from '$lib/assets/starIcon.svg';
	import { handleResetPassword } from './reset-password';
	import eyeHide from '$lib/assets/eye-hide.svg';
	import eyeShow from '$lib/assets/eye-show.svg';
	import sparrowicon from '$lib/assets/logoSparrowSquare.svg';
	import { navigate } from 'svelte-navigator';
	import { notifications } from '$lib/components/toast-notification/ToastNotification';
	import Button from '$lib/components/button/Button.svelte';
	import BgContainer from '$lib/components/bgContainer/BgContainer.svelte';
	import AngleUp from '$lib/assets/angle-up.svelte';
	import SupportHelp from '$lib/components/help/SupportHelp.svelte';
	export let id = "";
	export let code = "";

	let resetPasswordCredential = {
		email: id || '',
		newPassword: '',
		verificationCode: code || ''
	};

	let isPasswordValid1 = false;
	let isPasswordValid2 = false;
	let isPasswordValid3 = false;
	let isPasswordTouched = false;

	const validatePassword = () => {
		const password = resetPasswordCredential.newPassword;
		isPasswordValid1 = isValidPassword1(password);
		isPasswordValid2 = isValidPassword2(password);
		isPasswordValid3 = isValidPassword3(password);
	};

	const isValidPassword1 = (password: string) => {
		if (password.length >= 8) {
			return (isPasswordValid1 = true);
		}
		return (isPasswordValid1 = false);
	};

	const isValidPassword2 = (password: string) => {
		if (/(?=.*[0-9])/.test(password)) {
			return (isPasswordValid2 = true);
		}
		return (isPasswordValid2 = false);
	};

	const isValidPassword3 = (password: string) => {
		if (/(?=.*[!@#$%^&*])/.test(password)) {
			return (isPasswordValid3 = true);
		}
		return (isPasswordValid3 = false);
	};

	let isPasswordVisible = false;

	const togglePasswordVisibility = () => {
		isPasswordVisible = !isPasswordVisible;
		const passwordInput = document.getElementById('newpassword') as HTMLInputElement | null;
		if (passwordInput) {
			passwordInput.type = isPasswordVisible ? 'text' : 'password';
		}
	};
	let resetPasswordLoader = false;

	let confirmPassword = '';
	let isConfirmPasswordVisible = false;
	let doPasswordsMatch = false;
	let isConfirmPasswordTouched = false;

	const validateConfirmPassword = () => {
		doPasswordsMatch = confirmPassword === resetPasswordCredential.newPassword;
	};

	const toggleConfirmPasswordVisibility = () => {
		isConfirmPasswordVisible = !isConfirmPasswordVisible;
		const confirmPasswordInput = document.getElementById('confirmpassword') as HTMLInputElement | null;
		if (confirmPasswordInput) {
			confirmPasswordInput.type = isConfirmPasswordVisible ? 'text' : 'password';
		}
	};
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

	<div style="margin-top:20px; display: flex ; flex-direction:column; align-items:center;">
		<p
			class="container-header sparrow-fw-600 text-whiteColor text-center ms-2 me-2 mb-1"
			style="font-size:24px; font-weight: 400;  line-height:28px; text-align:center;"
		>
		New Password
		</p>
		<p class="" style="color: lightGray; font-size:14px;">Let’s create new password</p>
	</div>


	<form
		class="register-form text-whiteColor w-100 ps-1 pe-1 gap-16"
		novalidate
		on:submit|preventDefault={async () => {
			isPasswordTouched = true;
			isConfirmPasswordTouched = true;
			validatePassword();
			validateConfirmPassword();
			if (isPasswordValid1 && isPasswordValid2 && isPasswordValid3 && doPasswordsMatch) {
				resetPasswordLoader = true;
				const response = await handleResetPassword(resetPasswordCredential);
				if (response.isSuccessful) {
					notifications.success("Password changed successfully");
					localStorage.setItem(
							`timer-reset-password-redirect-${id}`,
							new Date().getTime()
						);
					navigate(`/password-update-redirect/${id}`);
				} else {
				if (response.message === "Unauthorized Access") {
					notifications.error("Old Password and New Password cannot be same");
				}
				else{
					notifications.error(response.message);
				}
				}
				resetPasswordLoader = false;
			}
		}}
	>
		

		<div class="form-group mb-1 text-colorWhite">
			<div>
				<label for="password" class=" d-flex" style="font-size: 12px;">Create Password
					<p class="ms-1 mb-0 sparrow-fw-600 text-dangerColor">*</p>
				</label>
				
			</div>
			<div class="d-flex position-relative mt-2">
				<input
				style="border-radius: 6px; border:1px solid #62636C; padding:8px"
					class="form-control sparrow-fs-16 pe-5 border:{(!isPasswordValid1 || !isPasswordValid2 || !isPasswordValid3) &&
						isPasswordTouched
						? '3px'
						: '1px'} solid {(!isPasswordValid1 || !isPasswordValid2 || !isPasswordValid3) &&
						isPasswordTouched
						? 'border-error'
							: 'border-default'}"
					type="password"
					autocorrect="off"
					autocapitalize="none"
					autocomplete="off"
					name="password"
					id="newpassword"
					placeholder="eg: password@123"
					bind:value={resetPasswordCredential.newPassword}
					on:blur={() => {
						isPasswordTouched = true;
						validatePassword();
					}}
					on:input={validatePassword}
					maxlength="32"
				/>
				<button
					type="button"
					on:click={togglePasswordVisibility}
					class=" border-0 position-absolute eye-icon d-flex align-items-center"
				>
					{#if isPasswordVisible}
						<img height="18px" width="18px" src={eyeShow} alt="eye-show" />
					{:else}
							<img height="18px" width="18px" src={eyeHide} alt="eye-hie" />
					{/if}
				</button>
			</div>
		</div>

		<div class="row">
			<div class="col-12 col-md-12 col-lg-12">
				<div class="d-flex gap-1 flex-column align-items-start mt-1 text-sm" style="font-size: 13px;">
					<div class="d-flex align-items-center mb-0 gap-2">
						<img
						src={isPasswordValid1 ? vector2 : isPasswordTouched ? vector3 : vector1}
							alt=""
							class="mr-2"
						/>
						<p
						class="mb-0 {isPasswordValid1
							? 'text-successColor'
							: isPasswordTouched
								? 'text-dangerColor'
								: 'text-textColor'}"
						>
							Min 8 characters
						</p>
					</div>
					<div class="d-flex align-items-center mb-0 gap-2">
						<img
							src={isPasswordValid2 ? vector2 : isPasswordTouched ? vector3 : vector1}
							alt=""
							class="mr-2"
						/>
						<p
							class="mb-0 {isPasswordValid2
								? 'text-successColor'
								: isPasswordTouched
									? 'text-dangerColor'
									: 'text-textColor'}"
						>
							Has at least one number
						</p>
					</div>
					<div class="d-flex align-items-center gap-2">
						<img
							src={isPasswordValid3 ? vector2 : isPasswordTouched ? vector3 : vector1}
							alt=""
							class="mr-2"
						/>
						<p
							class="mb-0 {isPasswordValid3
								? 'text-successColor'
								: isPasswordTouched
									? 'text-dangerColor'
									: 'text-textColor'}"
						>
							Has at least one special character
						</p>
					</div>
				</div>
			</div>
		</div>



		<div class="form-group mb-1 mt-3 text-colorWhite">
			<div>
				<label for="confirmpassword" class="sparrow-fs-12 d-flex">Confirm Password
					<p class="ms-1 mb-0 sparrow-fw-600 text-dangerColor">*</p>
				</label>
			</div>
			<div class="d-flex position-relative mt-2">
				<input
				    style="border-radius: 6px; border:1px solid #62636C; padding:8px"
					class="form-control sparrow-fs-16 pe-5 border:{(!doPasswordsMatch && isConfirmPasswordTouched) ? '3px' : '1px'} solid {!doPasswordsMatch && isConfirmPasswordTouched ? 'border-error' : 'border-default'}"
					type="password"
					autocorrect="off"
					autocapitalize="none"
					autocomplete="off"
					name="confirmpassword"
					id="confirmpassword"
					bind:value={confirmPassword}
					placeholder="Please confirm your password"
					on:blur={() => {
						isConfirmPasswordTouched = true;
						validateConfirmPassword();
					}}
					on:input={validateConfirmPassword}
					maxlength="32"
				/>
				<button
					type="button"
					on:click={toggleConfirmPasswordVisibility}
					class="border-0 position-absolute eye-icon d-flex align-items-center"
				>
					{#if isConfirmPasswordVisible}
							<img height="18px" width="18px" src={eyeShow} alt="eye-show" />
					{:else}
							<img height="18px" width="18px" src={eyeHide} alt="eye-hie" />
					{/if}
				</button>
			</div>
			{#if !doPasswordsMatch && isConfirmPasswordTouched}
				<small style="color: #FE8C98; font-size: 12px;">Password doesn't match</small>
			{/if}
		</div>



		<div class="mt-4">
			<Button
						disable={resetPasswordLoader}
						title={"Update Password"}
						buttonClassProp={"w-100 py-2 align-items-center d-flex justify-content-center sparrow-fs-16"}
						type={"primary"}
						loader={resetPasswordLoader}
				  	/>
		</div>

		<div style="margin-top: 24px;">
			<SupportHelp/>
		</div>
	</form>
</BgContainer>

		<!-- {#if showModal}
      <div
        class="modal fade show d-flex align-items-center"
        tabindex="-1"
        role="dialog"
        style="display: block;"
        aria-modal="true"
      >
        <div class="modal-dialog" role="document" style="margin: auto;">
          <div class="modal-content">
            <div
              class="modal-header d-flex flex-column align-items-center justify-content-center"
            >
              <div
                class="d-flex flex-column align-items-center justify-content-center"
              >
                <img src={sparrowicon} alt="" />
                <h5 class="modal-title fw-bold">Welcome back Kashif!</h5>
              </div>
            </div>
            <div class="modal-body">
              <p style="font: 300;font-size:14px;">
                Easily document and manage APIs for seamless collaboration
                between frontend and backend teams. Get started now to simplify
                your development workflows.
              </p>
              <div>
                <Welcome />
              </div>
            </div>
            <div
              class="modal-footer d-flex align-items-center justify-content-center"
            >
              <button
                type="button"
                class="btn btn-primary"
                on:click={() => (showModal = false)}>Continue</button
              >
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show" />
    {/if} -->

<style>

	.eye-icon {
		right: 5px;
		top: 50%;
    	transform: translateY(-50%);
		background-color: transparent;
	}
	input {
		background-color: transparent;
	}
	/* Add these styles for placeholder */
	input::placeholder {
		color: #62636C !important;
		font-size: 14px !important;
		font-weight: 400 !important;
		opacity: 1; /* Firefox requires this */
	}
	input:-ms-input-placeholder { /* Internet Explorer 10-11 */
		color: #62636C !important;
		font-size: 12px !important;
	}
	input::-ms-input-placeholder { /* Microsoft Edge */
		color: #62636C !important;
		font-size: 12px !important;
	}
	
</style>
