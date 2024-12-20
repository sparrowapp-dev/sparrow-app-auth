import './styles/style.scss';
import App from './App.svelte';
import constants from '$lib/utils/constants';
import mixpanel from "mixpanel-browser";

async function init() {
	if (constants.ENABLE_MIX_PANEL === "true") {
		const mixPanelToken: string = constants.MIX_PANEL_TOKEN;
		mixpanel.init(mixPanelToken);
	  }
	return new App({
		target: document.getElementById('app') as HTMLInputElement
	});
}

const app = init();
export default app;
