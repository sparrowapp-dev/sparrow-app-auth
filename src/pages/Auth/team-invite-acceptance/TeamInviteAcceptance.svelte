<script lang="ts">
	import { onMount } from 'svelte';
	import { handleAcceptTeamInvite } from './team-invite-acceptance';

	export let teamId;
    export let inviteId;
    export let email;

	onMount(async()=>{
        await handleAcceptTeamInvite(teamId, inviteId, email);
    });
</script>