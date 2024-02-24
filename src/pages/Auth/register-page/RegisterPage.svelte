<script lang="ts">
	import vector1 from '$lib/assets/Vector1.svg';
	import vector2 from '$lib/assets/Vector2.svg';
	import vector3 from '$lib/assets/Vector3.svg';
	import { handleRegister, handleRegisterValidation } from './register-page';
	import { isLoading } from '$lib/store/auth.store';
	// import PageLoader from "$lib/components/Transition/PageLoader.svelte";
	import starIcon from '$lib/assets/starIcon.svg';
	import eyeHide from '$lib/assets/eye-hide.svg';
	import eyeShow from '$lib/assets/eye-show.svg';
	import { Link, navigate } from 'svelte-navigator';
	import sparrowicon from '$lib/assets/sparrow-icon-bg.svg';
	import Redirect from '../redirect/Redirect.svelte';
	import googleLogo from '$lib/assets/googlelogo.svg';
	export let id;
	let isRegistered = false;
	let redirectRules = {
		title: 'Welcome to Sparrow!',
		description: 'Bridging Frontend and Backend Development.',
		message: `Easily document and manage APIs for seamless collaboration between frontend and backend teams. Get started now to simplify your development workflows.`,
		isSpinner: true,
		buttonText: 'Open Desktop App',
		buttonClick: () => {},
		loadingMessage: 'Please wait while we sign you in....'
	};
	let userData = {
		email: id || "",
		firstName: '',
		lastName: '',
		password: '',
		tnsCheckbox: false
	};

	let validationErrors: any = {};

	let isPasswordValid1 = false;
	let isPasswordValid2 = false;
	let isPasswordValid3 = false;

	let isCheckboxTouched = false;

	let isEmailTouched = false;
	let isNameTouched = false;
	let isPasswordTouched = false;

	let isEmailValid = false;
	const validateEmail = () => {
		const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
		isEmailTouched = true;
		isEmailValid = emailRegex.test(userData.email);
		if (isEmailValid) {
			validationErrors.email = '';
		} else if (isEmailTouched) {
			validationErrors.email = '';
		}
	};

	let isNameValid = false;
	const validateName = () => {
		const nameRegex = /^[A-Za-z\s]+$/;
		let isNameTouched = true;
		isNameValid = nameRegex.test(userData.firstName);

		if (isNameValid && isNameTouched) {
			validationErrors.name = '';
		} else {
			validationErrors.name = 'Your first name cannot have numbers or special characters.';
		}
	};

	let isValidPassword = false;

	const validatePassword = () => {
		const password = userData.password;

		isPasswordValid1 = isValidPassword1(password);
		isPasswordValid2 = isValidPassword2(password);
		isPasswordValid3 = isValidPassword3(password);
		isValidPassword = isValid(password);

		if (isPasswordValid1 && isPasswordValid2 && isPasswordValid3) {
			validationErrors.password = '';
		} else if (isPasswordTouched) {
		} else {
			validationErrors.password = isPasswordValid1;
			validationErrors.password = isPasswordValid2;
			validationErrors.password = isPasswordValid3;
		}
	};

	const isValid = (password: string) => {
		if (isValidPassword1(password) && isValidPassword2(password) && isValidPassword3(password)) {
			return true;
		}
		return false;
	};

	const isValidPassword1 = (password: string) => {
		isPasswordTouched = true;

		if (password.length >= 8) {
			return (isPasswordValid1 = true);
		}
		return (isPasswordValid1 = false);
	};

	const isValidPassword2 = (password: string) => {
		isPasswordTouched = true;
		if (/(?=.*[0-9])/.test(password)) {
			return (isPasswordValid2 = true);
		}
		return (isPasswordValid2 = false);
	};

	const isValidPassword3 = (password: string) => {
		isPasswordTouched = true;

		if (/(?=.*[!@#$%^&*])/.test(password)) {
			return (isPasswordValid3 = true);
		}
		return (isPasswordValid3 = false);
	};

	let ischeckBoxValid = false;

	const validateCheckbox = () => {
		isCheckboxTouched = true;
		ischeckBoxValid = userData.tnsCheckbox;
		if (!ischeckBoxValid) {
			validationErrors.tnsCheckbox = '';
		} else if (isCheckboxTouched) {
		}
	};

	let isLoadingPage: boolean;
	isLoading.subscribe((value) => {
		isLoadingPage = value;
	});

	let isPasswordVisible = false;

	const togglePasswordVisibility = () => {
		isPasswordVisible = !isPasswordVisible;
		const passwordInput = document.getElementById('expamplePassword') as HTMLInputElement | null;
		if (passwordInput) {
			passwordInput.type = isPasswordVisible ? 'text' : 'password';
		}
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
		loadingMessage={redirectRules.loadingMessage}
	/>
	{:else}
	<div class="parent d-flex align-items-center justify-content-center text-white rounded">
		<div
			class="entry-point rounded container d-flex flex-column align-items-center justify-content-center w-100"
		>
			<div class="text-white d-flex justify-content-center align-items-center">
				<img src={sparrowicon} width="60px" alt="" class="" />
			</div>
			<p
				class="container-header pt-4 pb-5 fs-28 text-whiteColor text-center ms-2 me-2 fw-bold"
				style="font-size: 28px;"
			>
				Welcome to Sparrow!
			</p>
	
			<form
				class="register-form w-100 text-whiteColor ps-1 pe-1 gap-16"
				novalidate
				on:submit|preventDefault={async () => {
					validationErrors = await handleRegisterValidation(userData);
					if (
						!validationErrors?.firstName &&
						!validationErrors?.email &&
						!validationErrors?.password
					) {
						const response = await handleRegister(userData);
						if (response) {
							isRegistered = true;
							const accessToken = response?.accessToken?.token;
							const refreshToken = response?.refreshToken?.token;
							const sparrowRedirect = `sparrow://?accessToken=${accessToken}&refreshToken=${refreshToken}&response=${JSON.stringify(response)}`;
							setTimeout(() => {
								let data = JSON.parse(window.atob(accessToken?.split(".")[1]));
								redirectRules.title = `Welcome ${data.name}`;
								redirectRules.description = `Redirecting you to desktop app...`;
								redirectRules.message = `If the application does not open automatically,
								please click below.`;
								redirectRules.loadingMessage = '';
								redirectRules.isSpinner = false;
								navigate(sparrowRedirect);
								redirectRules.buttonClick= ()=>{
									navigate(sparrowRedirect);		
								}
							}, 5000);
						}
					}
				}}
			>
				<p class="card-subtitle sparrow-fs-20 mb-3">Create Account</p>
				<div class="form-group gap-0 mb-3">
					<div>
						<label for="email" class="form-label sparrow-fs-14">Email</label>
						<img src={starIcon} alt="" class="mb-3" style="width: 7px;" />
					</div>
					<input
						class="form-control sparrow-fs-16 mt-1 border:{validationErrors?.email
							? '3px'
							: '1px'} solid {isEmailValid
							? 'border-success'
							: validationErrors?.email
								? 'border-error'
								: isEmailTouched
									? 'border-error'
									: 'border-default'}"
						type="email"
						name="email"
						id="email"
						placeholder="Please enter your email id"
						required
						bind:value={userData.email}
						on:input={validateEmail}
					/>
	
					{#if validationErrors?.email}
						<small class="text-dangerColor form-text">{validationErrors?.email}</small>
					{/if}
				</div>
				<div class="form-group mb-3">
					<div>
						<label for="name" class="sparrow-fs-14">First Name</label>
						<img src={starIcon} alt="" class="mb-3" style="width: 7px;" />
					</div>
	
					<input
						class="form-control sparrow-fs-16 mt-1 border:{validationErrors?.firstName
							? '3px'
							: '1px'} solid {isNameValid
							? 'border-success'
							: validationErrors?.firstName
								? 'border-error'
								: isNameTouched
									? 'border-error'
									: 'border-default'}"
						type="text"
						name="name"
						placeholder="Please enter your first name"
						id="name"
						required
						bind:value={userData.firstName}
						on:input={validateName}
					/>
	
					{#if validationErrors?.firstName}
						<small class="text-dangerColor form-text">{validationErrors?.firstName}</small>
					{/if}
				</div>
	
				<div class="form-group mb-3">
					<div>
						<label for="name" class="sparrow-fs-14">Last Name</label>
					</div>
	
					<input
						class="form-control sparrow-fs-16 mt-1 border:{false ? '3px' : '1px'} solid {false
							? 'border-success'
							: false
								? 'border-error'
								: false
									? 'border-error'
									: 'border-default'}"
						type="text"
						name="lastname"
						placeholder="Please enter your last name"
						id="lastname"
						required
						bind:value={userData.lastName}
					/>
				</div>
	
				<div class="form-group">
					<div>
						<label for="password" id="password" class="sparrow-fs-14">Password</label>
						<img src={starIcon} alt="" class="mb-3" style="width: 7px;" />
					</div>
					<div class="d-flex">
						<input
							class="form-control sparrow-fs-16 mt-1 border:{validationErrors?.password
								? '3px'
								: '1px'} solid {isPasswordValid1 && isPasswordValid2 && isPasswordValid3
								? 'border-success'
								: validationErrors?.password
									? 'border-error'
									: isPasswordTouched
										? 'border-error'
										: 'border-default'}"
							type="password"
							name="password"
							id="expamplePassword"
							placeholder="Please enter your password"
							required
							bind:value={userData.password}
							on:input={validatePassword}
						/>
						<!-- <button
								type="button"
								on:click={togglePasswordVisibility}
								class=" border-0 eye-icon d-flex align-items-center"
							>
								{#if isPasswordVisible}
									<img src={eyeShow} alt="eye-show" />
								{:else}
									<img src={eyeHide} alt="eye-hie" />
								{/if}
							</button> -->
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
									class="mb-0 text : {isPasswordValid1
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
									class="mb-0 text : {isPasswordValid2
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
									class="mb-0 text : {isPasswordValid3
										? 'text-successColor'
										: isPasswordTouched
											? 'text-dangerColor'
											: 'text-textColor'}"
									style="text:{!isPasswordValid3 ? 'red' : 'red'}"
								>
									Has at least one special character
								</p>
							</div>
						</div>
					</div>
				</div>
	
				<div class="form-group mt-2" data-tauri-drag-region>
					<input
						type="checkbox"
						class="form-check-input"
						id="tnsCheckbox"
						bind:checked={userData.tnsCheckbox}
						on:input={validateCheckbox}
					/>
					<label data-tauri-drag-region class="form-check-label ms-2" for="tnsCheckbox"
						>I agree to the <a href="/register" class="text-decoration-none text-primaryColor"
							>Terms of Service</a
						></label
					>
				</div>
				{#if validationErrors?.tnsCheckbox}
					<small class="text-dangerColor form-text">{validationErrors?.tnsCheckbox}</small>
				{/if}
	
				<div class="mb-3 mt-4">
					<button class="btn btn-primary w-100 text-whiteColor border-0">Sign Up</button>
				</div>
	
			</form>
			<div class="d-flex flex-column align-items-center justify-content-center">
				<p>or continue with</p>
				<div class="d-flex gap-4">
					<button
						on:click={()=>{
							navigate('https://api.sparrowapp.dev/api/auth/google/callback');
						}}
						style="width: 32px; height:32px"
						class="bg-dark border-0 rounded"
					>
						<img src={googleLogo} alt="Google Logo" class="w-100 h-100 p-1" />
					</button>
				
				</div>
			
			</div>
			<div class="w-100 d-flex align-items-center justify-content-center">
				<a href="" class="px-2">Need Help?</a>
				<span class="px-2">|</span>
				<a href="" class="px-2">Report Issue</a>
			</div>
		</div>
	</div>
{/if}

<style>
	.btn-primary {
		background: linear-gradient(270deg, #6147ff -1.72%, #1193f0 100%);
	}

	.eye-icon > img {
		position: absolute;
		transform: translateX(-4vmax);
	}

	@media (min-width: 1000px) {
		.eye-icon > img {
			position: absolute;
			transform: translateX(-2vmax);
		}
	}
	.parent {
		min-height: 100vh;
		overflow: auto;
	}
	.entry-point {
		margin: 30px !important;
		background: linear-gradient(to bottom, rgba(51, 51, 51, 0.16), rgba(42, 42, 51, 1));
		max-width: 504px;
		padding: 48px 48px 64px 48px !important;
	}
	input {
		background-color: transparent;
	}
	a {
		text-decoration: none;
	}
</style>
