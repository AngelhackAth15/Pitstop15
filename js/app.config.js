angular.module('App', [
    'ngSanitize',
    'App.services',
    'App.controllers',
    'App.directives',
    'App.filters'
]).config(['$logProvider', function($logProvider) {
    'use strict';

    // Enable/Disable debug logs.
    $logProvider.debugEnabled(true);
}]).run(['$rootScope', '$log', function($rootScope, $log) {
    'use strict';


}]);
