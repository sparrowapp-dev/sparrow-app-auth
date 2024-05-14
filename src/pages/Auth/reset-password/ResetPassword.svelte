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
</script>

<div class="parent d-flex align-items-center justify-content-center text-white rounded">
	<div
		class="auth-content position-relative overflow-hidden rounded-4 container d-flex flex-column align-items-center justify-content-center w-100"
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
				class="container-header pt-4 pb-4 sparrow-fs-28 text-whiteColor text-center ms-2 me-2 fw-bold"
			>
				Welcome to Sparrow!
			</p>
			<form
				class="register-form text-whiteColor w-100 ps-1 pe-1 gap-16"
				novalidate
				on:submit|preventDefault={async () => {
					isPasswordTouched = true;
					validatePassword();
					if (isPasswordValid1 && isPasswordValid1 && isPasswordValid1) {
						const response = await handleResetPassword(resetPasswordCredential);
						if (response.isSuccessful) {
							notifications.success("Password changed successfully");
							navigate("/login");
						} else {
						if (response.message === "Unauthorized Access") {
							notifications.error("Old Password and New Password cannot be same");
						}
						else{
							notifications.error(response.message);
						}
						}
					}
				}}
			>
				<div class="d-flex align-items-center gap-2 mb-2">
					<p class="card-subtitle sparrow-fs-20">Reset Password & Sign In</p>
				</div>

				<div class="text-lightGray gap-0 line-height-1">
					<p>{resetPasswordCredential.email}</p>
				</div>

				<div class="form-group mb-1 text-lightGray">
					<div>
						<label for="password" class="sparrow-fs-16">New Password</label>
						<img src={starIcon} alt="" class="mb-3" style="width: 7px;" />
					</div>
					<div class="d-flex position-relative">
						<input
							class="form-control mt-1 sparrow-fs-16 pe-5 border:{(!isPasswordValid1 || !isPasswordValid2 || !isPasswordValid3) &&
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
							placeholder="Please enter your new password"
							bind:value={resetPasswordCredential.newPassword}
							on:blur={() => {
								isPasswordTouched = true;
								validatePassword();
							}}
							on:input={validatePassword}
						/>
						<button
							type="button"
							on:click={togglePasswordVisibility}
							class=" border-0 position-absolute eye-icon d-flex align-items-center"
						>
							{#if isPasswordVisible}
								<img src={eyeShow} alt="eye-show" />
							{:else}
								<img src={eyeHide} alt="eye-hie" />
							{/if}
						</button>
					</div>
				</div>

				<div class="row">
					<div class="col-12 col-md-12 col-lg-12">
						<div class="d-flex flex-column align-items-start mt-1 text-sm" style="font-size: 13px;">
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

				<div class="mt-4">
					<button class="btn btn-primary w-100 text-whiteColor border-0">Submit</button>
				</div>
			</form>
		</div>

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
	</div>
</div>

<style>
	.btn-primary {
		background: linear-gradient(270deg, #6147ff -1.72%, #1193f0 100%);
	}
	.eye-icon {
		top: 10px;
		right: 5px;
		background-color: transparent;
	}
	.parent {
		min-height: 100vh;
		overflow: auto;
	}
	.auth-content {
		margin: 30px !important;
		max-width: 504px;
		padding: 48px !important;
	}
	input {
		background-color: transparent;
	}
</style>
