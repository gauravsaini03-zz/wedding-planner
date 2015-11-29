angular.module('wedding.constants', [])

.constant('AUTH_EVENTS', {
	updateUser: 'update-user',
	notAuthorized: 'auth-not-authorized',
	notAuthenticated: 'auth-not-authenticated',
})

.constant('USER_ROLES', {
	user: 'user',
	guest: 'guest',
});
