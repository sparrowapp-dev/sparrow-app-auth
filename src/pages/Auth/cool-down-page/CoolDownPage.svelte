<script lang="ts">
	import BgContainer from '$lib/components/bgContainer/BgContainer.svelte';
	import Button from '$lib/components/button/Button.svelte';
	import { navigate } from 'svelte-navigator';
	import sparrowicon from '$lib/assets/logoSparrowSquare.svg';
	import SupportHelp from '$lib/components/help/SupportHelp.svelte';
	import AiSparkle from '$lib/assets/AiSparkle.svelte';
	import constants from '$lib/utils/constants';
	import { onMount } from 'svelte';
	let redirctSource;
	let sparrowRedirect;
	onMount(async () => {
		redirctSource = await localStorage.getItem('source');
		if (redirctSource === 'admin') {
			sparrowRedirect = constants.SPARROW_ADMIN_URL;
		} else {
			sparrowRedirect = constants.SPARROW_WEB_URL;
		}
	});
</script>

<BgContainer>
	<div class="w-100 d-flex flex-column justify-content-center align-items-center">
		<div class="d-flex align-items-start gap-2">
			<div
				class="text-white d-flex justify-content-center align-items-center bg-sparrowPrimaryColor"
				style="height: 23px; width: 23px; border-radius: 6px;"
			>
				<img height="20px" width="20px" src={sparrowicon} alt="" class="" />
			</div>
			<p style="font-weight:500;">Sparrow</p>
		</div>
		<div class="d-flex flex-column align-items-center" style="margin-top: 20px;">
			<h1 class="" style="font-size:24px; font-weight: 600;">Cooldown Active</h1>
			<p class="" style="font-size: 14px;">Too many requests</p>
		</div>

		<div style="margin:44px 0px;">
			<p
				class="mb-0 text-center"
				style="font-size:12px; color:#CCCCCCE5; font-weight: 400; line-height:15px; margin-bottom:44px; "
			>
				Your account is in a 30-minute cooldown. You can log in again after this period. Meanwhile,
				try accessing the Sparrow Edge.
			</p>
		</div>

		{#if redirctSource}
			<div class="w-100 mb-5">
				<Button
					onClick={() => navigate(sparrowRedirect)}
					title={'Try Sparrow Edge'}
					buttonClassProp={'w-100 align-items-center d-flex justify-content-center sparrow-fs-16'}
					type={'primary'}
					disable={redirctSource === 'admin'}
				/>

				<div class="d-flex align-items-start" style="margin-top: 18px;">
					<div style="height: 30px; width:30px; ">
						<AiSparkle height={'30px'} width={'30px'} />
					</div>
					<p class="text-center sparrow-fs-12 pt-1" style="color: #CCCCCCE5; line-height:15px;">
						Instantly test APIs without signing up-just the <br /> essentials to get started fast.
					</p>
				</div>
			</div>
		{/if}

		<div class="mt-4">
			<SupportHelp />
		</div>
	</div>
</BgContainer>

<style>
	.cooldown-container {
		text-align: center;
		color: white;
		padding: 20px;
	}

	.cooldown-button {
		margin-top: 20px;
	}
</style>
