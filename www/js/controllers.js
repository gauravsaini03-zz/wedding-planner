angular.module('wedding.controllers', [])

.controller('AppCtrl', function($scope, AuthService, AUTH_EVENTS) {

  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
	$scope.isAuthorized = AuthService.isAuthorized;
	$scope.currentUser = AuthService.getUser();

	$scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
	    var alertPopup = $ionicPopup.alert({
	      title: 'Unauthorized!',
	      template: 'You are not allowed to access this resource.'
	    });
	});
	 
	$scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
	    AuthService.logout();
	    $state.go('app.dashboard');
	    var alertPopup = $ionicPopup.alert({
	      title: 'Session Lost!',
	      template: 'Sorry, You have to login again.'
	    });
	});
})

.controller('LoginCtrl', function($scope, AuthService) {
	
	$scope.loginData = {};
	
	$scope.loginEmail = function(){
		console.log($scope.loginData)

		AuthService.login($scope.loginData).then(function (user) {
	      	//$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
			$state.go('app.profile');
	    }, function (err) {
	    	console.log(err)
			var alertPopup = $ionicPopup.alert({
			  title: 'Login failed!',
			  template: 'Please check your credentials'
			});
	      	//$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
	    });
	 
	};
	
})

.controller('SignupCtrl', function($scope, AuthService) {
	
	$scope.signupData = {};
	$scope.signupEmail = function(){  
		console.log($scope.signupData)

 		
		AuthService.signup($scope.signupData).then(function (user) {
	      	//$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
			$state.go('app.profile');
	    }, function (err) {
	    	console.log(err)
			var alertPopup = $ionicPopup.alert({
			  title: 'Signup failed!',
			  template: "signup not"
			});
	      	//$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
	    });

		
	 
	};
	
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
