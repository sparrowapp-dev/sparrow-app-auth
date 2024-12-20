<script lang="ts">
	import sparrowicon from '$lib/assets/logoSparrowSquare.svg';
	import BgContainer from '$lib/components/bgContainer/BgContainer.svelte';
	import Button from '$lib/components/button/Button.svelte';
	import SupportHelp from '$lib/components/help/SupportHelp.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { navigate } from 'svelte-navigator';

	export let id = '';
	let timer: number;
	let seconds = 5;
	const calculateRemainingTime = () => {
		const currentTime = new Date().getTime();
		const storedTime = parseInt(localStorage.getItem(`timer-reset-password-redirect-${id}`));
		if (storedTime) {
			const elapsedTime = Math.floor((currentTime - storedTime) / 1000);
			const remainingTime = Math.max(5 - elapsedTime, 0); // Changed from 60 to 300
			return remainingTime;
		} else {
			return 0;
		}
	};

	const formatTime = (seconds: number) => {
		const remainingSeconds = seconds % 60;
		return `${remainingSeconds.toString()}`;
	};

	const startTimer = () => {
		clearInterval(timer);
		timer = setInterval(() => {
			seconds = calculateRemainingTime();
			if (seconds === 0){
				clearInterval(timer);
				navigate(`/login/${id}`);
			};
		}, 1000);
	};

	onMount(() => {
		seconds = calculateRemainingTime();
		startTimer();
	});
	onDestroy(() => clearInterval(timer));
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

	<div class="" style="margin-top:20px ;">
		<p
			class=" text-transparent text-center ms-2 me-2 ellipsis"
			style="font-weight:600; font-size:24px; line-height:22px;"
		>
			Updated Successfully
			<br />
			<span class="sparrow-fs-14" style="font-weight:400;">Continue with login</span>
		</p>

		<div style="margin-top: 40px;">
			<div
				style="font-size: 14px;text-align:center"
				class="text-lightGray d-flex align-items-center justify-content-center mt-3"
			>
				<Button
					title={`Redirecting to Login in ${formatTime(seconds)}s`}
					buttonClassProp={'w-100 align-items-center d-flex justify-content-center sparrow-fs-14'}
					type={'primary'}
					onClick={() => {
						navigate(`/login/${id}`);
					}}
				/>
			</div>
		</div>
	</div>

	<div class="" style="margin-top: 40px;">
		<SupportHelp />
	</div>
</BgContainer>
