<script>
	import constants from "$lib/utils/constants";
	import { AppEdition } from "$lib/utils/enums/enums";
</script>
{#if constants.APP_EDITION === AppEdition.MANAGED}
    <div class="w-100 d-flex align-items-center justify-content-center">
        <a href={`mailto:${constants.SPARROW_SUPPORT_EMAIL}`} class="sparrow-fs-12">Need Help?</a>
        <span class="px-2 text-textColor mb-1" >|</span>
        <a href={constants.CANNY_FEEBACK_URL} class="sparrow-fs-12">Report Issue</a>
    </div>
{/if}
<style>
    a{
        text-decoration: underline;
        color: #B6B7B9;
        font-family: "Inter", sans-serif;
        font-weight: 500;
        font-size: 12px;
    }
    a:hover {
    color: var( --primary-btn-color);
    text-decoration: underline;
}
</style>