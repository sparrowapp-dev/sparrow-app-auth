<script lang="ts">
  import { tick } from 'svelte';
  import { onMount } from 'svelte';
  export let variant: 'primary' = "primary";

  export let tabs = [
    { title: "Managed", value: "managed" },
    { title: "Self Hosted", value: "self-hosted" }
  ];

  let selected: string = "managed";
  let previous: string = selected;
  let show = false;

  async function handleClick(value: string) {
    if (value !== selected) {
      previous = selected;
      selected = value;
      show = false;
      await tick(); 
      requestAnimationFrame(() => {
        show = true; 
      });
    }
  }

  onMount(() => {
    requestAnimationFrame(() => {
      show = true;
    });
  });
</script>

<div class="tabs">
  <div class="tab-buttons p-1 tab-button-text d-flex justify-content-between">
    {#each tabs as tab}
      <button
        on:click={() => handleClick(tab.value)}
        class="{variant}-button {selected === tab.value ? 'selected' : ''}"
        tabindex={0}
      >
        {tab.title}
      </button>
    {/each}
  </div>

  <div class="tab-content-wrapper">
    {#key selected}
      <div class="tab-content animate-enter {show ? 'show' : ''}">
        {#if selected === "managed"}
          <slot name="managed" />
        {:else}
          <slot name="self-hosted" />
        {/if}
      </div>
    {/key}
  </div>
</div>

<style>
  .tabs {
    width: 310px;
  }

  .tab-buttons {
    gap: 8px;
    border: 1px solid #31353F;
    border-radius: 4px;
  }

  button {
    border: none;
    text-align: center;
    cursor: pointer;
    width: 145px;
    height: 28px;
    max-width: 182px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    font-family: "Inter", sans-serif;
    line-height: 1.3;
    letter-spacing: 0;
    outline: none;
    transition: background-color 0.1s ease;
  }

  .primary-button {
    background-color: transparent;
    color: #D8D8D9;
  }

  .primary-button.selected {
    background-color: #181C26;
    color: #FFFFFF;
  }

  .primary-button:hover {
    background-color: #222630;
    color: #FFFFFF;
  }

  .tab-button-text {
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    font-size: 12px;
    line-height: 1.3;
  }

  .primary-button:active {
    background-color: #14181F;
  }

  .primary-button:focus-visible {
    background-color: #0B0C0F;
    border: 2px solid #6894F9;
  }

  .primary-button.selected:focus-visible {
    background-color: #0B0C0F;
    border: 2px solid #6894F9;
  }

  .tab-content-wrapper {
    position: relative;
    overflow: hidden;
  }

  .animate-enter {
    opacity: 0;
    transform: translateY(20px);
    transition: all 200ms ease-out;
  }
  .animate-enter.show {
    opacity: 1;
    transform: translateY(0);
   }
</style>


