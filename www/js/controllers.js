angular.module('wedding.controllers', [])

.controller('AppCtrl', function($scope, $state, AuthService, AUTH_EVENTS, $rootScope, $ionicLoading, $firebaseObject, $ionicHistory, $ionicPopup, $timeout, $ionicSideMenuDelegate) {

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
		//$ionicHistory.clearCache();
        //$ionicHistory.clearHistory();
        $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
		$state.go('app.dashboard');
		$ionicSideMenuDelegate.toggleLeft(false);
	}

	$rootScope.$on(AUTH_EVENTS.notAuthorized, function(event) {
	    var alertPopup = $ionicPopup.alert({
	      title: 'Unauthorized!',
	      template: 'Please login to access this resource.'
	    });
	});
	 
	$rootScope.$on(AUTH_EVENTS.updateUser, function(event) {
	    $scope.isAuthenticated = AuthService.isAuthenticated();
	    $scope.currentUser = AuthService.getUser();
	    if($scope.currentUser) {
			$scope.user = $firebaseObject(fbase.child('users').child($scope.currentUser.uid));
		}
	});

	$rootScope.$on("ERROR_HANDLER", function(event, err) {
	    var alertPopup = $ionicPopup.alert({
	      title: 'Error Message',
	      template: err
	    });
	});

	$rootScope.$on('loading:show', function(event, message) {
	    $ionicLoading.show({template: message})
	})

	$rootScope.$on('loading:hide', function() {
	    $ionicLoading.hide()
	})

})

.controller('LoginCtrl', function($scope, AuthService, $state, $rootScope, AUTH_EVENTS) {
	
	$scope.loginData = {};
	
	$scope.loginEmail = function(){
		AuthService.login($scope.loginData).then(function (user) {
	      	$rootScope.$broadcast(AUTH_EVENTS.updateUser);
			$state.go('app.profile');
	    }, function (err) {
	      	$rootScope.$broadcast("ERROR_HANDLER", err);
	    });
	};
	
})

.controller('SignupCtrl', function($scope, $rootScope, AuthService, $state, $ionicPopup, $ionicAnalytics) {
	
	$scope.signupData = {};

	$scope.signupEmail = function(){  
		AuthService.signup($scope.signupData).then(function (user) {
			$state.go('login');
			$ionicAnalytics.track('Signup', {
			    name: $scope.signupData.name
			});
	    }, function (err) {
	    	$rootScope.$broadcast("ERROR_HANDLER", err);
	    });
	};
	
})

.controller('GuestListCtrl', function($scope, $rootScope, AuthService, $state, $firebaseArray, $ionicPopup, $firebaseArray, $ionicModal, $stateParams) {

	$scope.guests = $firebaseArray(fbase.child("guests").child(AuthService.getUser().uid));

	$rootScope.$broadcast('loading:show', 'Loading Guests...');

	$scope.guests.$loaded().then(function(notes) {
	   $rootScope.$broadcast('loading:hide');
	});

	$ionicModal.fromTemplateUrl('addGuest.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.modal = modal;
	});
	
	$scope.guest = {};

	// Add new Guest
	$scope.saveGuest = function() {
		$firebaseArray(fbase.child("guests").child(AuthService.getUser().uid)).$add($scope.guest);
	    $scope.modal.hide();
	};

})

.controller('GuestCtrl', function($scope, AuthService, $state, $firebaseArray, $stateParams,$firebaseObject) {
	$scope.guest = $firebaseObject(fbase.child("guests").child(AuthService.getUser().uid).child($stateParams.guestId));
	
	$scope.deleteGuest = function () {
		$firebaseObject(fbase.child("guests").child(AuthService.getUser().uid).child($stateParams.guestId)).$remove();
		$state.go('app.guestList');
	}
})

.controller('budgetCalCtrl', function($scope, $firebaseArray, AuthService) {
	
	$scope.budgetCalculator = $firebaseArray(fbase.child("budgetCalculator/" + AuthService.getUser().uid));
	$scope.budgetCalculator.$loaded().then(function(notes) {
		var weddingBudget = 0;
		for (i = 0; i < $scope.budgetCalculator.length; i++) { 
			weddingBudget = Number(weddingBudget) + Number($scope.budgetCalculator[i].$value);
		}
		console.log("== weddingBudget 11 =="+weddingBudget);
		$scope.weddingBudget = weddingBudget;
	});
	
	$scope.addAmont = function(amount){
		fbase.child("budgetCalculator").child(AuthService.getUser().uid).push(amount);
		$scope.budgetCalculator.$loaded().then(function(notes) {
			var weddingBudget = 0;
			for (i = 0; i < $scope.budgetCalculator.length; i++) { 
				weddingBudget = Number(weddingBudget) + Number($scope.budgetCalculator[i].$value);
			}
			console.log("== weddingBudget 22 =="+weddingBudget);
			$scope.weddingBudget = weddingBudget;
		});
	};
	
	/*$scope.getTotal = function(budgetCalculator){
		var totalBudget = 0;
		for (i = 0; i < budgetCalculator.length; i++) { 
			totalBudget = Number(totalBudget) + Number(budgetCalculator[i].$value);
		}
		$scope.totalBudget = totalBudget;
	};*/
	
})

.controller('VendorListCtrl', function($scope, AuthService, $state, $FirebaseArray, $ionicPopup, $firebaseArray, $ionicModal, $stateParams) {

	/*var ref = new Firebase(base + '/vendors/' + AuthService.getUser().uid);
	var posts = $firebaseArray(ref);*/

	$scope.vendors = $firebaseArray(fbase.child("vendors/" + AuthService.getUser().uid));
	console.log($scope.vendors);
	$ionicModal.fromTemplateUrl('addVendor.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.modal = modal;
	});
	
	$scope.vendor = {};

	// Add new Vendor
	$scope.saveVendor = function() {
	    console.log($scope.vendor)
		fbase.child("vendors").child(AuthService.getUser().uid).push($scope.vendor);
	    $scope.modal.hide();
	};

	  // Execute action on hide modal
	$scope.$on('modal.hidden', function() {
	    // Execute action
	});
	
})

.controller('VendorCtrl', function($scope, AuthService, $state, $firebaseArray, $stateParams,$firebaseObject) {
	$scope.vendor = $firebaseObject(fbase.child("vendors").child(AuthService.getUser().uid).child($stateParams.vendorId));
	$scope.deleteVendor = function () {
		fbase.child("vendors").child(AuthService.getUser().uid).child($stateParams.vendorId).remove();
		$state.go(app.vendorlist)
	}
})

.controller('ProfileCtrl', function($scope, AuthService, $state, $firebaseArray, $stateParams,$firebaseObject) {
	$scope.currentUser = AuthService.getUser();
    if($scope.currentUser) {
		$scope.user = $firebaseObject(fbase.child('users').child($scope.currentUser.uid));
		$scope.profileImage = AuthService.getUser().password.profileImageURL;

	}
});


