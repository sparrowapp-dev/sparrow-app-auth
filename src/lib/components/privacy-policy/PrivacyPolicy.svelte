<script>
    import constants from "$lib/utils/constants";
</script>

<div style="margin-bottom: 16px;">
    <p style="text-align: center; margin-bottom:0px;" class="sparrow-fs-12 px-3 text-lightGray">By creating an account, you agree to receive occasional marketing emails & product updates. You may unsubscribe from these communications at any time. Please refer to our</p>
   
    <div class="w-100 d-flex align-items-center justify-content-center" >
        <a target="_blank" href={constants.SPARROW_TERMS_OF_SERVICE} class="sparrow-fs-14" style="font-weight:400;">Terms of Service</a>
        <span class="px-2 text-lightGray  sparrow-fs-14" style="font-weight:400;" >&</span>
        <a target="_blank" href={constants.SPARROW_PRIVACY_POLICY} class="sparrow-fs-14"  style="font-weight:400;">Privacy Policy</a>
    </div>

</div>

<style>
     a{
        text-decoration: underline;
        color: var(--primary-btn-color);
        /* border-bottom: 1px solid var( --primary-color); */
        font-weight: 400;
    }
</style>