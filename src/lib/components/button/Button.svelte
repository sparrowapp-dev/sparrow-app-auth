<script lang="ts">
	import Spinner from '../transition/Spinner.svelte';

	export let title = 'Submit';
	export let onClick: (e) => void = () => {};
	export let loaderSize = 22;
	export let disable = false;
	export let loader = false;
	export let buttonStyleProp = '';
	export let buttonClassProp = '';
	export let textClassProp = '';
	export let textStyleProp = '';
	export let allowChild = false;
	export let type:
		| 'primary'
		| 'secondary'
		| 'dark'
		| 'danger'
		| 'primary-gradient'
		| 'transparent'
		| 'other'
		| 'icon'
		| 'link-secondary'
		| 'primary-filled' = 'other';
	enum BtnType {
		PRIMARY = 'primary',
		SECONDARY = 'secondary',
		DARK = 'dark',
		DANGER = 'danger',
		TRANSPARENT = 'transparent',
		PRIMARY_GRADIENT = 'primary-gradient',
		PRIMARY_FILLED = 'primary-filled',
		LINK_SECONDARY = 'link-secondary',
		OTHER = 'other',
		ICON = 'icon'
	}
	let btnClass = '';
	let isPressed = false;
	switch (type) {
		case BtnType.PRIMARY:
			btnClass = 'custom-btn-primary';
			break;
		case BtnType.SECONDARY:
			btnClass = 'custom-btn-secondary';
			break;
		case BtnType.DARK:
			btnClass = 'custom-btn-dark';
			break;
		case BtnType.DANGER:
			btnClass = 'custom-btn-danger';
			break;
		case BtnType.TRANSPARENT:
			btnClass = 'custom-btn-transparent';
			break;
		case BtnType.ICON:
			btnClass = 'sparrow-icon-btn';
			break;
		case BtnType.PRIMARY_GRADIENT:
			btnClass = 'custom-btn-primary-gradient';
			break;
		case BtnType.PRIMARY_FILLED:
			btnClass = 'custom-btn-primary-filled';
			break;
		case BtnType.LINK_SECONDARY:
			btnClass = 'custom-btn-link-secondary';
			break;
		default:
			btnClass = '';
			break;
	}
</script>

<button
	disabled={disable}
	style={`${type !== 'other' && type !== 'icon' ? 'border-radius: 10px; padding: 6px 12px;' : ''} ${buttonStyleProp}`}
	class={`${buttonClassProp} ${
		type !== 'other' && type !== 'icon'
			? 'py-1 px-3 d-flex align-items-center' /* removed border-0 */
			: ''
	} ${btnClass} ${type === 'primary' ? (isPressed ? 'shadow-pressed' : 'shadow-none') : ''}`}
	on:click={(e) => {
		onClick(e);
	}}
	on:mousedown={() => (isPressed = true)}
	on:mouseup={() => (isPressed = false)}
	on:mouseleave={() => (isPressed = false)}
