angular.module('wedding.services', [])

.factory('AuthService', function ($http, USER_ROLES) {
 	var authService 	= {},
		role			= '',		
		isAuthenticated	= false;

	authService.login = function (credentials) {

		return fb.authWithPassword({
			email    : credentials.email,
			password : credentials.password
		}, function(error, authData) {
			if (error) {
				console.log("Login Failed!", error);
			} else {
				console.log("Authenticated successfully with payload:", authData);
				authService.setUser(authData);
			}
		});
	};

	authService.signup = function (credentials) {

		return fb.createUser({
			email    : credentials.email,
			password : credentials.password
		}, function(error, userData) {
			if (error) {
				console.log("Error creating user:", error);
			} else {
				console.log("Successfully created user account with uid:", userData.uid);
				authService.setUser(userData)
			}
		});
	};

	authService.logout = function () {
		isAuthenticated = false;
		authService.removeUser();
	};
 
	authService.getUser = function () {
		var token = window.localStorage.getItem("AUTH_TOKEN");
		if (token) {
		  useCredentials(token);
		}
		return token;
  	}
	
	authService.setUser = function (res) {
		console.log(res)
		window.localStorage.setItem("AUTH_TOKEN", res.token);
	    //$http.defaults.headers.common['X-Auth-Token'] = res.token;
		isAuthenticated = true;
		role = USER_ROLES.user
  	}

	authService.removeUser = function ()  {
		//$http.defaults.headers.common['X-Auth-Token'] = undefined;
		window.localStorage.removeItem("AUTH_TOKEN");
  	}
 	
	authService.isAuthenticated = function () {
		return isAuthenticated;
	};

	authService.role = function () {
		return role;
	};
 
	authService.isAuthorized = function (authorizedRoles) {
		if (!angular.isArray(authorizedRoles)) {
		  authorizedRoles = [authorizedRoles];
		}
		return (authService.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
	};

 
  return authService;

})