<script lang="ts">
	import CopyIcon from '$lib/assets/CopyIcon.svelte';
	import sparrowicon from '$lib/assets/logoSparrowSquare.svg';
	import BgContainer from '$lib/components/bgContainer/BgContainer.svelte';
	import Button from '$lib/components/button/Button.svelte';
	import SupportHelp from '$lib/components/help/SupportHelp.svelte';
	import Spinner from '$lib/components/transition/Spinner.svelte';
	import ListCard from '$lib/components/list-card/ListCard.svelte';
	import { onMount } from 'svelte';
	import { CopyIcon2 } from '$lib/assets/app.asset';
	interface TeamDetails {
		teamName: string;
		teamMembers: number;
		teamLogo?: TeamLogo;
	}
	interface TeamLogo {
		bufferString?: string;
		encoding?: string;
		mimetype?: string;
		size?: number;
	}

	export let title = 'Title';
	export let description = 'Description';
	export let message = 'Detailed Message';
	export let isSpinner = true;
	export let buttonText = 'Button';
	export let buttonClick = () => {};
	export let copyLink = () => {};
	export let loadingMessage = '';
	export let userTeams: TeamDetails[] = [];

	let redirctSource = true;
	onMount(() => {
		redirctSource = localStorage.getItem('source');
	});
</script>

<!-- <Header /> -->

<BgContainer>
	<div class="d-flex flex-column animate-enter animate-fade-in-up">
		<div class="d-flex align-items-start justify-content-center gap-2">
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
				class=" container-header sparrow-fw-600 text-whiteColor text-center ms-2 me-2 mb-1"
				style="font-size:24px; font-weight: 400;  line-height:28px; text-align:center; max-width:300px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;"
			>
				{title}
				<br />
				<span class="sparrow-fs-14" style="font-weight:400; color:#9B9DA1;"
					>To your Sparrow Space</span
				>
			</p>

			<!-- {#if  !isSpinner}
				<div class="mt-3 d-flex justify-content-center align-items-center flex-column">
					<p class="hubspot-help-text">View and manage hubs in the desktop app.</p>
					<ListCard TeamDetails={userTeams} />
				</div>
			{/if} -->

			{#if isSpinner}
				<div
					style="font-size: 14px;text-align:center"
					class="mt-3 text-lightGray d-flex align-items-center justify-content-center mt-4"
				>
					<Spinner size={'40px'} />
				</div>
			{/if}
			{#if redirctSource}
				<div style="margin-top: 40px;">
					<div
						style="font-size: 14px;text-align:center;"
						class="text-lightGray d-flex align-items-center justify-content-center mt-3"
					>
						<div class="" style="width: 300px;">
							<Button
								title={buttonText}
								disable={isSpinner}
								buttonClassProp={'w-100 align-items-center d-flex justify-content-center sparrow-fs-14'}
								textStyleProp={"font-family: 'Inter', sans-serif; font-weight:500; line-height:143%;"}
								type={'primary'}
								onClick={buttonClick}
							/>
						</div>
					</div>
				</div>
			{/if}

			<div class="sparrow-fw-400" style="margin-top: 6px;">
				<div class="d-flex align-items-center justify-content-center">
					<div
						style="text-align:center; max-width: 400px; color:#9B9DA1; font-family: 'Inter', sans-serif;"
						class="mt-4 sparrow-fw-400 sparrow-fs-12"
					>
						<p>
							<span
								role="button"
								on:click={() => {
									copyLink();
								}}
							>
								<CopyIcon2 />
								<span
									style="text-decoration: underline; color:#B6B7B9;  text-underline-offset: 4px; font-wight:500;"
									>Copy</span
								>
							</span>
							{message}
						</p>
					</div>
				</div>
			</div>
		</div>

		<div class="" style="margin-top: 40px;">
			<SupportHelp />
		</div>
	</div>
</BgContainer>

<style>
	.hubspot-help-text {
		font-family: 'Inter', sans-serif;
		font-weight: 500;
		font-size: 12px;
		line-height: 1.3;
		letter-spacing: 0;
		margin: 0px;
		color: #9b9da1;
		margin-bottom: 8px;
	}
	@keyframes fadeInUp {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .animate-fade-in-up {
    animation: fadeInUp 200ms ease-out forwards;
  }
</style>
