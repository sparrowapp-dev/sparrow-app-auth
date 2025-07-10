<script>
	import Check from '$lib/assets/CheckIcon.svelte';
	import Tag from '$lib/components/tags/Tags.svelte';
	import Button from '$lib/components/button/Button.svelte';

	// Props for the card
	export let title = '';
	export let price = '';
	export let period = '';
	export let features = [];
	export let buttonText = '';
	export let savings = null;
	export let compareText = '';
	export let onCompareClick = () => {};
	export let onButtonClick = () => {};
</script>

<div
	class="position-relative rounded mb-4"
	style="background-color: #0B0C0F; border: 1px solid #414858; padding: 20px 20px 40px 20px;"
>
	<div class="mb-4">
		<h5 class="text-white">{title}</h5>
		<div class="d-flex align-items-center mb-1">
			<div class="text-white sparrow-fs-16" style="font-weight: 500;">
				{price}
				<span class="fs-6 fw-normal text-secondary">{period}</span>
			</div>
			{#if savings}
				<div class="ms-2 flex-shrink-0">
					<Tag text={savings} type="cyan" endIcon={''} />
				</div>
			{/if}
		</div>
	</div>

	<Button
		onClick={onButtonClick}
		buttonClassProp="custom-btn py-2 mb-4"
		buttonStyleProp="border-radius: 4px;"
		title={buttonText}
		type="primary-filled"
	/>

	<div class="d-flex flex-column">
		{#each features as feature}
			<div class="d-flex align-items-start gap-2">
				<div class="flex-shrink-0" style="margin-bottom: 4px;">
					<Check width="17" height="13" color="#33CC7A" />
				</div>
				<span class="sparrow-fs-14" style="color: #B6B7B9;">{feature}</span>
			</div>
		{/each}
	</div>

	<div class="d-flex mt-4 justify-content-center">
		<Button type="link-secondary" title={compareText} onClick={onCompareClick} />
	</div>
</div>

<style>
	.custom-btn {
		min-width: 72px;
		min-height: 28px;
		padding: 4px 8px;
	}
</style>
