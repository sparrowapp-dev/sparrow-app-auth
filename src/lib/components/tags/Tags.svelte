<script lang="ts">
	export let type: 'cyan';
	export let text: string = 'Tag';
	export let iconSize = 16;
	export let endIcon;
	export let size: 'small' | 'medium' = 'small';
	let height = 18;
	if (size === 'medium') {
		height = 20;
	} else {
		height = 18;
	}
	let fontSize = 10;
	$: fontSize = size === 'medium' ? 12 : 10;

	const convertCasing = (sentence: string) => {
		let sen = sentence?.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
		let total_words = sen.split(' ');
		if (total_words.length > 5) sen = total_words.slice(0, 5).join(' ') + '...';
		return sen;
	};

	const colorPalette = {
		cyan: {
			text: '#5ec5ed',
			bg: '#0f2024',
			border: '#214d5e'
		}
	};
</script>

<button
	style="
    background-color: {colorPalette[type]?.bg};
    color: {colorPalette[type]?.text};
    border: 1px solid {colorPalette[type]?.border};
    border-radius: 2px;
    padding: 0px 4px;
    height: {height}px;
    text-align: center;
    font-family: Inter, sans-serif;
    width: fit-content;
    max-width: 188px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
	font-size: {fontSize}px;"
	class="text-ds-font-weight-medium text-ds-line-height-150 d-flex align-items-center"
>
	<span class={endIcon ? 'text-content' : ''}>{convertCasing(text)}</span>
	{#if endIcon}
		<svelte:component
			this={endIcon}
			height={`${iconSize}px`}
			width={`${iconSize}px`}
			size={`${iconSize}px`}
			useParentColor={true}
			class="end-icon"
		/>
	{/if}
</button>

<style>
	.text-content {
		margin-right: 4px; /* Add space between text and icon */
	}

	.end-icon {
		flex-shrink: 0; /* Prevent the icon from shrinking */
	}
</style>
