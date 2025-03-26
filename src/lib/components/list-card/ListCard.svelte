<script lang="ts">
	import Locked from "$lib/assets/Locked.svelte";

	interface TeamDetails {
		teamName: string;
		teamMembers: number;
		teamLogo?: TeamLogo;
		secondLevelAuth?: boolean;
	}

	interface TeamLogo {
		bufferString?: string;
		encoding?: string;
		mimetype?: string;
		size?: number;
	}

	interface TeamCard {
		teamName: string;
		teamMembers: number;
		secondLevelAuth?: boolean;
		teamIcon?: string;
	}

	export let userTeams: TeamDetails[] = [];

	// Convert teamLogo to image URL before passing to ListCard
	let Teams: TeamCard[] = [];

	function getImageUrl(logo?: TeamLogo): string {
		return logo?.bufferString ? `data:${logo.mimetype};base64,${logo.bufferString}` : '';
	}

	$: Teams = userTeams.map((team) => ({
		teamName: team.teamName,
		teamMembers: team.teamMembers,
		teamIcon: getImageUrl(team.teamLogo), 
		secondLevelAuth: team.secondLevelAuth
	}));
</script>

<div class="team-container">
	<div class="team-card-container">
		<div class="team-card-main">
			{#each Teams as card}
				<div class="team-card d-flex justify-content-between align-items-center">
					<div class="d-flex align-items-center team-content-container">
						<div class="team-icon d-flex justify-content-center align-items-center"> 
							{#if card.teamIcon}
								<img src="{card.teamIcon}" alt="Team Icon" class="profile-img" />
							{:else}
								<span class="team-initial">{card.teamName[0]}</span>
							{/if}
						</div>
						<div class="team-info">
							<p class="team-name">{card.teamName}</p>
							<p class="team-members">{card.teamMembers} Members</p>
						</div>
					</div>
					{#if card.secondLevelAuth}
						<Locked />
					{/if}
				</div>
			{/each}
		</div>
	</div>    
</div>


<style>
    .team-container {
        width: 310px;
        overflow: hidden;
        border-radius: 8px;
    }
    
    .team-card-container {
        width: 310px;
        max-height: 144px;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        overflow-y: auto;
        width: 100%;
    }
    .team-card-main{
        width: 300px;
        border-radius: 8px;
    }
    
    .team-content-container {
        gap: 12px;
    }
    
    .team-card {
        width: 100%;
        height: 48px;
        padding: 6px 8px;
        border-bottom: 1px solid black;
        background-color: #181C26;
    }
    
    .team-card:last-child {
        border-bottom: none;
    }
    .team-card:first-child {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }

    .team-card:last-child {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        border-bottom: none;
    }
    
    .team-members {
        font-family: "Inter", sans-serif;
        font-weight: 400;
        font-size: 12px;
        color: #9B9DA1;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 0;
    }
    
    .team-name {
        font-family: "Inter", sans-serif;
        font-weight: 600;
        font-size: 12px;
        color: #ffffff;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 0;
    }
    
    .team-icon {
        height: 28px;
        width: 28px;
        min-width: 28px;
        min-height: 28px;
        background-color: #6147FF;
        border: 1.33px solid #414858;
        border-radius: 50%; 
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        overflow: hidden; 
    }

    .team-initial {
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        font-size: 14px;
        line-height: 1; 
        text-align: center;
    }

    .profile-img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
    }

    /* scrollbar style*/
    .team-card-container::-webkit-scrollbar {
        width: 2px; 
        background-color: #31353F;
    }

    .team-card-container::-webkit-scrollbar-thumb {
        background-color: #31353F;
        border-radius: 8px;
    }

    .team-card-container::-webkit-scrollbar-track {
        background-color: transparent;
        margin: 4px 0; 
    }

    .team-card-container {
        scrollbar-width: thin;
        scrollbar-color: #31353F transparent;
    }
</style>


