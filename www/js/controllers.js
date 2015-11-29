angular.module('wedding.controllers', [])

.controller('AppCtrl', function($scope, AuthService, AUTH_EVENTS, $rootScope, $firebaseObject, $ionicPopup,$timeout) {

  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
	$scope.isAuthenticated = AuthService.isAuthenticated();
	$scope.currentUser = AuthService.getUser();
    if($scope.currentUser) {
		$scope.user = $firebaseObject(fbase.child('users').child($scope.currentUser.uid));
	}
	
	$scope.logout = function() {
		AuthService.logout();
	}

	$rootScope.$on(AUTH_EVENTS.notAuthorized, function(event) {
	    var alertPopup = $ionicPopup.alert({
	      title: 'Unauthorized!',
	      template: 'Please login to access this resource.'
	    });
	});
	 
	$rootScope.$on(AUTH_EVENTS.loginSuccess, function(event) {
	    $scope.isAuthenticated = AuthService.isAuthenticated();
	});

	$rootScope.$on("ERROR_HANDLER", function(event, err) {
	    var alertPopup = $ionicPopup.alert({
	      title: 'Error Message',
	      template: err
	    });
	});
})

.controller('LoginCtrl', function($scope, AuthService, $state, $rootScope, AUTH_EVENTS) {
	
	$scope.loginData = {};
	
	$scope.loginEmail = function(){
		AuthService.login($scope.loginData).then(function (user) {
	      	$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
			$state.go('app.profile');
	    }, function (err) {
	      	$rootScope.$broadcast("ERROR_HANDLER", err);
	    });
	};
	
})

.controller('SignupCtrl', function($scope, AuthService, $state, $ionicPopup) {
	
	$scope.signupData = {};

	$scope.signupEmail = function(){  
		AuthService.signup($scope.signupData).then(function (user) {
			$state.go('login');
	    }, function (err) {
	    	$rootScope.$broadcast("ERROR_HANDLER", err);
	    });
	};
	
})

.controller('GuestListCtrl', function($scope, AuthService, $state, $ionicPopup) {

	/*var ref = new Firebase(base + '/guests/' + AuthService.getUser().uid);
	var posts = $firebaseArray(ref);*/

	$scope.guests = $firebaseArray(fb.child("guests/" + AuthService.getUser().uid));

	$ionicModal.fromTemplateUrl('addGuest.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.modal = modal;
	});

	$scope.closeModal = function() {
	    $scope.modal.hide();
	};
	
	$scope.saveGuest = function() {
	    $scope.guest = {}
	    console.log(scope.guest)
		fbase.child("guests").child(AuthService.getUser().uid).push($scope.guest);
	    $scope.modal.hide();
	};
	
	  // Execute action on hide modal
	$scope.$on('modal.hidden', function() {
	    // Execute action
	});
	
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
