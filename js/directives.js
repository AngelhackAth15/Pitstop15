angular.module('App.directives', []).

/**
 * active-menu
 */
directive('activeMenu', ['$timeout' ,function($timeout) {
    return {
        restrict: 'A',
        link: function(rootScope, scope, element, attrs) {
            var el = angular.element(element),
                menuHref = $('.menu-list a');

            angular.forEach(menuHref, function(value, key){
                if (rootScope.href.indexOf(value)>-1){
                    $(value).addClass('active');
                }else if(rootScope.href.indexOf('preview')>-1){
                    $('.archive').addClass('active');
                }
            });
        }
    };
}]).

/**
 * video-details
 */
directive('videoDetails', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var el = angular.element(element);

            scope.orgName = attrs.org;
            scope.videoKey = attrs.key;
        }
    };
}]).

/**
 * active
 */
directive('active', [function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var el = angular.element(element);

            el.click(function(){
                $('.publish-tabs .active').removeClass('active');
                el.addClass('active');
            });

            
        }
    };
}]).

/**
 * storage-tabs
 */
directive('storageActiveTab', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var el = angular.element(element),
                tab = el.find('a'),
                tabLi = el.find('li');
            
            var findActiveTab = function(){

                angular.forEach(tabLi, function(value, key) {

                    if($(value).hasClass('active')) {
                        switch (key) {
                            case 0: 
                                location.hash = 'user_details';
                                break;
                            case 1:
                                location.hash = 'org_details';
                                break;
                            case 2:
                                location.hash = 'social_channels';
                                break;
                        }   
                    } 
                });
            };    

            tab.on('click', function () {
                findActiveTab();
            });
            
        }
    };
}]).

directive('equals', [function() {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
        link: function(scope, elem, attrs, ngModel) {
            if(!ngModel) return; // do nothing if no ng-model

            // watch own value and re-validate on change
            scope.$watch(attrs.ngModel, function() {
                validate();
            });

            // observe the other value and re-validate on change
            attrs.$observe('equals', function (val) {
                validate();
            });

            var validate = function() {
                // values
                var val1 = ngModel.$viewValue;
                var val2 = attrs.equals;

                // set validity
                ngModel.$setValidity('equals', ! val1 || ! val2 || val1 === val2);
            };
        }
    };
}]).

/**
 * check-window-dimensions
 */
directive('checkWindowDimensions', ['$window', function($window) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var el = angular.element(element);

            // check window width on init
            scope.$watch(function(){
                return $window.innerWidth;
            },  function(value) {
                if(value<=1400){
                    el.addClass('toggled');
                    scope.toggle = true;
                } 
            });

            // check window width on resize
            $(window).resize(function(){
                scope.$apply(function(){
                    if(window.innerWidth<=1400){
                        el.addClass('toggled');
                        scope.toggle = true;
                    }
                    else{
                        el.removeClass('toggled');
                        scope.toggle = false;
                    }
                });
            });
        }
    };
}]).

/**
 * activate-tab
 */
directive('activateTab', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var el = angular.element(element),
                href = location.href,
            	newhref = '';
                if (href.indexOf('#')){
                    href = href.split('#')[0];
                }
            
            el.click(function (e){
                e.preventDefault();
                $('.active').removeClass('active');
            	scope.activeTab = element.context.innerHTML.toLowerCase();
                scope.activeTab = scope.activeTab.replace(/\s+/g, '');

                $('.'+scope.activeTab+'-tab').addClass('active');
                $('.insights').addClass('active');

            	newhref = href +'#'+scope.activeTab;
            	location.href = newhref;

                if(scope.activeTab === 'locations'){
                    $('.datepicker-container').hide();
                    $('.date-picker-group-container').hide();
                }else{
                    $('.datepicker-container').show();
                    $('.date-picker-group-container').show();
                }

                if(scope.activeTab === 'overview' || scope.activeTab === 'audience' || scope.activeTab === 'engagement'){
                    $('.select-video-container').hide();
                }else{
                    $('.select-video-container').show();
                }

                if(scope.activeTab === 'trending'){
                    $('.filters-container').hide();
                }else{
                    $('.filters-container').show();
                }

                //trigger event to controller
                scope.$broadcast('activeTab', scope.activeTab);
            });
        }
    };
}]).

/**
 * input-value
 */
directive('inputValue', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var el = angular.element(element);
            scope.val = attrs.inputValue;
        }
    };
}]).

/**
 * facebook-share-value
 */
directive('facebookShareValue', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var el = angular.element(element);
            scope.facebookShareTitle = attrs.facebookShareValue;
        }
    };
}]).

/**
 * datatable
 * Activate datatable plugin
 */
directive('datatable', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var el = angular.element(element);
            el.DataTable({
                "fnDrawCallback": function(oSettings) {
                    if (oSettings._iDisplayLength > oSettings.fnRecordsDisplay()) {
                        $(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
                    }
                }
            });
        }
    };
}]).

/**
 * editable
 */
directive('editable', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var el = angular.element(element);

            el.editable({
                mode: 'inline'
            });

        }
    };
}]).

/**
 * toggle-radio-suitable
 */
