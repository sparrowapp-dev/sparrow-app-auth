import { writable } from 'svelte/store';

// Initial value is false (assume web), but it will be updated on page load.
export const isUserFromDesktop = writable(false);