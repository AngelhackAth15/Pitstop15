angular.module('App.directives', []).

/**
 * test-deirective
 */
directive('test', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var el = angular.element(element);
        }
    };
}]);
