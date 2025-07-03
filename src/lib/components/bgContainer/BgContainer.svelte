<script lang="ts">
	import { onMount, onDestroy, afterUpdate, tick } from 'svelte';
	import { bgContainerHeight } from '$lib/store/bgContainerHeight'; // optional for caching across pages
	import BlurEffect from './BgCard.png';

		// This gets optionally bound from the parent
	export let recalculateHeight: () => void;

	let container: HTMLDivElement;
	let inner: HTMLDivElement;
	let currentHeight = 0;

	// Define the function
	async function measureAndSetHeight() {
		await tick();
		if (!inner || !container) return;

		const newHeight = inner.scrollHeight + 60;
		if (newHeight !== currentHeight) {
			container.style.transition = 'height 280ms ease-in-out';
			container.style.height = `${newHeight}px`;
			currentHeight = newHeight;
		}
	}

	// Assign function to the prop (for bind)
	recalculateHeight = measureAndSetHeight;

	onMount(() => {
		const unsub = bgContainerHeight.subscribe((prev) => {
			if (prev !== null && container) {
				container.style.height = prev + 'px';
				currentHeight = prev;
			}
		});

		// Call once when mounted
		measureAndSetHeight();

		return unsub;
	});

	// Save latest height
	onDestroy(() => {
		if (inner) {
			bgContainerHeight.set(inner.scrollHeight + 60);
		}
	});

	// If no external trigger is used, run it on every update
	afterUpdate(() => {
		// Only run automatically if parent didn't bind and call manually
		if (recalculateHeight === measureAndSetHeight) {
			measureAndSetHeight();
		}
	});
</script>

<div class="parent d-flex align-items-center justify-content-center text-white rounded">
	<div
		class="position-relative overflow-hidden m-4 rounded-4 container"
		style="padding: 36px 60px 24px 60px; border: 1px solid var(--bg-container-border); max-width: 420px;"
		bind:this={container}
	>
		<!-- Blur Background -->
		<div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;">
			<img class="position-absolute" src={BlurEffect} alt="" style="width: 100%; height: 100%;" />
		</div>

		<!-- Slot wrapper (for measurement) -->
		<div
			class="d-flex flex-column align-items-center justify-content-center w-100 animated-content"
			style="z-index: 100; position: relative;"
			bind:this={inner}
		>
			<slot />
		</div>
	</div>
</div>

<style>
	.parent {
		min-height: 100vh;
		overflow: auto;
	}
	.animated-content {
		animation: fadeSlideIn 450ms ease-in-out;
	}

	@keyframes fadeSlideIn {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
