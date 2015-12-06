// Wedding App

angular.module('wedding', ['ionic', 'wedding.controllers', 'wedding.constants', 'wedding.services', 'ionic.service.core', 'ionic.service.analytics', 'firebase'])

.run(function($ionicPlatform, $ionicAnalytics, $rootScope, $state, AuthService, AUTH_EVENTS) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // Initialising Firebase object
 	fbase = new Firebase("https://weddingplanner.firebaseio.com");

 	var io = Ionic.io();
 	console.log(io);
	var user = Ionic.User.current();
	console.log(user);
 	// Ionic Analytics
 	$ionicAnalytics.register();
 	$ionicAnalytics.setGlobalProperties({
	  app_version_number: 'v0.0.1',
	  day_of_week: (new Date()).getDay()
	});
  });

  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
 
    if ('data' in next && 'authorizedRoles' in next.data) {
      var authorizedRoles = next.data.authorizedRoles;
      if (!AuthService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        if($state.current.name.length == 0) {
        	$state.go('login')
        } else {
        	$state.go($state.current, {}, {reload: true});
        	$rootScope.$broadcast(AUTH_EVENTS.notAuthorized);	
        }
      }
    }
 
    if (AuthService.isAuthenticated()) {
      if (next.name == 'login') {
        event.preventDefault();
        $state.go('app.dashboard');
      }
    }
  });

})

.config(function($stateProvider, $urlRouterProvider, USER_ROLES) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'SignupCtrl'
  })
  
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  
  .state('app.dashboard', {
    url: '/dashboard',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html'
      }
    }
  })
  
  .state('app.budget', {
    url: '/budget',
    views: {
      'menuContent': {
        templateUrl: 'templates/budget.html',
        controller: 'budgetCalCtrl'
      }
    },
    data: {
      authorizedRoles: [USER_ROLES.user]
    }
  })

  .state('app.todoList', {
	url: '/todolist',
	views: {
	  'menuContent': {
	    templateUrl: 'templates/todoList.html'
	  }
	},
	data: {
      authorizedRoles: [USER_ROLES.user]
    }
  })

  .state('app.todo', {
    url: '/todolist/:todoId',
    views: {
      'menuContent': {
        templateUrl: 'templates/todo.html',
        controller: 'TodoCtrl'
      }
    },
    data: {
      authorizedRoles: [USER_ROLES.user]
    }
  })
  
  .state('app.myVendors', {
    url: '/myvendors',
    views: {
      'menuContent': {
        templateUrl: 'templates/myVendors.html',
        controller: 'VendorListCtrl'
      }
    },
    data: {
      authorizedRoles: [USER_ROLES.user]
    }
  })
  
  .state('app.vendor', {
    url: '/vendorlist/:vendorId',
    views: {
      'menuContent': {
        templateUrl: 'templates/vendor.html',
        controller: 'VendorCtrl'
      }
    },
    data: {
      authorizedRoles: [USER_ROLES.user]
    }
  })
  
  .state('app.guestList', {
    url: '/guestlist',
    views: {
      'menuContent': {
        templateUrl: 'templates/guestList.html',
        controller: 'GuestListCtrl'
      }
    },
    data: {
      authorizedRoles: [USER_ROLES.user]
    }
  })

  .state('app.guest', {
    url: '/guestlist/:guestId',
    views: {
      'menuContent': {
        templateUrl: 'templates/guest.html',
        controller: 'GuestCtrl'
      }
    },
    data: {
      authorizedRoles: [USER_ROLES.user]
    }
  })

  .state('app.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
      }
    },
    data: {
      authorizedRoles: [USER_ROLES.user]
    } 
  });
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dashboard');
});
