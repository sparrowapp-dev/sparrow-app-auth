<script>
	import { onMount } from 'svelte';
	import { navigate } from 'svelte-navigator';

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const accessToken = urlParams.get('accessToken');
		const refreshToken = urlParams.get('refreshToken');
		if (accessToken && refreshToken) {
			navigate('/success');
			navigate(`sparrow://?accessToken=${accessToken}&refreshToken=${refreshToken}`);
		}
	});
</script>

<div
	class="card-body d-flex flex-column bg-black text-white mx-auto rounded overflow-hidden"
	style="height: 100vh;"
>
	<div class="d-flex mb-5 flex-column align-items-center justify-content-center">
		<p
			class="text-whiteColor mt-5 ms-2 me-2 mb-4"
			style="font-size: 40px; width:408px; height:48px;font-weight:500;"
		>
			Welcome to Sparrow!
		</p>
	</div>
</div>
