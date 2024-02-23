<script lang="ts">
	import { Router, Route } from 'svelte-navigator';
	import 'font-awesome/css/font-awesome.css';
	import LoginPage from './pages/Auth/login-page/LoginPage.svelte';
	import RegisterPage from './pages/Auth/register-page/RegisterPage.svelte';
	import Navigate from './routing/Navigate.svelte';

	import UpdatePassword from './pages/Auth/update-password/UpdatePassword.svelte';
	import ResetPassword from './pages/Auth/reset-password/ResetPassword.svelte';
	import ForgotPassword from './pages/Auth/forgot-password/ForgotPassword.svelte';
	import OauthRedirect from './pages/Auth/oauth-redirect/OauthRedirect.svelte';
	import AuthSuccess from './pages/Auth/auth-success/AuthSuccess.svelte';
	import EntryPoint from './pages/Auth/entry-point/EntryPoint.svelte';
	import Redirect from './pages/Auth/redirect/Redirect.svelte';

	export let url = '/';
</script>

<Router {url}>
	<Route path="/forgot/password" component={ForgotPassword} />
	<Route path="/login/:id" component={LoginPage} />
	<Route path="/login" component={LoginPage} />
	<Route path="/init" component={EntryPoint} />
	<Route path="/register/:id" component={RegisterPage} />
	<Route path="/register" component={RegisterPage} />
	<Route path="/update/password" component={UpdatePassword} />
	<Route path="/reset/password" component={ResetPassword} />
	<Route path="/redirect" component={Redirect} />
	<Route path="/success" component={AuthSuccess} />
	<Route path="/*"><Navigate to="/init" /></Route>
</Router>

<style>
</style>
