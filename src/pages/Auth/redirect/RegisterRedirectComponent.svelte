<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import sparrowicon from '$lib/assets/logoSparrowSquare.svg';
	import BgContainer from '$lib/components/bgContainer/BgContainer.svelte';
	import Button from '$lib/components/button/Button.svelte';


	export let handleContinueButtonClick;

	const REDIRECT_FLAG = 'currentRegistrationRedirectShown';

	const wrappedHandleContinue = () => {
		sessionStorage.setItem(REDIRECT_FLAG, 'true');
		handleContinueButtonClick();
	};

	onMount(() => {
		if (sessionStorage.getItem(REDIRECT_FLAG) === 'true') {
			handleContinueButtonClick();
		}
	});
</script>

<!-- <Header /> -->

<BgContainer>
	<div class="d-flex align-items-start justify-content-center gap-2 w-100">

		<div
			class="text-white d-flex justify-content-center align-items-center bg-sparrowPrimaryColor"
			style="height: 23px; width: 23px; border-radius: 6px;"
		>
			<img height="20px" width="20px" src={sparrowicon} alt="" class="" />
		</div>
		<p style="font-weight:500;">Sparrow</p>
	</div>

	<div class="" style="margin-top:20px ;">
		<p style="font-size:11px;  text-align:center; letter-spacing:-4%; line-height:18px" >
            We are committed to protecting your privacy. <br>
Sparrow may send product updates and marketing emails <br> if you opt in. You can unsubscribe from these communications at any time.
        </p>

		

		<div class="w-100 d-flex gap-2 " style="margin-top: 44px;">
            <input
                type="checkbox"
                class="form-check-input mt-0"
                id="marketingUpdates"
            />
            <p class="sparrow-fs-12  w-100" style="line-height: 18px;">I agree to receive occasional updates and  helpful resources from Sparrow</p>
            
        </div>


        <div style="margin-top: 40px;" class="mb-3">
			<Button
				title={"Continue"}
				buttonClassProp={'w-100 align-items-center d-flex justify-content-center sparrow-fs-14'}
				type={'primary'}
				onClick={wrappedHandleContinue}
			/>
		</div>

	</div>
</BgContainer>

