<script>
    import googleLogo from '$lib/assets/googlelogo.svg';
	import constants from '$lib/utils/constants';
	import { navigate } from 'svelte-navigator';
    const handleSignInWithGoogle = async () => {
		navigate(constants.SPARROW_OAUTH);
	};
</script>
<div class="d-flex flex-column w-100 align-items-center mt-4 justify-content-center">
   
    <div class="d-flex  d-flex flex-column w-100 gap-4 mb-2 ">
      
        <button
        class="custom-btn d-flex align-items-center justify-content-center gap-2 btn  w-100 text-whiteColor"
        style="height:44px;"
        on:click={handleSignInWithGoogle}
      >
      <img src={googleLogo} alt="Google Logo" class="" height="14" width="14" />

       <p class="mb-0 sparrow-fs-14"> Continue with Google</p>
      </button>
    </div>
</div>

<style>



.custom-btn {
    font-weight: 400;
    font-size: 14px;
    background-color: transparent;
    border: 1px solid #62636C;
    border-radius: 8px;
  }

  .custom-btn:hover {
    border: 1px solid #ffffff;

  }

  .custom-btn:active {
     border: 1px solid #3670F7;
    transition: all 100ms ease-in-out;
  }

  .custom-btn:disabled {
    background-color: transparent;
    border: 1px solid rgba(214, 211, 209, 0.9);
  }

  

.custom-button:hover{
    background-color:#2A2C3C
;
}
</style>