angular.module('wedding.constants', [])

.constant('AUTH_EVENTS', {
	loginSuccess: 'auth-login-success',
	loginFailed: 'auth-login-failed',
	logoutSuccess: 'auth-logout-success',
	sessionTimeout: 'auth-session-timeout',
	notAuthenticated: 'auth-not-authenticated',
})

.constant('USER_ROLES', {
	user: 'user',
	guest: 'guest',
});
