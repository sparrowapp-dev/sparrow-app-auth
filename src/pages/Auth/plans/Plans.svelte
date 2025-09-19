<script>
	import PricingCard from './components/pricing-card/PricingCard.svelte';
	import { navigate, useLocation } from 'svelte-navigator';
	import constants from '$lib/utils/constants';
	import { notifications } from '$lib/components/toast-notification/ToastNotification';
	import Redirect from '../redirect/Redirect.svelte';
	import { AppEdition } from '$lib/utils/enums/enums';

	const location = useLocation();
	let redirctSource = localStorage.getItem('source');
	$: params = new URLSearchParams($location.search);
	$: accessToken = params.get('accessToken');
	$: refreshToken = params.get('refreshToken');
	$: response = params.get('response');
	$: email = params.get('email');

	let isRegistered = false;

	let redirectRules = {
		title: 'Welcome to Sparrow!',
		description: 'Bridging Frontend and Backend Development.',
		message: `the token if you are facing any issue in redirecting to the login page`,
		isSpinner: true,
		buttonText: 'Open Desktop App',
		buttonClick: () => {},
		copyLink: () => {},
		loadingMessage: 'Please wait while we sign you in....'
	};

	let billingPeriod = 'monthly';

	const monthlyPlans = [
		{
			title: 'Community',
			price: '$0',
			period: 'per user/month',
			features: [
				'Up to 5 collaborators',
				'Up to 3 workspaces',
				'Up to 1 Private hub',
				'Unlimited Collections'
			],
			buttonText: 'Continue with Community',
			buttonVariant: 'primary'
		},
		{
			title: 'Standard',
			price: '$9.99',
			period: 'per user/month',
			features: [
				'Unlimited collaborators',
				'Up to 5 workspaces',
				'Up to 1 Private hub',
				'Unlimited Collections'
			],
			buttonText: 'Start 14-day Trial',
			buttonVariant: 'primary'
		},
		{
			title: 'Professional',
			price: '$19.99',
			period: 'per user/month',
			features: [
				'Unlimited collaborators',
				'Up to 10 workspaces',
				'Up to 1 Private hub',
				'Unlimited Collections'
			],
			buttonText: 'Start 14-day Trial',
			buttonVariant: 'primary'
		},
		{
			title: 'Enterprise',
			price: '$99',
			period: 'per user/month',
			features: [
				'Unlimited collaborators',
				'Unlimited workspaces',
				'Unlimited Private hub',
				'Unlimited Collections'
			],
			buttonText: 'Contact Sales',
			buttonVariant: 'secondary'
		}
	];

	const annualPlans = [
		{
			title: 'Community',
			price: '$0',
			period: 'per user/year',
			features: [
				'Up to 5 collaborators',
				'Up to 3 workspaces',
				'Up to 1 Private hub',
				'Unlimited Collections'
			],
			buttonText: 'Continue with Community'
		},
		{
			title: 'Standard',
			price: '$99',
			period: 'per user/year',
			savings: 'Save 17.4%',
			features: [
				'Unlimited collaborators',
				'Up to 5 workspaces',
				'Up to 1 Private hub',
				'Unlimited Collections'
			],
			buttonText: 'Start 14-day Trial'
		},
		{
			title: 'Professional',
			price: '$199',
			period: 'per user/year',
			savings: 'Save 17%',
			features: [
				'Unlimited collaborators',
				'Up to 10 workspaces',
				'Up to 1 Private hub',
				'Unlimited Collections'
			],
			buttonText: 'Start 14-day Trial'
		},
		{
			title: 'Enterprise',
			price: '$499',
			period: 'per user/year',
			savings: 'Save 16.8%',
			features: [
				'Unlimited collaborators',
				'Unlimited workspaces',
				'Unlimited Private hub',
				'Unlimited Collections'
			],
			buttonText: 'Contact Sales'
		}
	];

	$: pricingPlans = billingPeriod === 'monthly' ? monthlyPlans : annualPlans;

	function handlePlanSelect(plan) {
		if (!accessToken) {
			console.error('Access token is missing');
			return;
		}
		let data = JSON.parse(window.atob(accessToken.split('.')[1]));
		let firstName = data.name;
		firstName = firstName.split(' ')[0];
		firstName = firstName.length > 11 ? firstName.substring(0, 5) + '...' : firstName;
		if (plan.title === 'Enterprise') {
			window.open(constants.SPARROW_CONTACT_SALES_URL, '_blank');
			return;
		} else if (plan.title === 'Community') {
			isRegistered = true;
			const sparrowRedirect = `sparrow://?selfhostBackendUrl=${constants.APP_EDITION === AppEdition.SELFHOSTED ? constants.API_URL : ""}&selfhostAdminUrl=${constants.APP_EDITION === AppEdition.SELFHOSTED ? constants.SPARROW_ADMIN_URL : ""}&selfhostWebUrl=${constants.APP_EDITION === AppEdition.SELFHOSTED ? constants.SPARROW_WEB_URL : ""}&accessToken=${accessToken}&refreshToken=${refreshToken}&response=${response}&event=register&method=email`;
			const sparrowWebRedirect =
				constants.SPARROW_WEB_URL +
				`?accessToken=${accessToken}&refreshToken=${refreshToken}&response=${response}&event=register&method=email`;
			const sparrowAdminRedirect =
				constants.SPARROW_ADMIN_URL +
				`?accessToken=${accessToken}&refreshToken=${refreshToken}&response=${response}&event=login&method=code`;

			if (redirctSource === 'desktop') {
				redirectRules.title = `Welcome ${firstName}`;
				setTimeout(() => {
					redirectRules.description = `Redirecting you to desktop app...`;
					redirectRules.message = `the token if you are facing any issue in redirecting to the login page`;
					redirectRules.loadingMessage = '';
					redirectRules.isSpinner = false;
					navigate(sparrowRedirect);
					redirectRules.buttonClick = () => {
						navigate(sparrowRedirect);
					};
					redirectRules.copyLink = () => {
						if (navigator.clipboard) {
							notifications.success('Link copied to clipboard.');
							return navigator.clipboard.writeText(sparrowRedirect);
						}
					};
				}, 5000);
			} else if (redirctSource === 'admin') {
				navigate(sparrowAdminRedirect);
			} else {
				navigate(sparrowWebRedirect);
			}
		} else {
			const flow =
				plan.title === 'Standard' ? 'signup_standard_trial' : 'signup_professional_trial';
			const trialperiod = billingPeriod === 'monthly' ? 'monthly' : 'annual';
			const url =
				constants.SPARROW_ADMIN_URL +
				`?accessToken=${accessToken}&refreshToken=${refreshToken}&response=${response}&name=${firstName}&flow=${flow}&trialPeriod=${trialperiod}&email=${email}&source=${redirctSource}`;
			navigate(url);
			return;
		}
	}

	function handleCompareClick() {
		window.open(constants.SPARROW_MARKETING_URL + '/pricing/#pricing-comparison', '_blank');
	}