directive('toggleRadioSuitable', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var el = angular.element(element);

            scope.suitableVal = attrs.val;

            if(scope.suitableVal==1){
                scope.toggleClassSuitable= "on";
                scope.toggleTxtSuitable= "yes";

            }else{
                scope.toggleClassSuitable= "off";
                scope.toggleTxtSuitable= "no";
            }

        }
    };
}]).

/**
 * toggle-radio-suitable
 */
directive('toggleRadioMusic', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var el = angular.element(element);

            scope.musicVal = attrs.val;

            if(scope.musicVal==1){
                scope.toggleClassMusic= "on";
                scope.toggleTxtMusic= "yes";

            }else{
                scope.toggleClassMusic= "off";
                scope.toggleTxtMusic= "no";
            }

        }
    };
}]).

/**
 * scroll-on-click
 */
directive('scrollOnClick', [function() {
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.on('click', function() {
                $('body').animate({scrollTop: element.offset().top}, 'slow');
            });
        }
    };
}]).

/**
 * upload-logo
 */
directive('uploadLogo', ['$rootScope', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var el = angular.element(element);

            el.fileapi({
                url: '/organization/'+attrs.uploadLogo+'/upload_logo',
                accept: 'image/*',
                imageSize: {
                    minWidth: 120,
                    minHeight: 120
                },
                elements: {
                    active: {
                        show: '.js-upload',
                        hide: '.js-browse'
                    },
                    preview: {
                        el: '.js-preview',
                        width: 120,
                        height: 120
                    },
                    progress: '.js-progress'
                },
                onSelect: function(evt, ui) {
                    var file = ui.files[0];

                    if (typeof file === 'undefined') {
                        var msg = 'Please reload and try again';
                        $rootScope.alertSuccess.html(msg).fadeIn();
                        setTimeout(function() {
                            $rootScope.alert.fadeOut();
                        }, 3000);

                    }

                    if (!FileAPI.support.transform) {
                        alert('Your browser does not support Flash :(');
                    } else if (file) {
                        $('#popup').modal({
                            closeOnEsc: true,
                            closeOnOverlayClick: false,
                            onOpen: function(overlay) {
                                $(overlay).on('click', '.js-upload', function() {
                                    $.modal().close();
                                    el.fileapi('upload');
                                });
                                $('.js-img', overlay).cropper({
                                    file: file,
                                    bgColor: '#f2f2f2',
                                    minSize: [200, 200],
                                    onSelect: function(coords) {
                                        el.fileapi('crop', file, coords);
                                    }
                                });
                            }
                        }).open();
                    }
                },
                onComplete: function(evt, ui) {

                    if (ui.status >= 200 && ui.status < 300) {
                        location.reload();
                    } else {
                        var msg = 'Please reload and try again';
                        $rootScope.alertSuccess.html(msg).fadeIn();
                        setTimeout(function() {
                            $rootScope.alert.fadeOut();
                        }, 3000);
                    }

                }
            });

        }
    };
}]).

/**
 * upload-thumbnail
 */
directive('uploadThumbnail', ['$rootScope', '$timeout', function($rootScope, $timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var el = angular.element(element);

            $timeout(function(){
            
                el.fileapi({
                    url: '/organization/'+attrs.uploadThumbnail+'/upload_thumb/'+scope.videoKey,
                    accept: 'image/*',
                    imageSize: {
                        minWidth: 300,
                        minHeight: 200
                    },
                    elements: {
                        active: {
                            show: '.js-upload',
                            hide: '.js-browse'
                        },
                        preview: {
                            el: '.js-preview',
                            width: 200,
                            height: 200
                        },
                        progress: '.js-progress'
                    },
                    onSelect: function(evt, ui) {
                        var file = ui.files[0];

                        if (typeof file === 'undefined') {
                            var msg = 'Please reload and try again';
                            $rootScope.alertSuccess.html(msg).fadeIn();
                            setTimeout(function() {
                                $rootScope.alert.fadeOut();
                            }, 3000);

                        }

                        if (!FileAPI.support.transform) {
                            alert('Your browser does not support Flash :(');
                        } else if (file) {
                            $('#popup').modal({
                                closeOnEsc: true,
                                closeOnOverlayClick: false,
                                onOpen: function(overlay) {
                                    $(overlay).on('click', '.js-upload', function() {
                                        $.modal().close();
                                        el.fileapi('upload');
                                    });
                                    $('.js-img', overlay).cropper({
                                        file: file,
                                        bgColor: '#f2f2f2',
                                        minSize: [300, 200],
                                        onSelect: function(coords) {
                                            el.fileapi('crop', file, coords);
                                        }
                                    });
                                }
                            }).open();
                        }
                    },
                    onComplete: function(evt, ui) {

                        if (ui.status >= 200 && ui.status < 300) {
                            location.reload();
                        } else {
                            var msg = 'Please reload and try again';
                            $rootScope.alertSuccess.html(msg).fadeIn();
                            setTimeout(function() {
                                $rootScope.alert.fadeOut();
                            }, 3000);
                        }

                    }
                });

            },0);
        }
    };
}]);
