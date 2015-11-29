angular.module('wedding.services', [])

.factory('AuthService', function ($http, $q, USER_ROLES, $firebaseObject, $rootScope, AUTH_EVENTS) {
 	var authService 	= {},
 		user  			= '',
		role			= '',		
		isAuthenticated	= false;

	if (window.localStorage.getItem("firebase:session::weddingplanner")) {
    	isAuthenticated = true;
    	role = USER_ROLES.user;
    }

	authService.login = function (credentials) {

		var deferred = $q.defer();

		fbase.authWithPassword({
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

		fbase.createUser({
			email    : credentials.email,
			password : credentials.password
		}, function(error, userData) {
			if (error) {
				console.log("Error creating user:", error);
				deferred.reject(error);
			} else {
				fbase.child("users").child(userData.uid).set({
			      name: credentials.name,
			      email: credentials.email
			    });
				deferred.resolve();
				console.log("Successfully created user account with uid:", userData.uid);
			}
		});
		return deferred.promise;
	};

	authService.logout = function () {
		fbase.unauth();
		isAuthenticated = false;
      	$rootScope.$broadcast(AUTH_EVENTS.updateUser);
	};
 
	authService.getUser = function () {
		return JSON.parse(window.localStorage.getItem("firebase:session::weddingplanner"));
  	}
	
	authService.setUser = function (res) {
		user = $firebaseObject(fbase.child('users').child(res.uid));
		isAuthenticated = true;
		role = USER_ROLES.user;

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