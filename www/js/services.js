angular.module('wedding.services', [])

.factory('AuthService', function ($http, $q, USER_ROLES) {
 	var authService 	= {},
		role			= '',		
		isAuthenticated	= false;

	if (window.localStorage.getItem("AUTH_TOKEN")) {
      isAuthenticated = true;
    }

	authService.login = function (credentials) {

		var deferred = $q.defer();

		fb.authWithPassword({
			email    : credentials.email,
			password : credentials.password
		}, function(error, authData) {
			if (error) {
				console.log("Login Failed!", error);
				deferred.reject(error);
			} else {
				console.log("Authenticated successfully with payload:", authData);
				authService.setUser(authData);
				deferred.resolve();
			}
		});
		return deferred.promise;
	};

	authService.signup = function (credentials) {

		var deferred = $q.defer();

		fb.createUser({
			email    : credentials.email,
			password : credentials.password
		}, function(error, userData) {
			console.log(userData)
			if (error) {
				console.log("Error creating user:", error);
				deferred.reject(error);
			} else {
				fb.child("users").child(userData.uid).set({
			      provider: "password",
			      name: credentials.name
			    });
				deferred.resolve();
				console.log("Successfully created user account with uid:", userData.uid);
			}
		});
		return deferred.promise;
	};

	authService.logout = function () {
		isAuthenticated = false;
		authService.removeUser();
	};
 
	authService.getUser = function () {
		var token = window.localStorage.getItem("AUTH_TOKEN");
		return token;
  	}
	
	authService.setUser = function (res) {
		console.log(res)
		window.localStorage.setItem("AUTH_TOKEN", res.token);
	    //$http.defaults.headers.common['X-Auth-Token'] = res.token;
		isAuthenticated = true;
		role = USER_ROLES.user;
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
		return (authService.isAuthenticated() && authorizedRoles.indexOf(role) !== -1);
	};
 
  	return authService;

})