</script>

{#if isRegistered}
	<Redirect
		title={redirectRules.title}
		description={redirectRules.description}
		message={redirectRules.message}
		isSpinner={redirectRules.isSpinner}
		buttonText={redirectRules.buttonText}
		buttonClick={redirectRules.buttonClick}
		copyLink={redirectRules.copyLink}
		loadingMessage={redirectRules.loadingMessage}
	/>
{:else}
	<div class="d-flex justify-content-center align-items-center min-vh-100">
		<div
			class="rounded shadow-lg p-4 gap-3"
			style="background-color: #181C26; overflow-y: auto; max-height: 90vh;"
		>
			<div class="text-white mb-3">
				<h5>Welcome to Sparrow! Let’s find the right plan for you</h5>
				<p class="sparrow-fs-14" style="color: #D8D8D9; margin-bottom: 0">
					Before you dive in, take a moment to explore the plans we offer, from free to fully
					loaded. You can switch plans at any time.
				</p>
			</div>

			<!-- Billing toggle -->
			<div
				class="d-flex align-items-center gap-2 rounded p-2 border mb-4"
				style="width: 310px; height: 36px; padding: 8px; border-width: 1px;"
			>
				<button
					class="flex-fill m-0 py-1 rounded border-0"
					style="font-size: 12px; font-weight: 400; background-color: {billingPeriod === 'monthly'
						? '#222630'
						: 'transparent'}; color: {billingPeriod === 'monthly' ? '#fff' : '#D8D8D9'};"
					on:click={() => (billingPeriod = 'monthly')}
				>
					Monthly billing
				</button>
				<button
					class="flex-fill m-0 py-1 rounded border-0"
					style="font-size: 12px; font-weight: 400; background-color: {billingPeriod === 'annual'
						? '#222630'
						: 'transparent'}; color: {billingPeriod === 'annual' ? '#fff' : '#D8D8D9'};"
					on:click={() => (billingPeriod = 'annual')}
				>
					Annual billing
				</button>
			</div>
			<!-- Stacked pricing cards -->
			<div class="d-flex" style="gap: 6px">
				{#each pricingPlans as plan}
					<div class="flex-fill" style="min-width: 280px;">
						<PricingCard
							title={plan.title}
							price={plan.price}
							period={plan.period}
							features={plan.features}
							buttonText={plan.buttonText}
							savings={plan.savings}
							onButtonClick={() => handlePlanSelect(plan)}
							onCompareClick={handleCompareClick}
							compareText={'Compare Plans'}
						/>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style></style>
