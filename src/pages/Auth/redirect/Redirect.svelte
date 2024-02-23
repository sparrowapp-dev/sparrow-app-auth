<script lang="ts">
	import sparrowIcon from '$lib/assets/sparrow-icon-bg.svg';
	import Spinner from '$lib/components/transition/Spinner.svelte';
	import { fly, fade } from 'svelte/transition';
	


  export let title="Title";
  export let description= "Description";
  export let message="Detailed Message";
  export let isSpinner= true;
  export let buttonText="Button";
  export let buttonClick = () =>{} ;
  export let loadingMessage = "";
</script>

<!-- <Header /> -->
<div class="background-overlay" transition:fade={{ delay: 0, duration: 100 }}>
	<div
		class="container d-flex flex-column mb-0 px-4 pb-0 pt-4"
		transition:fly={{ y: 50, delay: 0, duration: 100 }}
		on:introstart
		on:outroend
	>
		<div class="text-white d-flex justify-content-center align-items-center">
			<img src={sparrowIcon} width="60px" alt="" class="" />
		</div>
		<p
			class="container-header pt-4 pb-0 fs-28 text-whiteColor text-center ms-2 me-2 fw-bold"
			style="font-size: 28px;"
		>
			{title}
		</p>

		<div style="font-size: 14px;text-align:center" class="text-lightGray">
			<p>{description}</p>
		</div>

		<div style="font-size: 14px;text-align:center" class="text-lightGray mt-2">
			<p>
				{message}
			</p>
		</div>

		{#if isSpinner}
			<div
				style="font-size: 14px;text-align:center"
				class="text-lightGray d-flex align-items-center justify-content-center mt-3"
			>
				<Spinner size={'80px'} />
			</div>
		{:else}
			<div
				style="font-size: 14px;text-align:center"
				class="text-lightGray d-flex align-items-center justify-content-center mt-3"
			>
				<button
					class="buttons d-flex justify-content-center align-items-center gap-1"
					on:click={buttonClick}
				>
					{buttonText}
				</button>
			</div>
		{/if}

		{#if loadingMessage}
			<div class="welcome-spinner text-lightGray mt-4">
				<p>{loadingMessage}</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.background-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		-webkit-backdrop-filter: blur(3px);
    background-color: black;
		backdrop-filter: blur(3px);
		z-index: 5;
	}

	.container {
		position: fixed;
		height: 433px;
		width: 585px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 6;
		border-radius: 10px;
	}

	.buttons {
		width: 180px;
		height: 32px;
		padding: 4px, 12px, 4px, 4px;
		border-radius: 4px;
		background: linear-gradient(270deg, #6147ff -1.72%, #1193f0 100%);
		border: none;
	}

	.welcome-spinner {
		font-size: 14px;
		text-align: center;
	}
</style>
