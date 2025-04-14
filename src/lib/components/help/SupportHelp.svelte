<script>
	import constants from "$lib/utils/constants";
</script>
<div class="w-100 d-flex align-items-center justify-content-center">
    <a href={`mailto:${constants.SPARROW_SUPPORT_EMAIL}`} class="sparrow-fs-12">Need Help?</a>
    <span class="px-2 text-textColor mb-1" >|</span>
    <a href={`https://sparrowapp.canny.io/feedback`} class="sparrow-fs-12">Report Issue</a>
</div>
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