>
	{#if loader && !allowChild}
		<span class="mx-2 d-flex justify-content-center">
			<Spinner size={`${loaderSize}px`} />
		</span>
	{:else if !loader && !allowChild}
		<span class={textClassProp} style={textStyleProp}>
			{title}
		</span>
	{:else if allowChild}
		<slot />
	{/if}
</button>

<style lang="scss">
	button:active {
		transition: all 300ms ease-in-out;
	}

	button {
		transition: all 300ms ease-in-out;
	}

	button:disabled {
		cursor: not-allowed;
	}

	.sparrow-icon-btn {
		background-color: transparent;
		border: 0px;
	}
	.sparrow-icon-btn:hover {
		background-color: var(--blackColor);
	}

	.custom-btn-primary {
		height: 44px;
		font-weight: 400;
		background-color: white;
		color: black;
		transition: all 300ms ease-in-out;

		box-shadow: none;
		border: 0.4px solid transparent !important; /* Updated border width */
	}

	.custom-btn-primary:hover {
		background-color: #6147ff; /* purple-600 */
		border-color: transparent !important;
		color: white;
	}

	.custom-btn-primary:active {
		outline: none;
	}
	.custom-btn-primary:disabled {
		user-select: none;
		pointer-events: none;
		opacity: 45%;
	}

	.custom-btn-primary.shadow-none {
		box-shadow: none;
	}

	.custom-btn-primary.shadow-pressed {
		box-shadow: inset 0px 0px 12px 5px rgba(0, 0, 0, 0.55);
		border: 0.4px solid white !important;
	}

	.custom-btn-secondary {
		font-weight: 400;
		font-size: 14px;
		background-color: transparent;
		border: 1px solid rgba(214, 211, 209, 0.9);
		border-radius: 8px;
	}

	.custom-btn-secondary:hover {
		background-color: #6147ff;
		border-color: transparent;
	}

	.custom-btn-secondary:active {
		box-shadow: inset 0px 0px 12px 5px rgba(0, 0, 0, 0.55);
		transition: all 100ms ease-in-out;
	}

	.custom-btn-secondary:disabled {
		background-color: transparent;
		border: 1px solid rgba(214, 211, 209, 0.9);
	}

	.custom-btn-primary-gradient {
		// background: linear-gradient(270deg, #6147ff -1.72%, #1193f0 100%);
		background: var(--primary-color);
		color: white;
	}
	.custom-btn-primary-gradient:hover {
		background: var(--primary-btn-color-hover);
	}
	.custom-btn-primary-gradient:active {
		background: var(--button-pressed);
	}
	.custom-btn-dark {
		background-color: var(--border-color);
		color: var(--white-color);
	}
	.custom-btn-dark:hover {
		background-color: var(--sparrow-button-background);
	}
	.custom-btn-danger {
		background-color: var(--dangerColor);
		color: var(--blackColor);
	}
	.custom-btn-danger:hover {
		background-color: var(--delete-hover);
	}
	.custom-btn-transparent {
		background-color: transparent;
		color: var(--white-color);
	}
	.shadow-none {
		box-shadow: none;
	}

	.shadow-pressed {
		box-shadow: inset 0px 0px 12px 5px rgba(0, 0, 0, 0.55);
	}

	.custom-btn-primary-filled {
		background-color: #316cf6;
		color: #ffffff;
		border-width: 0px;
	}
	.custom-btn-primary-filled:hover {
		background-color: #6894f9;
		color: #ffffff;
		border-width: 0px;
	}
	.custom-btn-primary-filled :focus-visible {
		border: 2px solid #6894f9;
		color: #ffffff;
		outline: none;
	}
	.custom-btn-primary-filled:active {
		background-color: #1f418f;
		color: #ffffff;
		border-width: 0px;
	}
	.custom-btn-primary-filled-disable {
		background-color: #18336f;
		color: #82858a;
		border-width: 0px;
	}

	.custom-btn-link-secondary {
		background-color: transparent;
		color: #b6b7b9;
		border: 0px;
		text-decoration: underline;
		text-underline-offset: 5px;
	}
	.custom-btn-link-secondary:hover {
		background-color: transparent;
		color: #ffffff;
		border: 0px;
		text-decoration: underline;
		text-underline-offset: 5px;
	}
	.custom-btn-link-secondary:focus-visible {
		background-color: transparent;
		color: #6894f9;
		border: 2px solid #6894f9;
		text-decoration: none;
	}
	.custom-btn-link-secondary:active {
		background-color: transparent;
		color: #6894f9;
		border: 0px;
		text-decoration: underline;
		text-underline-offset: 5px;
	}

	.custom-btn-link-secondary-disable {
		background-color: transparent;
		color: #b6b7b9;
		text-decoration: underline;
		text-underline-offset: 5px;
		border: 0px;
	}
</style>
