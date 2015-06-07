angular.module('App', [
    'ngSanitize',
    'App.controllers',
]).config(['$logProvider', function($logProvider) {
    'use strict';

    // Enable/Disable debug logs.
    $logProvider.debugEnabled(true);
}]).run(['$rootScope', '$log', function($rootScope, $log) {
    'use strict';
    $rootScope.href = 'https://pitstop15.herokuapp.com/';

}]);
