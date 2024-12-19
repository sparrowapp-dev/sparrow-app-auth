<script lang="ts">
	import CopyIcon from '$lib/assets/CopyIcon.svelte';
	import sparrowicon from '$lib/assets/logoSparrowSquare.svg';
	import BgContainer from '$lib/components/bgContainer/BgContainer.svelte';
	import Button from '$lib/components/button/Button.svelte';
	import SupportHelp from '$lib/components/help/SupportHelp.svelte';
	import Spinner from '$lib/components/transition/Spinner.svelte';

	export let title="Title";
	export let description= "Description";
	export let message="Detailed Message";
	export let isSpinner= true;
	export let buttonText="Button";
	export let buttonClick = () => {} ;
	export let copyLink = () => {} ;
	export let loadingMessage = "";
</script>

<!-- <Header /> -->

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
			{title}
			<br />
			<span class="sparrow-fs-14" style="font-weight:400;">To your Sparrow Space</span>
		</p>


		{#if isSpinner}
			<div
				style="font-size: 14px;text-align:center"
				class="mt-3  text-lightGray d-flex align-items-center justify-content-center mt-4"
			>
				<Spinner size={'40px'} />
			</div>
		

			{/if}
		<div style="margin-top: 40px;">
			<div
				style="font-size: 14px;text-align:center"
				class="text-lightGray d-flex align-items-center justify-content-center mt-3"
			>
				<Button
					title={buttonText}
					disable={isSpinner}
					buttonClassProp={'w-100 align-items-center d-flex justify-content-center sparrow-fs-14'}
					type={'primary'}
					onClick={buttonClick}
				/>
			</div>
		</div>

		<div class="sparrow-fw-400 sparrow-fs-16" style="margin-top: 6px;">
			<div
				style="text-align:center; max-width: 370px;"
				class="text-lightGray mt-4 sparrow-fw-300 sparrow-fs-14"
			>
				<p>
					<span role="button" on:click={()=>{
						copyLink();
					}}>
						<CopyIcon height={'16px'} width={'16px'} color={'#CCCCCCE5'} />
						<span
							style="text-decoration: underline; color:#CCCCCCE5;  text-underline-offset: 4px;"
							>copy</span
						>

					</span>
					{message}
				</p>
			</div>
		</div>
	</div>

	<div class="" style="margin-top: 40px;">
		<SupportHelp />
	</div>
</BgContainer>
