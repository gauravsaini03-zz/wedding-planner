angular.module('wedding.constants', [])

.constant('AUTH_EVENTS', {
	loginSuccess: 'auth-login-success',
	logoutSuccess: 'auth-logout-success',	
	notAuthorized: 'auth-not-authorized',
	notAuthenticated: 'auth-not-authenticated',
})

.constant('USER_ROLES', {
	user: 'user',
	guest: 'guest',
});
