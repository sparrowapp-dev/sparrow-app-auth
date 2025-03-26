<script>
  import googleLogo from '$lib/assets/googlelogo.svg';
  import constants from '$lib/utils/constants';
  import { navigate } from 'svelte-navigator';

  const handleSignInWithGoogle = async () => {
      navigate(constants.SPARROW_OAUTH);
  };
</script>

<div class="d-flex flex-column w-100 align-items-center justify-content-center">
  <div class="d-flex flex-column mb-2">
      <button
          class="custom-btn d-flex align-items-center justify-content-center"
          style="width: 36px; height: 36px;"
          on:click={handleSignInWithGoogle}
          tabindex="0"
      >
          <img src={googleLogo} alt="Google Logo" class="google-logo" />
      </button>
  </div>
</div>

<style>
.custom-btn {
  font-weight: 400;
  font-size: 14px;
  background-color: #272935;
  border-radius: 8px;
  border: none;
  outline: none;
}

.custom-btn:hover {
  background-color: #31353F;
}

.custom-btn:focus-visible {
  background-color: #272935;
  border: 2px solid #6894F9;
}

.custom-btn:disabled {
  background-color: transparent;
  border: 1px solid rgba(214, 211, 209, 0.9);
}

.custom-btn:hover {
  background-color: #2A2C3C;
}

.google-logo {
  height: 14px;
  width: 14px;
  display: block;
  margin: auto;
}
</style>

