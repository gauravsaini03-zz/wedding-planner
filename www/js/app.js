// Wedding App

angular.module('wedding', ['ionic', 'wedding.controllers', 'wedding.constants', 'wedding.services', 'firebase'])

.run(function($ionicPlatform, $rootScope, $state, AuthService) {
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
 	fb = new Firebase("https://weddingplanner.firebaseio.com");
  });

  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
 
    if ('data' in next && 'authorizedRoles' in next.data) {
      var authorizedRoles = next.data.authorizedRoles;
      if (!AuthService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        $state.go($state.current, {}, {reload: true});
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      }
    }
 
    if (!AuthService.isAuthenticated()) {
      if (next.name == 'app.profile') {
        event.preventDefault();
        $state.go('login');
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
    }
  })

  .state('app.todoList', {
	url: '/todolist',
	views: {
	  'menuContent': {
	    templateUrl: 'templates/todoList.html',
	    controller: 'TodoListCtrl'
	  }
	}
  })

  .state('app.todo', {
    url: '/todolist/:todoId',
    views: {
      'menuContent': {
        templateUrl: 'templates/todo.html',
        controller: 'TodoCtrl'
      }
    }
  })
  
  .state('app.myVendors', {
    url: '/myvendors',
    views: {
      'menuContent': {
        templateUrl: 'templates/myVendors.html'
      }
    }
  })
  
  .state('app.guestList', {
    url: '/guestlist',
    views: {
      'menuContent': {
        templateUrl: 'templates/guestList.html'
      }
    }
  })

  .state('app.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile.html'
      }
    },
    data: {
      authorizedRoles: [USER_ROLES.user]
    } 
  });
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dashboard');
});
