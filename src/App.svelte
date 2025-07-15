<script lang="ts">
	import { Router, Route } from 'svelte-navigator';
	import 'font-awesome/css/font-awesome.css';
	import LoginPage from './pages/Auth/login-page/LoginPage.svelte';
	import RegisterPage from './pages/Auth/register-page/RegisterPage.svelte';
	import Navigate from './routing/Navigate.svelte';
	import Toast from '$lib/components/toast-notification/ToastNotification.svelte';
	import UpdatePassword from './pages/Auth/update-password/UpdatePassword.svelte';
	import ResetPassword from './pages/Auth/reset-password/ResetPassword.svelte';
	import ForgotPassword from './pages/Auth/forgot-password/ForgotPassword.svelte';
	import OauthRedirect from './pages/Auth/oauth-redirect/OauthRedirect.svelte';
	import EntryPoint from './pages/Auth/entry-point/EntryPoint.svelte';
	import SparrowBackgroundV2 from '$lib/assets/SparrowBackgroundV2.svg';
	import ExternalNavigation from './routing/ExternalNavigation.svelte';
	import constants from '$lib/utils/constants';
	import VerifyEmail from './pages/Auth/verify-email/VerifyEmail.svelte';
	import VerifyMagicCode from './pages/Auth/verify-magic-code/VerifyMagicCode.svelte';
	import CoolDownPage from './pages/Auth/cool-down-page/CoolDownPage.svelte';
	import PasswordLogin from './pages/Auth/password-login/PasswordLogin.svelte';
	import PasswordUpdateRedirect from './pages/Auth/password-update-redirect/PasswordUpdateRedirect.svelte';
	import TeamInviteAcceptance from './pages/Auth/team-invite-acceptance/TeamInviteAcceptance.svelte';
	import ResendInviteTeam from './pages/Auth/resend-invite-team/ResendInviteTeam.svelte';
	import Plans from './pages/Auth/plans/Plans.svelte';
	export let url = '/';
</script>

<Router {url}>
	<!-- MagicCodeOriginPage
	Initial page shown when the app starts -->
	<Route path="/init" component={EntryPoint} />

	<!-- MagicCodeVerificationPage (OTP)
	OTP verification page for authenticating with a magic code -->
	<Route path="/verify-magic-code/:id/:name" component={VerifyMagicCode} />

	<!-- EmailEntryPage
	Page where the user enters their email, redirecting to login or registration based on context -->
	<Route path="/password-login" component={PasswordLogin} />

	<!-- LoginPage
	User login page with an optional ID parameter for specific login contexts -->
	<Route path="/login/:id" component={LoginPage} />
	<Route path="/login" component={LoginPage} />

	<!-- RegisterPage
	User registration page with an optional ID parameter for specific registration contexts -->
	<Route path="/register/:id" component={RegisterPage} />
	<Route path="/register" component={RegisterPage} />

	<!-- EmailVerificationPage (OTP)
	OTP verification page for email verification during registration -->
	<Route path="/verify/email/:id" component={VerifyEmail} />

	<!-- ForgotPasswordPage
	Page where the user enters their email to initiate the password reset process -->
	<Route path="/forgot/password" component={ForgotPassword} />

	<!-- UpdatePasswordVerificationPage (OTP)
	OTP verification page for updating the user's password -->
	<Route path="/update/password/:id" component={UpdatePassword} />

	<!-- UpdatePasswordOriginPage 
	Page where the user sets a new password -->
	<Route path="/reset/password/:id/:code" component={ResetPassword} />

	<!-- UpdatePasswordRedirectPage
	Redirect page to the login page after a successful password change -->
	<Route path="/password-update-redirect/:id" component={PasswordUpdateRedirect} />

	<!-- OauthRedirectPage 
	Redirect page that listens for oAuth tokens -->
	<Route path="/redirect" component={OauthRedirect} />

	<!-- Team invite acceptance page that accepts teams invite -->
	<Route path="/accept-team-invite/:teamId/:inviteId/:email" component={TeamInviteAcceptance} />

	<!-- Team invite acceptance page that accepts teams invite -->
	<Route path="/resend-invite/:teamId/:inviteId" component={ResendInviteTeam} />

	<!-- CooldownPage
	Page displayed when the user has triggered too many requests, enforcing a cooldown period -->
	<Route path="/cool-down-active" component={CoolDownPage} />

	<!-- PlansPage
	Page displayed about different plans including different time periods -->
	<Route path="/plans" component={Plans} />

	<!-- Support page that opens the user's default email client with a pre-filled support email -->
	<Route path="/support">
		<ExternalNavigation to={`mailto:${constants.SPARROW_SUPPORT_EMAIL}`} />
	</Route>

	<!-- Wildcard route that redirects any unmatched paths to the entry point page -->
	<Route path="/*"><Navigate to="/init" /></Route>
</Router>
<Toast />

<div
	style="height: 100vh; top:0; left:0;
right:0; z-index:-100 !important"
	class="w-100 position-fixed"
>
	<img src={SparrowBackgroundV2} alt="" style="height:100%; width:100%;" />
</div>
