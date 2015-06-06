angular.module('App.controllers', []).

/**
 * Controller: PreviewController
 * PREVIEW VIEW CONTROLLER
 * STORE ALL DATA AS VIDEO-KEY, VIDEO-ORG
 */
controller('PreviewController', ['$rootScope', '$scope', '$http', '$timeout', '$interval', function($rootScope, $scope, $http, $timeout, $interval) {
    'use strict';
   
    $timeout(function() {
        $rootScope.orgName = $scope.orgName;
        $rootScope.videoKey = $scope.videoKey;
        
        // Video url to share
        $scope.shareVideoUrl = 'http://content.jwplatform.com/videos/'+$rootScope.videoKey+'.mp4';

        $scope.globalTags = [];
        $scope.jwTags = [];
        $scope.ytTags = [];
        $scope.twitterTags = [];

        $http({
            url: '/tags/all/' + $rootScope.videoKey,
            method: 'GET',
            dataType: 'JSON'
        }).success(function(data, status, headers, config) {
            $scope.twitterTagsLength = 0;

            angular.forEach(data.global_tags, function(value, key) {

                $scope.globalTags.push({
                    text: value.tag
                });

                $scope.ytTags.push({
                    text: value.tag
                });

                $scope.twitterTags.push({
                    text: '#' + value.tag
                });

                $scope.twitterTagsLength = $scope.twitterTagsLength + value.tag.length + 1;
            });

            angular.forEach(data.video_tags, function(value, key) {

                $scope.jwTags.push({
                    text: value.tag
                });

                $scope.ytTags.push({
                    text: value.tag
                });

                $scope.twitterTags.push({
                    text: '#' + value.tag
                });

                $scope.twitterTagsLength = $scope.twitterTagsLength + value.tag.length + 1;

            });

        }).error(function(data, status, headers, config) {

        });

        /**
         * Enable geolocation and send Event on video play
         * Param VideoKey, OrgName, Latitide, Longitude
         **/
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
                $scope.latPos = position.coords.latitude;
                $scope.longPos = position.coords.longitude;
                
                jwplayer().onPlay( function(event){

                    ga('send', 'event', 'geolocation', 'play', "'"+$scope.videoKey, $scope.latPos, $scope.longPos+"'");
                });
            });
        }

        $scope.submitJWTitle = function(value){
            if(value.length > 3){
                $scope.jwTitle = true;
                $http({
                    url: '/video/edit_video_title',
                    method: 'POST',
                    dataType: 'JSON',
                    data: {
                        title: value,
                        videoKey: $rootScope.videoKey
                    }
                }).success(function(data, status, headers, config) {

                    if (data.code == 200) {
                        $rootScope.alertSuccess.html(data.message).fadeIn();
                    } else if (data.code == 409) {
                        $rootScope.alertDanger.html(data.message).fadeIn();
                    }
                }).error(function(data, status, headers, config) {

                }).finally(function(){
                    $scope.jwTitle = false;
                    setTimeout(function() {
                        $rootScope.alert.fadeOut();
                    }, 3000);
                });
            }else{
                $rootScope.alertDanger.html('Please add a title').fadeIn();
                setTimeout(function() {
                    $rootScope.alert.fadeOut();
                }, 3000);
            }
        };


        $scope.submitJWDescription = function(value){
            if(value.length > 3){
                $scope.jwDesc = true;

                $http({
                    url: '/video/edit_video_description',
                    method: 'POST',
                    dataType: 'JSON',
                    data: {
                        description: value,
                        videoKey: $rootScope.videoKey
                    }
                }).success(function(data, status, headers, config) {

                    if (data.code == 200) {
                        $rootScope.alertSuccess.html(data.message).fadeIn();
                    } else if (data.code == 409) {
                        $rootScope.alertDanger.html(data.message).fadeIn();
                    }

                }).error(function(data, status, headers, config) {

                }).finally(function(){
                    $scope.jwDesc = false;
                    setTimeout(function() {
                        $rootScope.alert.fadeOut();
                    }, 3000);
                });
            }else{
                $rootScope.alertDanger.html('Please add a description').fadeIn();
                setTimeout(function() {
                    $rootScope.alert.fadeOut();
                }, 3000);
            }
        };

        $scope.submitTitle = function(value){
            if(value.length > 3){
                $scope.ytTitle = true;
                $http({
                    url: '/organization/'+ $rootScope.orgName +'/youtube_update_title/' + $rootScope.videoKey,
                    method: 'POST',
                    dataType: 'JSON',
                    data: {
                        youtubeTitle: value
                    }
                }).success(function(data, status, headers, config) {

                    if (data.code == 200) {
                        $rootScope.alertSuccess.html(data.message).fadeIn();
                    } else if (data.code == 409) {
                        $rootScope.alertDanger.html(data.message).fadeIn();
                    }
                }).error(function(data, status, headers, config) {

                }).finally(function(){
                    $scope.ytTitle = false;
                    setTimeout(function() {
                        $rootScope.alert.fadeOut();
                    }, 3000);
                });
            }else{
                $rootScope.alertDanger.html('Please add a title').fadeIn();
                setTimeout(function() {
                    $rootScope.alert.fadeOut();
                }, 3000);
            }
        };

        $scope.submitDescription = function(value){
            if(value.length > 3){
                $scope.ytDesc = true;
                $http({
                    url: '/organization/'+ $rootScope.orgName +'/youtube_update_description/' + $rootScope.videoKey,
                    method: 'POST',
                    dataType: 'JSON',
                    data: {
                        youtubeDescription: value
                    }
                }).success(function(data, status, headers, config) {

                    if (data.code == 200) {
                        $rootScope.alertSuccess.html(data.message).fadeIn();
                    } else if (data.code == 409) {
                        $rootScope.alertDanger.html(data.message).fadeIn();
                    }
                }).error(function(data, status, headers, config) {

                }).finally(function(){
                    $scope.ytDesc = false;
                    setTimeout(function() {
                        $rootScope.alert.fadeOut();
                    }, 3000);
                });
            }else{
                $rootScope.alertDanger.html('Please add a description').fadeIn();
                setTimeout(function() {
                    $rootScope.alert.fadeOut();
                }, 3000);
            }
        };

        $scope.videoLinkToShare = location.origin + '/v/' + $rootScope.videoKey;

    }, 0);

    $scope.addJWTag = function(tag) {

        var addTag = tag.text;

        $scope.ytTags.push({
            text: addTag
        });

        $scope.twitterTags.push({
            text: '#' + addTag
        });

        $http({
            url: '/tags/add_tag/' + $rootScope.videoKey,
            method: 'POST',
            dataType: 'JSON',
            data: {
                tag: addTag
            }
        }).success(function(data, status, headers, config) {
            if (data.code == 200) {
                $rootScope.alertSuccess.html(data.msg).fadeIn();
            } else if (data.code == 400) {
                $rootScope.alertDanger.html(data.msg).fadeIn();
            }
        }).error(function(data, status, headers, config) {

        }).finally(function(){
            setTimeout(function() {
                $rootScope.alert.fadeOut();
            }, 3000);
        });
    };

    $scope.removeJWTag = function(tag) {

        var removeTag = tag.text;

        $scope.ytTags.pop({
            text: removeTag
        });

        $scope.twitterTags.pop({
            text: '#' + removeTag
        });

        $http({
            url: '/tags/remove_tag/' + $rootScope.videoKey,
            method: 'DELETE',
            dataType: 'JSON',
            data: {
                tag: removeTag
            }
        }).success(function(data, status, headers, config) {
            if (data.code == 200) {
                $rootScope.alertSuccess.html(data.msg).fadeIn();
            } else if (data.code == 400) {
                $rootScope.alertDanger.html(data.msg).fadeIn();
            }
        }).error(function(data, status, headers, config) {

        }).finally(function(){
            setTimeout(function() {
                $rootScope.alert.fadeOut();
            }, 3000);
        });
    };

    $scope.addYoutubeTag = function(tag) {
        $rootScope.alertSuccess.html('Tag Added').fadeIn();
        setTimeout(function() {
            $rootScope.alert.fadeOut();
        }, 3000);
    };

    $scope.removeYoutubeTag = function(tag) {
        $rootScope.alertSuccess.html('Tag Deleted').fadeIn();
        setTimeout(function() {
            $rootScope.alert.fadeOut();
        }, 3000);
    };

    $scope.addTwitterTag = function(tag) {

        tag.text = '#'+ tag.text;

        // console.log($scope.youtubeUploadedTitle.length + $scope.twitterTagsLength + tag.text.length);

        $rootScope.alertSuccess.html('Tag Added').fadeIn();
        setTimeout(function() {
            $rootScope.alert.fadeOut();
        }, 3000);
        $scope.twitterTagsLength = $scope.twitterTagsLength + tag.text.length;
    };

    $scope.removeTwitterTag = function(tag) {
        $rootScope.alertSuccess.html('Tag Deleted').fadeIn();
        setTimeout(function() {
            $rootScope.alert.fadeOut();
        }, 3000);
        $scope.twitterTagsLength = $scope.twitterTagsLength - tag.text.length;
    };

    // detect change radio select
    $scope.selectSuitable = function(){
        if($scope.suitableVal === 0){
            $scope.suitableVal=1;
            $scope.toggleClassSuitable= "on";
            $scope.toggleTxtSuitable= "yes";
        }else{
            $scope.suitableVal=0;
            $scope.toggleClassSuitable= "off";
            $scope.toggleTxtSuitable= "no";
        }

        $http({
            url: '/video/suitable',
            method: 'POST',
            dataType: 'JSON',
            data: {
                video_key: $scope.videoKey,
                warning: $scope.suitableVal
            }
        }).success(function(data, status, headers, config) {
            $rootScope.alertSuccess.html('Suitable updated').fadeIn();

        }).error(function(data, status, headers, config) {

        }).finally(function(){
            setTimeout(function() {
                $rootScope.alert.fadeOut();
            }, 3000);
        });
    };

    // detect change radio select
    $scope.selectMusicRights = function(){

        if($scope.musicVal === 0){
            $scope.musicVal=1;
            $scope.toggleClassMusic= "on";
            $scope.toggleTxtMusic= "yes";
        }else{
            $scope.musicVal=0;
            $scope.toggleClassMusic= "off";
            $scope.toggleTxtMusic= "no";
        }

        $http({
            url: '/video/music_rights',
            method: 'POST',
            dataType: 'JSON',
            data: {
                video_key: $scope.videoKey,
                music_rights: $scope.musicVal
            }
        }).success(function(data, status, headers, config) {
            $rootScope.alertSuccess.html('Music rights updated').fadeIn();

        }).error(function(data, status, headers, config) {

        }).finally(function(){
            setTimeout(function() {
                $rootScope.alert.fadeOut();
            }, 3000);
        });
    };

    // Video Note text area
    // $scope.videoNotes = 'This is my special video';
    $scope.submitNote = function(value){
        $scope.saveNoteBtn = true;
        $http({
            url: '/video/note',
            method: 'POST',
            dataType: 'JSON',
            data: {
                video_key: $scope.videoKey,
                note: value
            }
        }).success(function(data, status, headers, config) {
            $rootScope.alertSuccess.html('Note added').fadeIn();

        }).error(function(data, status, headers, config) {

        }).finally(function(){
            $scope.saveNoteBtn = false;
            setTimeout(function() {
                $rootScope.alert.fadeOut();
            }, 3000);
        });
    };
    
    // Upload video to youtube
    if($rootScope.googleAccess){
        $scope.uploadYtBtn = function($event){
            $event.preventDefault();

            $scope.shareVideoToYt = true;

            var ytTags = [];
            angular.forEach($scope.ytTags, function(value, key){
                ytTags.push(value.text);
            });
    
            $http({
                url: '/video/youtube_process',
                method: 'POST',
                dataType: 'JSON',
                data: {
                    url: $scope.shareVideoUrl,
                    key: $rootScope.videoKey,
                    tags: ytTags
                }
            }).success(function(data, status, headers, config) {

                if (data.code == 200) {
                    // populate youtube video link in twitter post text area
                    $scope.youtubeUploadedTitle = data.youtube_link;

                    $scope.uploadedVideoToYouTube = true;

                    $rootScope.alertSuccess.html(data.msg).fadeIn();
                } else if (data.code == 400) {
                    $rootScope.alertDanger.html(data.msg).fadeIn();
                }
 
            }).error(function(data, status, headers, config) {

            }).finally(function(){
                $scope.shareVideoToYt = false;
                setTimeout(function() {
                    $rootScope.alert.fadeOut();
                }, 3000);
            });
        };

        
        $scope.uploadYtThumbBtn = function($event) {
            $event.preventDefault();

            $scope.uploadThumbToYt = true;

            $http({
                url: '/sharing/upload_custom_thumb/' + $rootScope.videoKey,
                method: 'GET',
                dataType: 'JSON'
            }).success(function(data, status, headers, config) {

                if (data.code == 200) {
                    $rootScope.alertSuccess.html('Youtube thumbnail updated').fadeIn();
                } else if (data.code == 400) {
                    $rootScope.alertDanger.html(data.message).fadeIn();
                }

            }).error(function(data, status, headers, config) {

            }).finally(function(){
                $scope.uploadThumbToYt = false;

                setTimeout(function() {
                    $rootScope.alert.fadeOut();
                }, 3000);
            });

        };

    }else{
        $scope.shareYtHref = '/user/account/#social_channels&connect_google';
    }
    
    // Share video to twitter
    $scope.postToTwitterCounter = 0;
    if($rootScope.twitterAccess){

        $scope.shareTwitterBtn = function($event, value, tags){
            $event.preventDefault();
            $scope.postOnTwitter = true;

            var tweetWithTags = [value];

            angular.forEach(tags, function(value, key){
                tweetWithTags.push(value.text);
            });

            tweetWithTags = tweetWithTags.join(" ");

            $http({
                url: '/connect/twitterpost/' + $scope.videoKey,
                method: 'POST',
                dataType: 'JSON',
                data: {
                    tweet: value,
                    tweetWithTags: tweetWithTags
                }
            }).success(function(data, status, headers, config) {
                if (data.code == 200) {
                    $rootScope.alertSuccess.html(data.msg).fadeIn();
                    $scope.postToTwitterCounter++;
                } else if (data.code == 400) {
                    $rootScope.alertDanger.html(data.msg).fadeIn();
                }

            }).error(function(data, status, headers, config) {

            }).finally(function(){
                $scope.postOnTwitter = false;

                setTimeout(function() {
                    $rootScope.alert.fadeOut();
                }, 3000);
            });
        };
    }else{
        $scope.shareTwitterHref = '/user/account/#social_channels&connect_twitter';
    }

    // Share video to facebook
    var fbPageName = $('#post-to-facebook').data('fbname');
    $scope.postToFacebookCounter = 0;
    
    if($rootScope.fbAccess ){

        if( fbPageName.length > 0 ){

            $scope.shareFbBtn = function($event){
                $event.preventDefault();

                $scope.postOnFacebook = true;

                $http({
                    url: '/sharing/post_video_on_page',
                    method: 'POST',
                    dataType: 'JSON',
                    data: {
                        video_key: $rootScope.videoKey,
                        title:     $scope.facebookShareTitle
                    }
                }).success(function(data, status, headers, config) {

                    if (data.code == 200) {
                        $scope.postToFacebookCounter++;
                        $rootScope.alertSuccess.html(data.message).fadeIn();
                    } else if (data.code == 400) {
                        $rootScope.alertDanger.html(data.message).fadeIn();
                    } else {
                        $rootScope.alertDanger.html("Something went wrong").fadeIn();
                    }
                    
                }).error(function(data, status, headers, config) {

                }).finally(function(){

                    $scope.postOnFacebook = false;

                    setTimeout(function() {
                        $rootScope.alert.fadeOut();
                    }, 3000);
                });
            };

        }else{
            $scope.shareFbHref = '/user/account/#social_channels&connect_fb_page';
        }
    }else{
        $scope.shareFbHref = '/user/account/#social_channels&connect_fb';
    }

    // store the interval promise and videoStatus
    var promise,
        videoStatus = '';

    $scope.videoStatusReady = true;
    
    // starts the interval
    $scope.startCheckingVideoStatus = function() {
        // stops any running interval to avoid two intervals running at the same time
        $scope.stopCheckingVideoStatus(); 
      
        // store the interval promise
        promise = $interval(checkVideoStatus, 5000);
    };
  
    // stops the interval
    $scope.stopCheckingVideoStatus = function() {
      $interval.cancel(promise);
    };

    $timeout(function() {
        checkVideoStatus();
    }, 0);

    function checkVideoStatus() {

        $http({
            url: '/sharing/check_video_status/' + $rootScope.videoKey,
            method: 'GET',
            dataType: 'JSON'
        }).success(function(data, status, headers, config) {

            videoStatus = data.status;

            if (videoStatus !== 'ready'){
                $scope.startCheckingVideoStatus();
                var msg = 'Please wait until the video is processed';
                $rootScope.alertSuccess.html(msg).fadeIn();
                $scope.videoStatusReady = true;

                return false;
            }

            // stops the interval
            $scope.stopCheckingVideoStatus(); 

            $rootScope.alert.fadeOut();
            if(!$scope.videoStatusReady){
                location.reload();
            }
            $scope.videoStatusReady = false;

        }).error(function(data, status, headers, config) {

        });
    }

}]).

/**
 * Controller: AccountController
 * ACCOUNT CONTROLLER
 */
controller('AccountController', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
    'use strict';

    if($rootScope.googleAccess){
        $scope.googleHref = '/disconnect/google';
        $scope.accountGoogleStatus = 'disconnect';
        $scope.googleAccountTxt = 'Disconnect from Google';
    }else{
        $scope.googleHref = '/connect/google';
        $scope.accountGoogleStatus = 'connect';
        $scope.googleAccountTxt = 'Connect with Google';
    }

    if($rootScope.twitterAccess){
        $scope.twitterHref = '/disconnect/twitter';
        $scope.accountTwitterStatus = 'disconnect';
        $scope.twitterAccountTxt = 'Disconnect from Twitter';
    }else{
        $scope.twitterHref = '/connect/twitter';
        $scope.accountTwitterStatus = 'connect';
        $scope.twitterAccountTxt = 'Connect with Twitter';
    }

    if($rootScope.fbAccess){
        $scope.fbHref = '/disconnect/facebook';
        $scope.accountFbStatus = 'disconnect';
        $scope.fbAccountTxt = 'Disconnect from Facebook';
    
        $scope.facebookPages = [];
        $scope.preloader = true;
        $http({
            url: '/connect/facebook_pages_from_user',
            method: 'GET',
            dataType: 'JSON'
        }).success(function(data, status, headers, config) {

            angular.forEach(data, function(value, key) {
                $scope.facebookPages.push(value);
            });
            $scope.preloader = false;

        }).error(function(data, status, headers, config) {

        });

        // Update values on video select from dropdown 
        $scope.setFbPage = function(page) {
            $scope.selectedFbPage = page;
            $scope.selectedFbPageValue = $scope.selectedFbPage.id;
            $scope.selectFbPage = true;

            $http({
                url: '/connect/save_facebook_page/',
                method: 'POST',
                dataType: 'JSON',
                data: {
                    page_title: page.name,
                    page_id: page.id
                }
            }).success(function(data, status, headers, config) {

                // checkFbPage();

                if (data.code == 200) {
                    $rootScope.alertSuccess.html(data.message).fadeIn();
                } else if (data.code == 409) {
                    $rootScope.alertDanger.html(data.message).fadeIn();
                }
            }).error(function(data, status, headers, config) {

            }).finally(function(){
                setTimeout(function() {
                    $rootScope.alert.fadeOut();
                }, 3000);
            });
        };
    }else{
        $scope.fbHref = '/connect/facebook';
        $scope.accountFbStatus = 'connect';
        $scope.fbAccountTxt = 'Connect with Facebook';
    }

    $scope.organizationTags = [];
    $scope.tagsPreloader = true;
    $http({
        url: '/tags/all_organization_tags',
        method: 'GET',
        dataType: 'JSON'
    }).success(function(data, status, headers, config) {
        angular.forEach(data, function(value, key) {
            $scope.organizationTags.push({
                text:value.tag
            });
        });
        $scope.tagsPreloader = false;

    }).error(function(data, status, headers, config) {

    });

    $scope.addTag = function(tag){
        $http({
            url: '/tags/add_organization_tag/',
            method: 'POST',
            dataType: 'JSON',
            data: {
                tag: tag.text
            }
        }).success(function(data, status, headers, config) {

            if (data.code == 200) {
                $rootScope.alertSuccess.html(data.message).fadeIn();
            } else if (data.code == 409) {
                $rootScope.alertDanger.html(data.message).fadeIn();
            }
        }).error(function(data, status, headers, config) {

        }).finally(function(){
            setTimeout(function() {
                $rootScope.alert.fadeOut();
            }, 3000);
        });
    };

    $scope.removeTag = function(tag) {

        var removeTag = tag.text;
        $http({
            url: '/tags/remove_organization_tag',
            method: 'DELETE',
            dataType: 'JSON',
            data: {
                tag: removeTag
            }
        }).success(function(data, status, headers, config) {

            if (data.code == 200) {
                $rootScope.alertSuccess.html(data.message).fadeIn();
            } else if (data.code == 409) {
                $rootScope.alertDanger.html(data.message).fadeIn();
            }
        }).error(function(data, status, headers, config) {

        }).finally(function(){
            setTimeout(function() {
                $rootScope.alert.fadeOut();
            }, 3000);
        });
    };

    // Account URL text area
    $scope.submitURL = function(value){

        var orgID = $('#organization-url').data('orgid');

        $http({
            url: 'organization/edit_org_url',
            method: 'POST',
            dataType: 'JSON',
            data: {
                orgID: orgID,
                url: value
            }
        }).success(function(data, status, headers, config) {
            if (data.code == 200) {
                $rootScope.alertSuccess.html(data.message).fadeIn();
            } else if (data.code == 409) {
                $rootScope.alertDanger.html(data.message).fadeIn();
            }

        }).error(function(data, status, headers, config) {

        }).finally(function(){
            setTimeout(function() {
                $rootScope.alert.fadeOut();
            }, 3000);
        });
    };

    // twitter_already_exists
    $scope.checkNotice = location.href.split('?notice=')[1];
    if (!angular.isUndefined($scope.checkNotice)){
        $rootScope.alertDanger.html('This twitter account is already connected with Thunderboom').fadeIn();
    }

    /**
     * Check account url
     * Set active tab
     * Show appropriate messages
     */
    $scope.tabsdata = {};
    if (location.hash === '#social_channels' || location.hash === '#_=_'){
        $scope.tabsdata.social_channels = true;  
    }else if (location.hash === '#social_channels&connect_fb_page'){
        $scope.tabsdata.social_channels = true; 
        $rootScope.alertSuccess.html('Please select a facebook page').fadeIn();
        setTimeout(function() {
            $rootScope.alert.fadeOut();
        }, 3000);
    }else if (location.hash === '#social_channels&connect_fb'){
        $scope.tabsdata.social_channels = true; 
        $rootScope.alertSuccess.html('Please connect with Facebook').fadeIn();
        setTimeout(function() {
            $rootScope.alert.fadeOut();
        }, 3000);
    }else if (location.hash === '#social_channels&connect_google'){
        $scope.tabsdata.social_channels = true; 
        $rootScope.alertSuccess.html('Please connect with Google').fadeIn();
        setTimeout(function() {
            $rootScope.alert.fadeOut();
        }, 3000);
    }else if (location.hash === '#social_channels&connect_twitter'){
        $scope.tabsdata.social_channels = true; 
        $rootScope.alertSuccess.html('Please connect with Twitter').fadeIn();
        setTimeout(function() {
            $rootScope.alert.fadeOut();
        }, 3000);
    }

    /**
     * Update User Details
     * 
     */
    $scope.updateUserDetails = function (userDetails, form) {

        $scope.submittedDetails = true;

        if (form.$invalid) {
            return false;
        }
        $scope.submitUserDetails = true;

        $http({
            url: 'user/update_user_details',
            method: 'POST',
            dataType: 'JSON',
            data: userDetails
        }).success(function(data, status, headers, config) {

            if (data.code == 200) {
                $rootScope.alertSuccess.html(data.message).fadeIn();
            } else if (data.code == 400) {
                $rootScope.alertDanger.html(data.message).fadeIn();
            } else if (data.code == 409) {
                $rootScope.alertDanger.html(data.message).fadeIn();
            }

        }).error(function(data, status, headers, config) {

        }).finally(function(){
            $scope.submitUserDetails = false;
            setTimeout(function() {
                $rootScope.alert.fadeOut();
            }, 3000);
        });
    };


    /**
     * Update Password
     * Check old Password
     * 
     */
    $scope.passCredentials = {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    };

    $scope.updatePassword = function (passCredentials, form) {

        $scope.submitted = true;

        if (form.$invalid) {
            return false;
        }
        $scope.submitNewPassword = true;

        $http({
            url: 'user/update_user_password',
            method: 'POST',
            dataType: 'JSON',
            data: passCredentials
        }).success(function(data, status, headers, config) {

            if (data.code == 200) {
                $rootScope.alertSuccess.html(data.message).fadeIn();
            } else if (data.code == 400) {
                $rootScope.alertDanger.html(data.message).fadeIn();
            } else if (data.code == 409) {
                $rootScope.alertDanger.html(data.message).fadeIn();
            }

        }).error(function(data, status, headers, config) {

        }).finally(function(){
            $scope.submitNewPassword = false;
            setTimeout(function() {
                $rootScope.alert.fadeOut();
            }, 3000);
        });
    };

}]).

/**
 * Controller: MessageTwitterController
 * SEND MESSAGE TWITTER CONTROLLER
 */
controller('MessageTwitterController', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
    'use strict';

    $scope.inputMessage = '';

    // Share video to twitter
    $scope.shareTwitterText = 'Share on Twitter';
    if($rootScope.twitterAccess){

        $scope.shareTwitterBtn = function($event, value){
            $event.preventDefault();

            if ($scope.inputMessage.length > 1){

                $scope.shareTwitterText = 'Sharing ...';
                $scope.sharingTwitterBtn = 'sharing';

                $http({
                    url: '/connect/update_twitter_status',
                    method: 'POST',
                    dataType: 'JSON',
                    data: {
                        tweet: value
                    }
                }).success(function(data, status, headers, config) {

                    $rootScope.alertSuccess.html('You have succesfully shared on twitter!').fadeIn();

                    $scope.shareTwitterText = 'Share on Twitter';
                    $scope.sharingTwitterBtn = '';
                }).error(function(data, status, headers, config) {

                }).finally(function(){
                    setTimeout(function() {
                        $rootScope.alert.fadeOut();
                    }, 3000);
                });
            }
        };
    }else{
        $scope.shareTwitterHref = '/user/account/#social_channels&connect_twitter';
    }

}]).

/**
 * Controller: CalendarController
 * CALENDAR CONTROLLER
 */
controller('CalendarController', ['$rootScope', '$scope', '$modal', 'moment', '$http', '$timeout', 'anchorSmoothScroll', '$location', function($rootScope, $scope, $modal, moment, $http, $timeout, anchorSmoothScroll, $location) {

    // $scope.isCollapsed = true;

    var currentYear = moment().year();
    var currentMonth = moment().month();
    var currentDay = new Date();


    moment.locale('en', {
        week : {
            dow : 1 // Monday is the first day of the week
        }
    });

    $scope.calendarView = 'month';
    $scope.calendarWeekView = 'week';
    $scope.calendarDay = new Date();
    $scope.currentMonth = moment(currentDay).format('MMMM YYYY');

    var date = location.search.split('?date=')[1];
    var dateUrl = new Date(date);

    function showModal(action, event) {
        $modal.open({
            templateUrl: 'modalContent.html',
            controller: function($scope, $modalInstance) {
                $scope.$modalInstance = $modalInstance;
                $scope.action = action;
                $scope.event = event;
            }
        });
    }

    $scope.pushEvents = function() {
        $scope.events.unshift({
            placeholder: 'New event'
        });
    };


    // Smooth Scroll to activities-table
    $scope.gotoElement = function (eID){
        // set the location.hash to the id of
        // the element you wish to scroll to.
        // $location.hash('activities-table');
 
        // call $anchorScroll()
        anchorSmoothScroll.scrollTo(eID);
    };

    // $scope.eventClicked = function(event) {
    //     showModal('Clicked', event);
    // };

    $scope.eventEdited = function(event) {
        showModal('Edited', event);
    };

    $scope.eventDeleted = function(event) {
        showModal('Deleted', event);
    };

    $scope.setCalendarToToday = function() {
        $scope.calendarDay = new Date();
    };

    $scope.toggle = function($event, field, event) {
        $event.preventDefault();
        $event.stopPropagation();

        event[field] = !event[field];
    };

    /**
     * GET ALL EVENTS FROM DATABASE
     **/
    $scope.allEvents = function() {
        $scope.events = [];

        $http({
            url: '/events',
            method: 'GET',
            dataType: 'JSON'
        }).success(function(data, status, headers, config) {

            angular.forEach(data, function(value, key) {
                $scope.events.push({
                    description: value.description,
                    id: value.id,
                    org_id: value.org_id,
                    starts_at: value.start_date,
                    ends_at: value.end_date,
                    title: value.title,
                    user_id: value.user_id
                });
            });

        }).error(function(data, status, headers, config) {

        });
    };
    $scope.allEvents();

    /**
     * ADD EVENT TO DATABASE
     **/
    $scope.hasId = true;
    $scope.saveEvent = function(event) {

        if (angular.isUndefined(event.id)) {

            if(!angular.isUndefined(event.title) && !angular.isUndefined(event.starts_at) && !angular.isUndefined(event.ends_at) && !angular.isUndefined(event.description)){
                if($scope.hasId){
                    $http({
                        url: '/events/create',
                        method: 'POST',
                        dataType: 'JSON',
                        data: {
                            title: event.title,
                            desc: event.description,
                            starts_at: event.starts_at,
                            ends_at: event.ends_at
                        }
                    }).success(function(data, status, headers, config) {
                        $scope.hasId = false;

                        if (data.code == 200){
                            $rootScope.alertSuccess.html(data.message).fadeIn();
                        }else if( data.code == 400 ){
                            $rootScope.alertDanger.html(data.message).fadeIn();
                        }
                    }).error(function(data, status, headers, config) {

                    }).finally(function(){
                        setTimeout(function(){
                            $rootScope.alert.fadeOut();
                        }, 3000);
                    });
                }
            }else{
                var message = 'Please fill all the fields.';
                $rootScope.alertDanger.html(message).fadeIn();
                setTimeout(function(){
                    $rootScope.alert.fadeOut();
                }, 3000);
            }

        } else {

            $http({
                url: '/events/update',
                method: 'POST',
                dataType: 'JSON',
                data: {
                    id: event.id,
                    org_id: event.org_id,
                    title: event.title,
                    desc: event.description,
                    starts_at: event.starts_at,
                    ends_at: event.ends_at
                }
            }).success(function(data, status, headers, config) {
                if (data.code == 200){
                    $rootScope.alertSuccess.html(data.message).fadeIn();
                }else if( data.code == 401 ){
                    $rootScope.alertDanger.html(data.message).fadeIn();
                }
            }).error(function(data, status, headers, config) {

            }).finally(function(){
                setTimeout(function(){
                    $rootScope.alert.fadeOut();
                }, 3000);
            });
        }
    };

    /**
     * DELETE EVENT FROM DATABASE
     **/
    $scope.deleteEvent = function(event, index) {

        $http({
            url: '/events/delete',
            method: 'POST',
            dataType: 'JSON',
            data: {
                id: event.id
            }
        }).success(function(data, status, headers, config) {

            $scope.events.splice(index, 1);

            if (data.code == 200){
                $rootScope.alertSuccess.html(data.message).fadeIn();
            }else if( data.code == 400 ){
                $rootScope.alertDanger.html(data.message).fadeIn();
            }
        }).error(function(data, status, headers, config) {

        }).finally(function(){
            setTimeout(function(){
                $rootScope.alert.fadeOut();
            }, 3000);
        });
    };

}]).

/**
 * Controller: InsightsAnalyticsController
 * INSIGHTS ANALYTICS CONTROLLER
 * 
 */
controller('InsightsAnalyticsController', ['$rootScope', '$scope', '$http', '$timeout', function($rootScope, $scope, $http, $timeout) {
    'use strict';

    $scope.$on('activeTab', function() {
        $('.analytic-tab').removeClass('active');
        $('.'+$scope.activeTab).addClass('active');
    }); 

    // If url has parameter click event in the tab
    if($rootScope.urlParam){
        $timeout(function(){
            $('.'+$rootScope.urlParam.slice(1)+'-tab').click();
        }, 0);
    }

    $('.select-video-container').hide();

    // get all videos form JWT platform
    $scope.videosJWT = window.videos;

    // Create an array with the videos
    $scope.videos = [{'id':'0', 'title':'All', 'key':'0000000'}];
    angular.forEach($scope.videosJWT, function(value, key) {
        $scope.videos.push(value);
    });

    $scope.selectedVideo = $scope.videos[0];
    $scope.selectedVideoValue = 1;
    $scope.selectedVideoName = $scope.videos[0].title;
    $scope.successData = false;

    // Update values on video select from dropdown 
    $scope.setVideo = function(video) {
        $scope.selectedVideo = video;
        $scope.selectedVideoValue = $scope.selectedVideo.id;
        $scope.selectedVideoName = $scope.selectedVideo.title;
        $scope.selectedVideoKey = video.key;
        $scope.successData = true;

        if (video.title !== 'All'){

            $http({
                url: '/insights/analytics/' + video.key,
                method: 'GET',
                dataType: 'JSON',
                data: video
            }).success(function(data, status, headers, config) {

                if(data.code == 200){
                    $scope.successData = false;
                    $scope.$broadcast('update-datasets', data);
                }  

            }).error(function(data, status, headers, config) {

            }).finally(function() {

            });
        }else {
            $scope.$broadcast('reset-datasets');
            $scope.successData = false;
        }
    };


    //adding events on graph
    var events = window.events,
        events_len = events.length;

    $scope.eventsguides = [];

    for (var n = 0; n < events_len-1; n++) {
        if (events[n].start_date != events[n+1].start_date) {
            $scope.eventsguides.push({
                date : new Date(events[n].start_date),
                fontSize: "14px",
                lineColor: "#FC040D",
                lineAlpha: 1,
                fillAlpha: 1,
                fillColor: "#999999",
                dashLength: 2,
                inside: true,
                labelRotation: 90,
                label : events[n].title,
                above: true,
                balloonColor : "#999999",
                balloonText : "<span class='balloonText'>Event<br/>Title: "+events[n].title+'<br/>Description: '+events[n].description+"</span>",
            });
        }
    }

    $scope.eventsguides.push({
        date : new Date(events[events_len-1].start_date),
        fontSize: "14px",
        lineColor: "#FC040D",
        lineAlpha: 1,
        fillAlpha: 1,
        fillColor: "#999999",
        dashLength: 2,
        inside: true,
        labelRotation: 90,
        label : events[events_len-1].title,
        above: true,
        balloonText : "<span class='balloonText'>Event<br/>Title: "+events[events_len-1].title+'<br/>Description: '+events[events_len-1].description+"</span>",
    });

}]).

// **
//  * Controller: Overview
//  * OVERVIEW CONTROLLER
//  * in understand tpl
//  */
controller('OverviewController', ['$rootScope', '$scope', '$http', '$timeout', function($rootScope, $scope, $http, $timeout) {
    'use strict';

    // Get seperate datasetsto compine them in one
    var facebook_likes = window.facebook_page_likes_dataset,
        twitter_followers_dataset = window.twitter_followers_dataset,
        youtube_subscribers_dataset = window.youtube_subscribers_dataset,
        facebook_engagement_dataset = window.facebook_engagement_dataset,
        twitter_engagement_dataset = window.total_twitter_engagement_dataset,
        youtube_engagement_dataset = window.youtube_engagement_dataset,
        jwviewsdataset = window.total_thunderviews,
        youtubedataset = window.youtube_dataset,
        total_facebook_engagement_dataset = window.facebook_total_engagement_dataset,
        total_twitter_engagement_dataset = window.twitter_total_engagement_twitter,
        total_youtube_engagement_dataset = window.youtube_total_engagement_dataset;

    function multipleTotalEngagementDatasets(total_facebook_engagement_dataset, total_twitter_engagement_dataset, total_youtube_engagement_dataset){
        
        var engagement_twitter_facebook = [];
        
        //combine facebook and twitter dataset to a new array engagement_twitter_facebook
        if (total_facebook_engagement_dataset.length >= total_twitter_engagement_dataset.length) {  
            for(var i=0;i<total_facebook_engagement_dataset.length;i++){
                var check = 0;
                for(var j=0;j<total_twitter_engagement_dataset.length;j++){
                    if(total_facebook_engagement_dataset[i].day === total_twitter_engagement_dataset[j].day) {
                        check = 1;
                        engagement_twitter_facebook.push({
                            day: total_facebook_engagement_dataset[i].day, 
                            totalfacebook: total_facebook_engagement_dataset[i].facebook,
                            totaltwitter: total_twitter_engagement_dataset[j].twitter });
                        continue;
                        }
                    }
                if (check !== 1) {
                    engagement_twitter_facebook.push({
                        day: total_facebook_engagement_dataset[i].day, 
                        totalfacebook: total_facebook_engagement_dataset[i].facebook, 
                        totaltwitter: '0'});
                }
            }
            for(var j=0; j<total_twitter_engagement_dataset.length; j++){
                if (total_facebook_engagement_dataset[total_facebook_engagement_dataset.length-1].day < total_twitter_engagement_dataset[j].day ){
                    engagement_twitter_facebook.push({
                        day: total_twitter_engagement_dataset[j].day,  
                        totalfacebook: '0',
                        totaltwitter: total_twitter_engagement_dataset[j].twitter
                    });
                }
            }
        } else {
            for(var i=0;i<total_twitter_engagement_dataset.length;i++){
                var check = 0;
                for(var j=0;j<total_facebook_engagement_dataset.length;j++){
                    if(total_twitter_engagement_dataset[i].day === total_facebook_engagement_dataset[j].day) {
                        check = 1;
                        engagement_twitter_facebook.push({
                            day: total_twitter_engagement_dataset[i].day, 
                            totalfacebook :total_facebook_engagement_dataset[j].facebook,
                            totaltwitter: total_twitter_engagement_dataset[i].twitter

                        });
                        continue;
                        }
                    }
                if (check !== 1) {
                    engagement_twitter_facebook.push({
                        day: total_twitter_engagement_dataset[i].day, 
                        totalfacebook: '0',
                        totaltwitter: total_twitter_engagement_dataset[i].twitter });
                }
            }
            for(var j=0; j<total_facebook_engagement_dataset.length; j++){
                if (total_twitter_engagement_dataset[total_twitter_engagement_dataset.length-1].day < total_facebook_engagement_dataset[j].day ){
                    engagement_twitter_facebook.push({
                        day: total_facebook_engagement_dataset[j].day, 
                        totalfacebook: total_facebook_engagement_dataset[j].facebook, 
                        totaltwitter: '0'});
                }
            }
        }

        //combine the new array engagement_twitter_facebook with youtube dataset 
        var engagement_twitter_facebook_youtube = [];
        if (engagement_twitter_facebook.length >= total_youtube_engagement_dataset.length) {  
            for(var i=0;i < engagement_twitter_facebook.length; i++){
                var check = 0;
                for(var j=0;j<total_youtube_engagement_dataset.length;j++){
                    if(engagement_twitter_facebook[i].day === total_youtube_engagement_dataset[j].day) {
                        check = 1;
                        engagement_twitter_facebook_youtube.push({
                            day: engagement_twitter_facebook[i].day, 
                            totalfacebook: engagement_twitter_facebook[i].totalfacebook, 
                            totaltwitter: engagement_twitter_facebook[i].totaltwitter, 
                            totalyoutube: total_youtube_engagement_dataset[j].youtube

                        });
                        continue;
                        }
                    }
                if (check !== 1) {
                    engagement_twitter_facebook_youtube.push({
                        day: engagement_twitter_facebook[i].day, 
                        totalfacebook: engagement_twitter_facebook[i].totalfacebook, 
                        totaltwitter: engagement_twitter_facebook[i].totaltwitter, 
                        totalyoutube: '0'
                    });
                }
            }

            for(var j=0; j<total_youtube_engagement_dataset.length; j++){
                if (engagement_twitter_facebook[engagement_twitter_facebook.length-1].day < total_youtube_engagement_dataset[j].day ){
                    engagement_twitter_facebook_youtube.push({
                        day: total_youtube_engagement_dataset[j].day,  
                        totalfacebook: '0',
                        totaltwitter: '0',
                        totalyoutube: total_youtube_engagement_dataset[j].youtube
                    });
                }
            }
        }else {
            for(var i=0;i<total_youtube_engagement_dataset.length;i++){
                var check = 0;
                for(var j=0;j<engagement_twitter_facebook.length;j++){
                    if(total_youtube_engagement_dataset[i].day === engagement_twitter_facebook[j].day) {
                        check = 1;
                        engagement_twitter_facebook_youtube.push({
                            day: total_youtube_engagement_dataset[i].day, 
                            totalfacebook: engagement_twitter_facebook[j].totalfacebook,
                            totaltwitter: engagement_twitter_facebook[j].totaltwitter,
                            totalyoutube: total_youtube_engagement_dataset[i].youtube
                        });
                        continue;
                        }
                    }
                if (check !== 1) {
                    engagement_twitter_facebook_youtube.push({
                        day: total_youtube_engagement_dataset[i].day, 
                        totalfacebook: '0',
                        totaltwitter: '0',
                        totalyoutube: total_youtube_engagement_dataset[i].youtube

                    });
                }
            }

            for(var j=0; j<engagement_twitter_facebook.length; j++){
                if (total_youtube_engagement_dataset[total_youtube_engagement_dataset.length-1].day < engagement_twitter_facebook[j].day ){
                    engagement_twitter_facebook_youtube.push({
                        day: engagement_twitter_facebook[j].day, 
                        totalfacebook: engagement_twitter_facebook[j].totalfacebook, 
                        totaltwitter: engagement_twitter_facebook[j].totaltwitter, 
                        totalyoutube: '0'
                    });
                }
            }
        }

        return engagement_twitter_facebook_youtube;
    }
    var stockdataset4 = multipleTotalEngagementDatasets(total_facebook_engagement_dataset, total_twitter_engagement_dataset, total_youtube_engagement_dataset);

    function multipleEngagementDatasets(facebook_engagement_dataset, twitter_engagement_dataset, youtube_engagement_dataset){
        
        var engagement_twitter_facebook = [];
        
        //combine facebook and twitter dataset to a new array engagement_twitter_facebook
        if (facebook_engagement_dataset.length >= twitter_engagement_dataset.length) {  
            for(var i=0;i<facebook_engagement_dataset.length;i++){
                var check = 0;
                for(var j=0;j<twitter_engagement_dataset.length;j++){
                    if(facebook_engagement_dataset[i].day === twitter_engagement_dataset[j].day) {
                        check = 1;
                        engagement_twitter_facebook.push({
                            day: facebook_engagement_dataset[i].day, 
                            facebook: facebook_engagement_dataset[i].facebook, 
                            twitter :twitter_engagement_dataset[j].twitter});
                        continue;
                        }
                    }
                if (check !== 1) {
                    engagement_twitter_facebook.push({
                        day: facebook_engagement_dataset[i].day, 
                        facebook: facebook_engagement_dataset[i].facebook, 
                        twitter: '0'
                    });
                }
            }
            for(var j=0; j<twitter_engagement_dataset.length; j++){
                if (facebook_engagement_dataset[facebook_engagement_dataset.length-1].day < twitter_engagement_dataset[j].day ){
                    engagement_twitter_facebook.push({
                        day: twitter_engagement_dataset[j].day,  
                        facebook: '0',
                        twitter: twitter_engagement_dataset[j].twitter
                    });
                }
            }
        } else {
            for(var i=0;i<twitter_engagement_dataset.length;i++){
                var check = 0;
                for(var j=0;j<facebook_engagement_dataset.length;j++){
                    if(twitter_engagement_dataset[i].day === facebook_engagement_dataset[j].day) {
                        check = 1;
                        engagement_twitter_facebook.push({
                            day: twitter_engagement_dataset[i].day, 
                            facebook :facebook_engagement_dataset[j].facebook,
                            twitter: twitter_engagement_dataset[i].twitter});
                        continue;
                        }
                    }
                if (check !== 1) {
                    engagement_twitter_facebook.push({
                        day: twitter_engagement_dataset[i].day, 
                        facebook: '0',
                        twitter: twitter_engagement_dataset[i].twitter});
                }
            }
            for(var j=0; j<facebook_engagement_dataset.length; j++){
                if (twitter_engagement_dataset[twitter_engagement_dataset.length-1].day < facebook_engagement_dataset[j].day ){
                    engagement_twitter_facebook.push({
                        day: facebook_engagement_dataset[j].day, 
                        facebook: facebook_engagement_dataset[j].facebook, 
                        twitter: '0'
                    });
                }
            }
        }

        //combine the new array engagement_twitter_facebook with youtube dataset 
        var engagement_twitter_facebook_youtube = [];
        if (engagement_twitter_facebook.length >= youtube_engagement_dataset.length) {  
            for(var i=0;i < engagement_twitter_facebook.length; i++){
                var check = 0;
                for(var j=0;j<youtube_engagement_dataset.length;j++){
                    if(engagement_twitter_facebook[i].day === youtube_engagement_dataset[j].day) {
                        check = 1;
                        engagement_twitter_facebook_youtube.push({
                            day: engagement_twitter_facebook[i].day, 
                            facebook: engagement_twitter_facebook[i].facebook, 
                            twitter: engagement_twitter_facebook[i].twitter, 
                            youtube :youtube_engagement_dataset[j].youtube});
                        continue;
                        }
                    }
                if (check !== 1) {
                    engagement_twitter_facebook_youtube.push({
                        day: engagement_twitter_facebook[i].day, 
                        facebook: engagement_twitter_facebook[i].facebook, 
                        twitter: engagement_twitter_facebook[i].twitter, 
                        youtube: '0'
                    });
                }
            }

            for(var j=0; j<youtube_engagement_dataset.length; j++){
                if (engagement_twitter_facebook[engagement_twitter_facebook.length-1].day < youtube_engagement_dataset[j].day ){
                    engagement_twitter_facebook_youtube.push({
                        day: youtube_engagement_dataset[j].day,  
                        facebook: '0',
                        twitter: '0',
                        youtube: youtube_engagement_dataset[j].youtube
                    });
                }
            }
        }else {
            for(var i=0;i<youtube_engagement_dataset.length;i++){
                var check = 0;
                for(var j=0;j<engagement_twitter_facebook.length;j++){
                    if(youtube_engagement_dataset[i].day === engagement_twitter_facebook[j].day) {
                        check = 1;
                        engagement_twitter_facebook_youtube.push({
                            day: youtube_engagement_dataset[i].day, 
                            facebook :engagement_twitter_facebook[j].facebook,
                            twitter :engagement_twitter_facebook[j].twitter,
                            youtube: youtube_engagement_dataset[i].youtube});
                        continue;
                        }
                    }
                if (check !== 1) {
                    engagement_twitter_facebook_youtube.push({
                        day: youtube_engagement_dataset[i].day, 
                        facebook: '0',
                        twitter: '0',
                        youtube: youtube_engagement_dataset[i].youtube});
                }
            }

            for(var j=0; j<engagement_twitter_facebook.length; j++){
                if (youtube_engagement_dataset[youtube_engagement_dataset.length-1].day < engagement_twitter_facebook[j].day ){
                    engagement_twitter_facebook_youtube.push({
                        day: engagement_twitter_facebook[j].day, 
                        facebook: engagement_twitter_facebook[j].facebook, 
                        twitter: engagement_twitter_facebook[j].twitter, 
                        youtube: '0'
                    });
                }
            }
        }

        return engagement_twitter_facebook_youtube;
    }

    var stockdataset1 = multipleEngagementDatasets(facebook_engagement_dataset, twitter_engagement_dataset, youtube_engagement_dataset);
   
    /**
     * Compine Multiple Datasets
     * params 3 datasets
     * return the final dataset that we will use to chart
     */
    function multipleAudienceDatasets(facebook_likes, twitter_followers_dataset, youtube_subscribers_dataset){    

        var audience_twitter_facebook = [];
        if (twitter_followers_dataset.length >= facebook_likes.length){
            for(var i=0; i<twitter_followers_dataset.length; i++){
                var check = 0;
                for(var j=0; j<facebook_likes.length; j++){
                    if(twitter_followers_dataset[i].day === facebook_likes[j].day) {
                        check = 1;
                        audience_twitter_facebook.push({
                            day: twitter_followers_dataset[i].day, 
                            followers: twitter_followers_dataset[i].followers, 
                            likes :facebook_likes[j].likes});
                        continue;
                        }
                    }
                if (check !== 1) {
                    audience_twitter_facebook.push({
                        day: twitter_followers_dataset[i].day, 
                        followers: twitter_followers_dataset[i].followers, 
                        likes: '0'});
                }
            }

            for(var j=0; j<facebook_likes.length; j++){
                if (twitter_followers_dataset[twitter_followers_dataset.length-1].day < facebook_likes[j].day ){
                    audience_twitter_facebook.push({day: facebook_likes[j].day, likes: facebook_likes[j].likes, followers: 0});
                }
            }
        }
        else{
            for(var i=0; i<facebook_likes.length; i++){
                var check = 0;
                for(var j=0;j<twitter_followers_dataset.length;j++){
                    if(facebook_likes[i].day === twitter_followers_dataset[j].day) {
                        check = 1;
                        audience_twitter_facebook.push({
                            day: facebook_likes[i].day, 
                            likes: facebook_likes[i].likes, 
                            followers :twitter_followers_dataset[j].followers});
                        continue;
                        }
                    }
                if (check !== 1) {
                    audience_twitter_facebook.push({
                        day: facebook_likes[i].day, 
                        likes: facebook_likes[i].likes, 
                        followers: '0'});
                }
            }

            for(var j=0;j<twitter_followers_dataset.length;j++){
                if (facebook_likes[facebook_likes.length-1].day < twitter_followers_dataset[j].day ){
                    audience_twitter_facebook.push({day: twitter_followers_dataset[j].day, followers: twitter_followers_dataset[j].followers, likes: 0});
                }
            }
        }

        var audience_twitter_facebook_subscribers = [];   
        if (audience_twitter_facebook.length>=youtube_subscribers_dataset.length){
            for(var i=0;i<audience_twitter_facebook.length;i++){
              var check = 0;
              for(var j=0; j<youtube_subscribers_dataset.length; j++){
                if(audience_twitter_facebook[i].day === youtube_subscribers_dataset[j].day) {
                    check = 1;
                    audience_twitter_facebook_subscribers.push({
                        day: audience_twitter_facebook[i].day, 
                        followers: audience_twitter_facebook[i].followers,
                        likes: audience_twitter_facebook[i].likes,
                        subscribers: youtube_subscribers_dataset[j].subscribers});
                    continue;
                    }
                }
                if (check !== 1) {
                    audience_twitter_facebook_subscribers.push({
                        day: audience_twitter_facebook[i].day, 
                        followers: audience_twitter_facebook[i].followers, 
                        likes: audience_twitter_facebook[i].likes,
                        subscribers: '0'
                    });
                }
            }
            
            for(var j=0; j<youtube_subscribers_dataset.length; j++){
                if (audience_twitter_facebook[audience_twitter_facebook.length-1].day < youtube_subscribers_dataset[j].day ){
                    audience_twitter_facebook_subscribers.push({
                        day: youtube_subscribers_dataset[j].day,
                        followers: '0', 
                        likes: '0',
                        subscribers: youtube_subscribers_dataset[j].subscribers
                    });
                }
            }

        }else {
            for(var i=0;i<youtube_subscribers_dataset.length;i++){
              var check = 0;
              for(var j=0;j<audience_twitter_facebook.length;j++){
                if(youtube_subscribers_dataset[i].day === audience_twitter_facebook[j].day) {
                    check = 1;
                    audience_twitter_facebook_subscribers.push({
                        day: youtube_subscribers_dataset[i].day, 
                        followers: audience_twitter_facebook[j].followers,
                        likes: audience_twitter_facebook[j].likes,
                        subscribers: youtube_subscribers_dataset[i].subscribers});
                    continue;
                    }
                }
                if (check !== 1) {
                    audience_twitter_facebook_subscribers.push({
                        day: youtube_subscribers_dataset[i].day, 
                        followers: '0', 
                        likes: '0',
                        subscribers: youtube_subscribers_dataset[i].subscribers
                    });
                }
            }

            for(var j=0; j<audience_twitter_facebook.length; j++){
                if (youtube_subscribers_dataset[youtube_subscribers_dataset.length-1].day < audience_twitter_facebook[j].day ){
                    audience_twitter_facebook_subscribers.push({
                        day: audience_twitter_facebook[j].day, 
                        followers: audience_twitter_facebook[j].followers, 
                        likes: audience_twitter_facebook[j].likes,
                        subscribers:'0'
                    });
                }
            }
        }

        return audience_twitter_facebook_subscribers;
    }

    // In datase variable put the return value of multipleDatasets function
    var stockdataset2 = multipleAudienceDatasets(facebook_likes, twitter_followers_dataset, youtube_subscribers_dataset);

    ///////////views dataset///////////

    function multipleViewsDatasets(youtubedataset, jwviewsdataset){
        
        var combined_views = [];
        
        //combine facebook and twitter dataset to a new array combined_views
        if (youtubedataset.length >= jwviewsdataset.length) {  
            for(var i=0;i<youtubedataset.length;i++){
                var check = 0;
                for(var j=0;j<jwviewsdataset.length;j++){
                    if(youtubedataset[i].day === jwviewsdataset[j].day) {
                        check = 1;
                        combined_views.push({
                            day: youtubedataset[i].day, 
                            views: youtubedataset[i].views, 
                            thunderboom :jwviewsdataset[j].views});
                        continue;
                        }
                    }
                if (check !== 1) {
                    combined_views.push({
                        day: youtubedataset[i].day, 
                        views: youtubedataset[i].views, 
                        thunderboom: '0'
                    });
                }
            }
            for(var j=0; j<jwviewsdataset.length; j++){
                if (youtubedataset[youtubedataset.length-1].day < jwviewsdataset[j].day ){
                    combined_views.push({
                        day: jwviewsdataset[j].day,  
                        views: '0',
                        thunderboom: jwviewsdataset[j].views
                    });
                }
            }

        } else {
            for(var i=0;i<jwviewsdataset.length;i++){
                var check = 0;
                for(var j=0;j<youtubedataset.length;j++){
                    if(jwviewsdataset[i].day === youtubedataset[j].day) {
                        check = 1;
                        combined_views.push({
                            day: jwviewsdataset[i].day, 
                            views: youtubedataset[j].views,
                            thunderboom: jwviewsdataset[i].views});
                        continue;
                        }
                    }
                if (check !== 1) {
                    combined_views.push({
                        day: jwviewsdataset[i].day, 
                        views: '0',
                        thunderboom: jwviewsdataset[i].views});
                }
            }
            for(var j=0; j<youtubedataset.length; j++){
                if (jwviewsdataset[jwviewsdataset.length-1].day < youtubedataset[j].day ){
                    combined_views.push({
                        day: youtubedataset[j].day, 
                        views: youtubedataset[j].views, 
                        thunderboom: '0'
                    });
                }
            }
        }

       

        return combined_views;
    }

    var stockdataset3 = multipleViewsDatasets(youtubedataset, jwviewsdataset);
    ///////end of views dataset///////
   

    function multipleUnderstandDatasets(stockdataset1, stockdataset2, stockdataset3, stockdataset4){
        
        var understand1 = [];
        
        //combine facebook and twitter dataset to a new array engagement_twitter_facebook
        if (stockdataset1.length >= stockdataset2.length) {  
            for(var i=0;i<stockdataset1.length;i++){
                var check = 0;
                for(var j=0;j<stockdataset2.length;j++){
                    if(stockdataset1[i].day === stockdataset2[j].day) {
                        check = 1;
                        understand1.push({
                            day: stockdataset1[i].day, 
                            facebook: stockdataset1[i].facebook,
                            twitter: stockdataset1[i].twitter, 
                            youtube: stockdataset1[i].youtube,  
                            likes :stockdataset2[j].likes,
                            followers :stockdataset2[j].followers,
                            subscribers :stockdataset2[j].subscribers

                        });
                        continue;
                        }
                    }
                if (check !== 1) {
                    understand1.push({
                        day: stockdataset1[i].day, 
                        facebook: stockdataset1[i].facebook,
                        twitter: stockdataset1[i].twitter, 
                        youtube: stockdataset1[i].youtube,  
                        likes :'0',
                        followers :'0',
                        subscribers :'0'
                    });
                }
            }
            for(var j=0; j<stockdataset2.length; j++){
                if (facebook_engagement_dataset[facebook_engagement_dataset.length-1].day < stockdataset2[j].day ){
                    understand1.push({
                        day: stockdataset2[j].day,  
                        facebook: '0',
                        twitter:'0',
                        youtube: '0',  
                        likes :stockdataset2[j].likes,
                        followers :stockdataset2[j].followers,
                        subscribers :stockdataset2[j].subscribers
                    });
                }
            }
        } else {
            for(var i=0;i<stockdataset2.length;i++){
                var check = 0;
                for(var j=0;j<stockdataset1.length;j++){
                    if(stockdataset2[i].day === stockdataset1[j].day) {
                        check = 1;
                        understand1.push({
                            day: stockdataset2[i].day, 
                            facebook: stockdataset1[j].facebook,
                            twitter: stockdataset1[j].twitter, 
                            youtube: stockdataset1[j].youtube,
                            likes :stockdataset2[i].likes,
                            followers :stockdataset2[i].followers,
                            subscribers :stockdataset2[i].subscribers});
                        continue;
                        }
                    }
                if (check !== 1) {
                    understand1.push({
                        day: stockdataset2[i].day, 
                        facebook: '0',
                        twitter: '0', 
                        youtube: '0',
                        likes :stockdataset2[i].likes,
                        followers :stockdataset2[i].followers,
                        subscribers :stockdataset2[i].subscribers});
                }
            }
        }

        //combine the new array engagement_twitter_facebook with youtube dataset 
        var understand2 = [];
        if (understand1.length >= stockdataset3.length) {  
            for(var i=0;i < understand1.length; i++){
                var check = 0;
                for(var j=0;j<stockdataset3.length;j++){
                    if(understand1[i].day === stockdataset3[j].day) {
                        check = 1;
                        understand2.push({
                            day: understand1[i].day, 
                            facebook: understand1[i].facebook, 
                            twitter: understand1[i].twitter, 
                            youtube: understand1[i].youtube, 
                            likes :understand1[i].likes,
                            followers :understand1[i].followers,
                            subscribers :understand1[i].subscribers,
                            views :stockdataset3[j].views,
                            thunderboom :stockdataset3[j].thunderboom});
                        continue;
                        }
                    }
                if (check !== 1) {
                    understand2.push({
                        day: understand1[i].day, 
                        facebook: understand1[i].facebook, 
                        twitter: understand1[i].twitter, 
                        youtube: understand1[i].youtube, 
                        likes :understand1[i].likes,
                        followers :understand1[i].followers,
                        subscribers :understand1[i].subscribers,
                        views :'0',
                        thunderboom : '0'
                    });
                }
            }

            for(var j=0; j<stockdataset3.length; j++){
                if (understand1[understand1.length-1].day < stockdataset3[j].day ){
                    understand2.push({
                        day: stockdataset3[j].day,  
                        facebook: '0',
                        twitter: '0',
                        youtube: '0', 
                        likes :'0',
                        followers :'0',
                        subscribers :'0',
                        views: stockdataset3[j].views,
                        thunderboom :stockdataset3[j].thunderboom
                    });
                }
            }
        }else {
            for(var i=0;i<stockdataset3.length;i++){
                var check = 0;
                for(var j=0;j<understand1.length;j++){
                    if(stockdataset3[i].day === understand1[j].day) {
                        check = 1;
                        understand2.push({
                            day: stockdataset3[i].day, 
                            facebook :understand1[j].facebook,
                            twitter :understand1[j].twitter,
                            youtube: understand1[j].youtube, 
                            likes :understand1[j].likes,
                            followers :understand1[j].followers,
                            subscribers :understand1[j].subscribers,
                            views :stockdataset3[i].views,
                            thunderboom :stockdataset3[i].thunderboom

                        });
                        continue;
                        }
                    }
                if (check !== 1) {
                    understand2.push({
                        day: stockdataset3[i].day, 
                        facebook: '0',
                        twitter: '0',
                        youtube: '0', 
                        likes :'0',
                        followers :'0',
                        subscribers :'0',
                        views: stockdataset3[i].views,
                        thunderboom :stockdataset3[i].thunderboom
                    });
                }
            }

            for(var j=0; j<understand1.length; j++){
                if (stockdataset3[stockdataset3.length-1].day < understand1[j].day ){
                    understand2.push({
                        day: understand1[j].day, 
                        facebook :understand1[j].facebook,
                        twitter :understand1[j].twitter,
                        youtube: understand1[j].youtube, 
                        likes :understand1[j].likes,
                        followers :understand1[j].followers,
                        subscribers :understand1[j].subscribers,
                        views: '0',
                        thunderboom :'0'
                    });
                }
            }
        }

        // **********************

        //combine the new array with total engagement dataset 
        var understand3 = [];
        if (understand2.length >= stockdataset4.length) {  
            for(var i=0;i < understand2.length; i++){
                var check = 0;
                for(var j=0;j<stockdataset4.length;j++){
                    if(understand2[i].day === stockdataset4[j].day) {
                        check = 1;
                        understand3.push({
                            day: understand2[i].day, 
                            facebook: understand2[i].facebook, 
                            twitter: understand2[i].twitter, 
                            youtube: understand2[i].youtube, 
                            likes :understand2[i].likes,
                            followers :understand2[i].followers,
                            subscribers :understand2[i].subscribers,
                            views :understand2[i].views,
                            thunderboom :understand2[i].thunderboom,
                            totalfacebook :stockdataset4[j].totalfacebook,
                            totaltwitter :stockdataset4[j].totaltwitter,
                            totalyoutube :stockdataset4[j].totalyoutube

                        });
                        continue;
                        }
                    }
                if (check !== 1) {
                    understand3.push({
                        day: understand2[i].day, 
                        facebook: understand2[i].facebook, 
                        twitter: understand2[i].twitter, 
                        youtube: understand2[i].youtube, 
                        likes :understand2[i].likes,
                        followers :understand2[i].followers,
                        subscribers :understand2[i].subscribers,
                        views :understand2[i].views,
                        thunderboom :understand2[i].thunderboom,
                        totalfacebook :'0',
                        totaltwitter :'0',
                        totalyoutube :'0'
                    });
                }
            }

            for(var j=0; j<stockdataset4.length; j++){
                if (understand2[understand2.length-1].day < stockdataset4[j].day ){
                    understand3.push({
                        day: stockdataset4[j].day,  
                        facebook: '0',
                        twitter: '0',
                        youtube: '0', 
                        likes :'0',
                        followers :'0',
                        subscribers :'0',
                        views: '0',
                        thunderboom :'0',
                        totalfacebook :stockdataset4[j].totalfacebook,
                        totaltwitter :stockdataset4[j].totaltwitter,
                        totalyoutube :stockdataset4[j].totalyoutube
                    });
                }
            }
        }else {
            for(var i=0;i<stockdataset4.length;i++){
                var check = 0;
                for(var j=0;j<understand2.length;j++){
                    if(stockdataset4[i].day === understand2[j].day) {
                        check = 1;
                        understand3.push({
                            day: stockdataset4[i].day, 
                            facebook :understand2[j].facebook,
                            twitter :understand2[j].twitter,
                            youtube: understand2[j].youtube, 
                            likes :understand2[j].likes,
                            followers :understand2[j].followers,
                            subscribers :understand2[j].subscribers,
                            views :understand2[j].views,
                            thunderboom :understand2[j].thunderboom,
                            totalfacebook :stockdataset4[i].totalfacebook,
                            totaltwitter :stockdataset4[i].totaltwitter,
                            totalyoutube :stockdataset4[i].totalyoutube

                        });
                        continue;
                        }
                    }
                if (check !== 1) {
                    understand2.push({
                        day: stockdataset4[i].day, 
                        facebook: '0',
                        twitter: '0',
                        youtube: '0', 
                        likes :'0',
                        followers :'0',
                        subscribers :'0',
                        views: '0',
                        thunderboom :'0',
                        totalfacebook :stockdataset4[i].totalfacebook,
                        totaltwitter :stockdataset4[i].totaltwitter,
                        totalyoutube :stockdataset4[i].totalyoutube
                    });
                }
            }

            for(var j=0; j<understand2.length; j++){
                if (stockdataset4[stockdataset4.length-1].day < understand2[j].day ){
                    understand2.push({
                        day: understand2[j].day, 
                        facebook :understand2[j].facebook,
                        twitter :understand2[j].twitter,
                        youtube: understand2[j].youtube, 
                        likes :understand2[j].likes,
                        followers :understand2[j].followers,
                        subscribers :understand2[j].subscribers,
                        views: understand2[j].views,
                        thunderboom :understand2[j].thunderboom,
                        totalfacebook : '0',
                        totaltwitter :'0',
                        totalyoutube: '0'
                    });
                }
            }
        }

        return understand3;

    }


    var stockdataset = multipleUnderstandDatasets(stockdataset1, stockdataset2, stockdataset3,stockdataset4);

    var chart;
    AmCharts.ready(function() {
        createStockChart();
    });

    function createStockChart() {
        chart = new AmCharts.AmStockChart();
        chart.pathToImages = "../js/libs/amstockchart/amcharts/images/";

        // DATASETS //////////////////////////////////////////
        var dataSet = new AmCharts.DataSet();
        dataSet.color = "#b0de09";
        dataSet.fieldMappings = [{
                fromField: "twitter",
                toField: "twitter"
            }, {
                fromField: "facebook",
                toField: "facebook"
            }, {
                fromField: "youtube",
                toField: "youtube"
            }, {
                fromField: "followers",
                toField: "followers"
            },
            {
                fromField: "likes",
                toField: "likes"
            },
            {
                fromField: "subscribers",
                toField: "subscribers"
            },
            {
                fromField: "views",
                toField: "views"
            },
            {
                fromField: "thunderboom",
                toField: "thunderboom"
            },
            {
                fromField: "totalfacebook",
                toField: "totalfacebook"
            },
            {
                fromField: "totaltwitter",
                toField: "totaltwitter"
            },
            {
                fromField: "totalyoutube",
                toField: "totalyoutube"
            }];
        dataSet.dataProvider = stockdataset;
        dataSet.categoryField = "day";
        chart.showCategoryAxis = true;

        // set data sets to the chart
        chart.dataSets = [dataSet];

        // PANELS ///////////////////////////////////////////                                                  
        // first stock panel
        var stockPanel1 = new AmCharts.StockPanel();
        stockPanel1.showCategoryAxis = true;
        stockPanel1.categoryAxis.axisColor = "#DADADA";
        stockPanel1.title = "Total Audience";
        stockPanel1.valueAxes = [{
            axisAlpha: 0,
            stackType: "regular",
            gridAlpha: 0.1
        }];

        // graph of first stock panel
        var graph1 = new AmCharts.StockGraph();
        graph1.valueField = "followers";
        graph1.lineAlpha = 1;
        graph1.fillAlphas = 0.7;
        graph1.useDataSetColors = false;
        graph1.lineColor = "#7BE0E0";
        graph1.title = "Twitter";
        graph1.fillColors = "#7BE0E0";
        graph1.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel1.addStockGraph(graph1);

         // graph of first stock panel
        var graph2 = new AmCharts.StockGraph();
        graph2.valueField = "likes";
        graph2.lineAlpha = 1;
        graph2.fillAlphas = 0.4;
        graph2.useDataSetColors = false;
        graph2.lineColor = "#4898e8";
        graph2.title = "Facebook";
        graph2.fillColors = "#4898e8";
        graph2.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel1.addStockGraph(graph2);

        // graph of first stock panel
        var graph3 = new AmCharts.StockGraph();
        graph3.valueField = "subscribers";
        graph3.lineAlpha = 1;
        graph3.fillAlphas = 0.5;
        graph3.useDataSetColors = false;
        graph3.lineColor = "#ed1c24";
        graph3.title = "YouTube";
        graph3.fillColors = "#ed1c24";
        graph3.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel1.addStockGraph(graph3);

        // create stock legend                
        var stockLegend1 = new AmCharts.StockLegend();
        stockLegend1.position = "bottom";
        stockLegend1.valueAlign = "left";
        stockLegend1.periodValueText = "total: [[value.close]]";
        stockLegend1.valueWidth = 100;
        stockLegend1.color = "#999999";
        stockPanel1.stockLegend = stockLegend1;

        // ****************

        //second stock panel
        var stockPanel4 = new AmCharts.StockPanel();
        stockPanel4.title = "Total Engagment";
        stockPanel4.categoryAxis.axisColor = "#DADADA";
        stockPanel4.valueAxes = [{
            axisAlpha: 0,
            stackType: "regular",
            gridAlpha: 0.1
        }];
 
        var graph9 = new AmCharts.StockGraph();
        graph9.valueField = "totaltwitter";
        graph9.lineAlpha = 1;
        graph9.fillAlphas = 0.7;
        graph9.useDataSetColors = false;
        graph9.lineColor = "#7BE0E0";
        graph9.title = "Twitter";
        graph9.fillColors = "#7BE0E0";
        graph9.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel4.addStockGraph(graph9);

         // graph of first stock panel
        var graph10 = new AmCharts.StockGraph();
        graph10.valueField = "totalfacebook";
        graph10.lineAlpha = 1;
        graph10.fillAlphas = 0.4;
        graph10.useDataSetColors = false;
        graph10.lineColor = "#4898e8";
        graph10.title = "Facebook";
        graph10.fillColors = "#4898e8";
        graph10.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel4.addStockGraph(graph10);

        // graph of first stock panel
        var graph11 = new AmCharts.StockGraph();
        graph11.valueField = "totalyoutube";
        graph11.lineAlpha = 1;
        graph11.fillAlphas = 0.5;
        graph11.useDataSetColors = false;
        graph11.lineColor = "#ed1c24";
        graph11.title = "YouTube";
        graph11.fillColors = "#ed1c24";
        graph11.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel4.addStockGraph(graph11);

        // create stock legend                
        var stockLegend4 = new AmCharts.StockLegend();
        stockLegend4.position = "bottom";
        stockLegend4.valueAlign = "left";
        stockLegend4.periodValueText = "total: [[value.sum]]";
        stockLegend4.valueWidth = 100;
        stockLegend4.color = "#999999";
        stockPanel4.stockLegend = stockLegend4;
        //end of second stock panel


        // *******************

        //second stock panel
        var stockPanel2 = new AmCharts.StockPanel();
        stockPanel2.title = "Total Video Engagment";
        stockPanel2.categoryAxis.axisColor = "#DADADA";
        stockPanel2.valueAxes = [{
            axisAlpha: 0,
            stackType: "regular",
            gridAlpha: 0.1
        }];
 
        var graph4 = new AmCharts.StockGraph();
        graph4.valueField = "twitter";
        graph4.lineAlpha = 1;
        graph4.fillAlphas = 0.7;
        graph4.useDataSetColors = false;
        graph4.lineColor = "#7BE0E0";
        graph4.title = "Twitter";
        graph4.fillColors = "#7BE0E0";
        graph4.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel2.addStockGraph(graph4);

         // graph of first stock panel
        var graph5 = new AmCharts.StockGraph();
        graph5.valueField = "facebook";
        graph5.lineAlpha = 1;
        graph5.fillAlphas = 0.4;
        graph5.useDataSetColors = false;
        graph5.lineColor = "#4898e8";
        graph5.title = "Facebook";
        graph5.fillColors = "#4898e8";
        graph5.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel2.addStockGraph(graph5);

        // graph of first stock panel
        var graph6 = new AmCharts.StockGraph();
        graph6.valueField = "youtube";
        graph6.lineAlpha = 1;
        graph6.fillAlphas = 0.5;
        graph6.useDataSetColors = false;
        graph6.lineColor = "#ed1c24";
        graph6.title = "YouTube";
        graph6.fillColors = "#ed1c24";
        graph6.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel2.addStockGraph(graph6);

        // create stock legend                
        var stockLegend2 = new AmCharts.StockLegend();
        stockLegend2.position = "bottom";
        stockLegend2.valueAlign = "left";
        stockLegend2.periodValueText = "total: [[value.sum]]";
        stockLegend2.valueWidth = 100;
        stockLegend2.color = "#999999";
        stockPanel2.stockLegend = stockLegend2;
        //end of second stock panel

        //third stock panel
        var stockPanel3 = new AmCharts.StockPanel();
        stockPanel3.title = "Total Views";
        stockPanel3.categoryAxis.axisColor = "#DADADA";
        stockPanel3.valueAxes = [{
            axisAlpha: 0,
            stackType: "regular",
            gridAlpha: 0.1
        }];
 
        var graph7 = new AmCharts.StockGraph();
        graph7.valueField = "views";
        graph7.lineAlpha = 1;
        graph7.fillAlphas = 0.5;
        graph7.useDataSetColors = false;
        graph7.lineColor = "#ed1c24";
        graph7.title = "Youtube views";
        graph7.fillColors = "#ed1c24";
        graph7.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel3.addStockGraph(graph7);

         var graph8 = new AmCharts.StockGraph();
        graph8.valueField = "thunderboom";
        graph8.lineAlpha = 1;
        graph8.fillAlphas = 0.5;
        graph8.useDataSetColors = false;
        graph8.lineColor = "#80b452";
        graph8.title = "Thunderboom views";
        graph8.fillColors = "#80b452";
        graph8.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel3.addStockGraph(graph8);

        // create stock legend                
        var stockLegend3 = new AmCharts.StockLegend();
        stockLegend3.position = "bottom";
        stockLegend3.valueAlign = "left";
        stockLegend3.periodValueText = "total: [[value.sum]]";
        stockLegend3.valueWidth = 100;
        stockLegend3.color = "#999999";
        stockPanel3.stockLegend = stockLegend3;
        //end of third panel

        // set panels to the chart
        chart.panels = [stockPanel1, stockPanel4, stockPanel2, stockPanel3];

        // OTHER SETTINGS ////////////////////////////////////
        var scrollbarSettings = new AmCharts.ChartScrollbarSettings();
        scrollbarSettings.graph = graph1;
        scrollbarSettings.position = "top";
        scrollbarSettings.graphType = "line";
        scrollbarSettings.usePeriod = "WW";
        scrollbarSettings.height = 40;
        chart.chartScrollbarSettings = scrollbarSettings;

        var cursorSettings = new AmCharts.ChartCursorSettings();
        cursorSettings.valueBalloonsEnabled = true;
        chart.chartCursorSettings = cursorSettings;

        var categoryAxesSettings = new AmCharts.CategoryAxesSettings();
        categoryAxesSettings.axisHeight = 40;
        chart.categoryAxesSettings  = categoryAxesSettings;


        // PERIOD SELECTOR ///////////////////////////////////
        var periodSelector = new AmCharts.PeriodSelector();
        periodSelector.position = "top";
        periodSelector.periods = [{
            period: "DD",
            count: 10,
            label: "10 days"},
        {
            period: "MM",
            count: 1,
            selected: true,
            label: "1 month"},
        {
            period: "YYYY",
            count: 1,
            label: "1 year"},
        {
            period: "YTD",
            label: "YTD"},
        {
            period: "MAX",
            label: "MAX"}];
        chart.periodSelector = periodSelector;

        chart.addListener('rendered', function (event) {
            var dataProvider = chart.dataSets[0].dataProvider,
                amchartsStartDate = $('#chartdiv-overview .amcharts-start-date-input'),
                amchartsEndDate = $('#chartdiv-overview .amcharts-end-date-input');

            amchartsStartDate.datepicker({
                format: 'dd-mm-yyyy',
                autoclose: true
            }).on('changeDate', function(e){
                amchartsStartDate.trigger('blur');
            });

            amchartsEndDate.datepicker({
                format: 'dd-mm-yyyy',
                autoclose: true
            }).on('changeDate', function(e){
                amchartsEndDate.trigger('blur');
            });
        });

        // ADD EVENTS TO CHART
        angular.forEach($scope.eventsguides, function(value, key){
            stockPanel1.categoryAxis.addGuide(value);
            stockPanel2.categoryAxis.addGuide(value);
            stockPanel3.categoryAxis.addGuide(value);
        });

        // Export chart ///////////
        chart.export = AmCharts.exportCFG;

        chart.write('chartdiv-overview');
    }
  
}]).


/**
 * Controller: AudienceController
 * Audience CONTROLLER
 * for the audience tpl
 */

controller('AudienceController', ['$rootScope', '$scope', '$http', '$timeout', function($rootScope, $scope, $http, $timeout) {
    'use strict';

    // Get seperate datasets to compine them in one
    var facebook_likes = window.facebook_page_likes_dataset,
        twitter_followers_dataset = window.twitter_followers_dataset,
        youtube_subscribers_dataset = window.youtube_subscribers_dataset;

    /**
     * Compine Multiple Datasets
     * params 3 datasets
     * return the final dataset that we will use to chart
     */
    function multipleDatasets(facebook_likes, twitter_followers_dataset, youtube_subscribers_dataset){    

        var audience_twitter_facebook = [];
        if (twitter_followers_dataset.length >= facebook_likes.length){
            for(var i=0; i<twitter_followers_dataset.length; i++){
                var check = 0;
                for(var j=0; j<facebook_likes.length; j++){
                    if(twitter_followers_dataset[i].day === facebook_likes[j].day) {
                        check = 1;
                        audience_twitter_facebook.push({
                            day: twitter_followers_dataset[i].day, 
                            followers: twitter_followers_dataset[i].followers, 
                            likes :facebook_likes[j].likes});
                        continue;
                        }
                    }
                if (check !== 1) {
                    audience_twitter_facebook.push({
                        day: twitter_followers_dataset[i].day, 
                        followers: twitter_followers_dataset[i].followers, 
                        likes: '0'});
                }
            }

            for(var j=0; j<facebook_likes.length; j++){
                if (twitter_followers_dataset[twitter_followers_dataset.length-1].day < facebook_likes[j].day ){
                    audience_twitter_facebook.push({day: facebook_likes[j].day, likes: facebook_likes[j].likes, followers: 0});
                }
            }
        }
        else{
            for(var i=0; i<facebook_likes.length; i++){
                var check = 0;
                for(var j=0;j<twitter_followers_dataset.length;j++){
                    if(facebook_likes[i].day === twitter_followers_dataset[j].day) {
                        check = 1;
                        audience_twitter_facebook.push({
                            day: facebook_likes[i].day, 
                            likes: facebook_likes[i].likes, 
                            followers :twitter_followers_dataset[j].followers});
                        continue;
                        }
                    }
                if (check !== 1) {
                    audience_twitter_facebook.push({
                        day: facebook_likes[i].day, 
                        likes: facebook_likes[i].likes, 
                        followers: '0'});
                }
            }

            for(var j=0;j<twitter_followers_dataset.length;j++){
                if (facebook_likes[facebook_likes.length-1].day < twitter_followers_dataset[j].day ){
                    audience_twitter_facebook.push({day: twitter_followers_dataset[j].day, followers: twitter_followers_dataset[j].followers, likes: 0});
                }
            }
        }

        var audience_twitter_facebook_subscribers = [];   
        if (audience_twitter_facebook.length>=youtube_subscribers_dataset.length){
            for(var i=0;i<audience_twitter_facebook.length;i++){
              var check = 0;
              for(var j=0; j<youtube_subscribers_dataset.length; j++){
                if(audience_twitter_facebook[i].day === youtube_subscribers_dataset[j].day) {
                    check = 1;
                    audience_twitter_facebook_subscribers.push({
                        day: audience_twitter_facebook[i].day, 
                        follrs: audience_twitter_facebook[i].followers,
                        liks: audience_twitter_facebook[i].likes,
                        subs: youtube_subscribers_dataset[j].subscribers});
                    continue;
                    }
                }
                if (check !== 1) {
                    audience_twitter_facebook_subscribers.push({
                        day: audience_twitter_facebook[i].day, 
                        follrs: audience_twitter_facebook[i].followers, 
                        liks: audience_twitter_facebook[i].likes,
                        subs: 0
                    });
                }
            }
            
            for(var j=0; j<youtube_subscribers_dataset.length; j++){
                if (audience_twitter_facebook[audience_twitter_facebook.length-1].day < youtube_subscribers_dataset[j].day ){
                    audience_twitter_facebook_subscribers.push({
                        day: youtube_subscribers_dataset[j].day,
                        follrs: 0, 
                        liks: 0,
                        subs: youtube_subscribers_dataset[j].subscribers
                    });
                }
            }

        }else {
            for(var i=0;i<youtube_subscribers_dataset.length;i++){
              var check = 0;
              for(var j=0;j<audience_twitter_facebook.length;j++){
                if(youtube_subscribers_dataset[i].day === audience_twitter_facebook[j].day) {
                    check = 1;
                    audience_twitter_facebook_subscribers.push({
                        day: youtube_subscribers_dataset[i].day, 
                        follrs: audience_twitter_facebook[j].followers,
                        liks: audience_twitter_facebook[j].likes,
                        subs: youtube_subscribers_dataset[i].subscribers});
                    continue;
                    }
                }
                if (check !== 1) {
                    audience_twitter_facebook_subscribers.push({
                        day: youtube_subscribers_dataset[i].day, 
                        follrs: 0, 
                        liks: 0,
                        subs: youtube_subscribers_dataset[i].subscribers
                    });
                }
            }

            for(var j=0; j<audience_twitter_facebook.length; j++){
                if (youtube_subscribers_dataset[youtube_subscribers_dataset.length-1].day < audience_twitter_facebook[j].day ){
                    audience_twitter_facebook_subscribers.push({
                        day: audience_twitter_facebook[j].day, 
                        follrs: audience_twitter_facebook[j].followers, 
                        liks: audience_twitter_facebook[j].likes,
                        subs:0
                    });
                }
            }
        }

        return audience_twitter_facebook_subscribers;
    }
    var stockdataset = multipleDatasets(facebook_likes, twitter_followers_dataset, youtube_subscribers_dataset);
    
    var chart;
    AmCharts.ready(function() {
        createStockChart();
    });

    function createStockChart() {
        chart = new AmCharts.AmStockChart();
        chart.pathToImages = "../js/libs/amstockchart/amcharts/images/";

        // DATASETS //////////////////////////////////////////
        var dataSet = new AmCharts.DataSet();
        dataSet.color = "#b0de09";
        dataSet.fieldMappings = [{
            fromField: "follrs",
            toField: "followers"
        }, {
            fromField: "liks",
            toField: "likes"
        }, {
            fromField: "subs",
            toField: "subscribers"
        }];
        dataSet.dataProvider = stockdataset;
        dataSet.categoryField = "day";
        chart.showCategoryAxis = true;

        // set data sets to the chart
        chart.dataSets = [dataSet];

        // PANELS ///////////////////////////////////////////                                                  
        // first stock panel
        var stockPanel1 = new AmCharts.StockPanel();
        stockPanel1.showCategoryAxis = true;
        stockPanel1.categoryAxis.axisColor = "#DADADA";
        stockPanel1.title = "Audience All";
        stockPanel1.valueAxes = [{
            axisAlpha: 0,
            stackType: "regular",
            gridAlpha: 0.1
        }];

        // graph of first stock panel
        var graph1 = new AmCharts.StockGraph();
        graph1.valueField = "followers";
        graph1.lineAlpha = 1;
        graph1.fillAlphas = 0.7;
        graph1.useDataSetColors = false;
        graph1.compareFromStart = true;
        graph1.lineColor = "#7BE0E0";
        graph1.title = "Twitter";
        graph1.fillColors = "#7BE0E0";
        graph1.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel1.addStockGraph(graph1);

         // graph of first stock panel
        var graph2 = new AmCharts.StockGraph();
        graph2.valueField = "likes";
        graph2.lineAlpha = 1;
        graph2.fillAlphas = 0.4;
        graph2.useDataSetColors = false;
        graph2.lineColor = "#4898e8";
        graph2.title = "Facebook";
        graph2.fillColors = "#4898e8";
        graph2.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel1.addStockGraph(graph2);

        // graph of first stock panel
        var graph3 = new AmCharts.StockGraph();
        graph3.valueField = "subscribers";
        graph3.lineAlpha = 1;
        graph3.fillAlphas = 0.5;
        graph3.useDataSetColors = false;
        graph3.lineColor = "#ed1c24";
        graph3.title = "YouTube";
        graph3.fillColors = "#ed1c24";
        graph3.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel1.addStockGraph(graph3);

        // create stock legend                
        var stockLegend1 = new AmCharts.StockLegend();
        stockLegend1.position = "bottom";
        stockLegend1.valueAlign = "left";
        stockLegend1.periodValueText = "Total: [[value.close]]";

        stockLegend1.valueWidth = 100;
        stockLegend1.color = "#999999";
        stockPanel1.stockLegend = stockLegend1;

        //second stock panel
        var stockPanel2 = new AmCharts.StockPanel();
        stockPanel2.title = "Twitter Followers";
        stockPanel2.categoryAxis.axisColor = "#DADADA";
        stockPanel2.valueAxes = [{
            axisAlpha: 0,
            stackType: "regular",
            gridAlpha: 0.1
        }];
 
        var graph4 = new AmCharts.StockGraph();
        graph4.type = "column";
        graph4.valueField = "followers";
        graph4.comparable = true;
        graph4.compareFromStart = true;
        graph4.lineAlpha = 1;
        graph4.fillAlphas = 0.7;
        graph4.useDataSetColors = false;
        graph4.lineColor = "#7BE0E0";
        graph4.title = "Twitter";
        graph4.fillColors = "#7BE0E0";
        graph4.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel2.addStockGraph(graph4);

        // create stock legend                
        var stockLegend2 = new AmCharts.StockLegend();
        stockLegend2.position = "bottom";
        stockLegend2.valueAlign = "left";
        stockLegend2.periodValueText = "total: [[value.close]]";
        stockLegend2.valueWidth = 100;
        stockLegend2.color = "#999999";
        stockPanel2.stockLegend = stockLegend2;
        //end of second stock panel

        //third stock panel
        var stockPanel3 = new AmCharts.StockPanel();
        stockPanel3.title = "Facebook Page Likes";
        stockPanel3.categoryAxis.axisColor = "#DADADA";
        stockPanel3.valueAxes = [{
            axisAlpha: 0,
            stackType: "regular",
            gridAlpha: 0.1
        }];
 
        var graph5 = new AmCharts.StockGraph();
        graph5.type = "column";
        graph5.valueField = "likes";
        graph5.lineAlpha = 1;
        graph5.fillAlphas = 0.4;
        graph5.useDataSetColors = false;
        graph5.lineColor = "#4898e8";
        graph5.title = "Facebook";
        graph5.fillColors = "#4898e8";
        graph5.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel3.addStockGraph(graph5);

        // create stock legend                
        var stockLegend3 = new AmCharts.StockLegend();
        stockLegend3.position = "bottom";
        stockLegend3.valueAlign = "left";
        stockLegend3.periodValueText = "total: [[value.close]]";
        stockLegend3.valueWidth = 100;
        stockLegend3.color = "#999999";
        stockPanel3.stockLegend = stockLegend3;
        //end of third panel

        //fourth stock panel
        var stockPanel4 = new AmCharts.StockPanel();
        stockPanel4.title = "YouTube Subscribers";
        stockPanel4.categoryAxis.axisColor = "#DADADA";
        stockPanel4.valueAxes = [{
            axisAlpha: 0,
            stackType: "regular",
            gridAlpha: 0.1
        }];
 
        var graph6 = new AmCharts.StockGraph();
        graph6.type = "column";
        graph6.valueField = "subscribers";
        graph6.lineAlpha = 1;
        graph6.fillAlphas = 0.4;
        graph6.useDataSetColors = false;
        graph6.lineColor = "#ed1c24";
        graph6.title = "YouTube";
        graph6.fillColors = "#ed1c24";
        graph6.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel4.addStockGraph(graph6);

        // create stock legend                
        var stockLegend4 = new AmCharts.StockLegend();
        stockLegend4.position = "bottom";
        stockLegend4.valueAlign = "left";
        stockLegend4.periodValueText = "total: [[value.close]]";
        stockLegend4.valueWidth = 100;
        stockLegend4.color = "#999999";
        stockPanel4.stockLegend = stockLegend4;
        //end of fourth panel

        // set panels to the chart
        chart.panels = [stockPanel1,stockPanel2,stockPanel3,stockPanel4];

        // OTHER SETTINGS ////////////////////////////////////
        var scrollbarSettings = new AmCharts.ChartScrollbarSettings();
        scrollbarSettings.graph = graph1;
        scrollbarSettings.position = "top";
        scrollbarSettings.graphType = "line";
        scrollbarSettings.usePeriod = "WW";
        scrollbarSettings.height = 40;
        chart.chartScrollbarSettings = scrollbarSettings;

        var cursorSettings = new AmCharts.ChartCursorSettings();
        cursorSettings.valueBalloonsEnabled = true;
        chart.chartCursorSettings = cursorSettings;

        var categoryAxesSettings = new AmCharts.CategoryAxesSettings();
        categoryAxesSettings.axisHeight = 40;
        chart.categoryAxesSettings  = categoryAxesSettings;

        // PERIOD SELECTOR ///////////////////////////////////
        var periodSelector = new AmCharts.PeriodSelector();
        periodSelector.position = "top";
        periodSelector.periods = [{
            period: "DD",
            count: 10,
            label: "10 days"},
        {
            period: "MM",
            count: 1,
            selected: true,
            label: "1 month"},
        {
            period: "YYYY",
            count: 1,
            label: "1 year"},
        {
            period: "YTD",
            label: "YTD"},
        {
            period: "MAX",
            label: "MAX"}];
        chart.periodSelector = periodSelector;
        
        // ADD GUIDES TO CHART ///////////
        angular.forEach($scope.eventsguides, function(value, key){
             stockPanel1.categoryAxis.addGuide(value);
             stockPanel2.categoryAxis.addGuide(value);
             stockPanel3.categoryAxis.addGuide(value);
             stockPanel4.categoryAxis.addGuide(value);
        });

        // Export chart ///////////
        chart.export = AmCharts.exportCFG;

        // Datepicker
        chart.addListener('rendered', function (event) {
            var dataProvider = chart.dataSets[0].dataProvider,
                amchartsStartDate = $('#chartdiv-audience .amcharts-start-date-input'),
                amchartsEndDate = $('#chartdiv-audience .amcharts-end-date-input');
                
            amchartsStartDate.datepicker({
                format: 'dd-mm-yyyy',
                autoclose: true
            }).on('changeDate', function(e){
                amchartsStartDate.trigger('blur');
            });

            amchartsEndDate.datepicker({
                format: 'dd-mm-yyyy',
                autoclose: true
            }).on('changeDate', function(e){
                amchartsEndDate.trigger('blur');
            });
        });

        chart.write('chartdiv-audience');
    }
}]).


/**
 * Controller: EngagementPerVideoController
 * EngagementPerVideoController CONTROLLER
 * for the engagement tpl
 */
controller('EngagementTotalController', ['$rootScope', '$scope', '$http', '$timeout', function($rootScope, $scope, $http, $timeout) {
    'use strict';

    var facebook_engagement_dataset = window.facebook_total_engagement_dataset,
        twitter_engagement_dataset = window.twitter_total_engagement_twitter,
        youtube_engagement_dataset = window.youtube_total_engagement_dataset;

    function multipleDatasets(facebook_engagement_dataset, twitter_engagement_dataset, youtube_engagement_dataset){
        
        var engagement_twitter_facebook = [];
        
        //combine facebook and twitter dataset to a new array engagement_twitter_facebook
        if (facebook_engagement_dataset.length >= twitter_engagement_dataset.length) {  
            for(var i=0;i<facebook_engagement_dataset.length;i++){
                var check = 0;
                for(var j=0;j<twitter_engagement_dataset.length;j++){
                    if(facebook_engagement_dataset[i].day === twitter_engagement_dataset[j].day) {
                        check = 1;
                        engagement_twitter_facebook.push({
                            day: facebook_engagement_dataset[i].day, 
                            facebook: facebook_engagement_dataset[i].facebook,
                            total_page_likes: facebook_engagement_dataset[i].total_page_likes, 
                            twitter: twitter_engagement_dataset[j].twitter,
                            retweets_count: twitter_engagement_dataset[j].retweets_count, 
                            favorites_count: twitter_engagement_dataset[j].favorites_count  
                        });
                        continue;
                        }
                    }
                if (check !== 1) {
                    engagement_twitter_facebook.push({
                        day: facebook_engagement_dataset[i].day, 
                        facebook: facebook_engagement_dataset[i].facebook, 
                        total_page_likes: facebook_engagement_dataset[i].total_page_likes, 
                        twitter: '0',
                        retweets_count: '0', 
                        favorites_count: '0'  
                    });
                }
            }
            for(var j=0; j<twitter_engagement_dataset.length; j++){
                if (facebook_engagement_dataset[facebook_engagement_dataset.length-1].day < twitter_engagement_dataset[j].day ){
                    engagement_twitter_facebook.push({
                        day: twitter_engagement_dataset[j].day,  
                        facebook: '0',
                        total_page_likes: '0', 
                        twitter: twitter_engagement_dataset[j].twitter,
                        retweets_count: twitter_engagement_dataset[j].retweets_count, 
                        favorites_count: twitter_engagement_dataset[j].favorites_count  
                    });
                }
            }
        } else {
            for(var i=0;i<twitter_engagement_dataset.length;i++){
                var check = 0;
                for(var j=0;j<facebook_engagement_dataset.length;j++){
                    if(twitter_engagement_dataset[i].day === facebook_engagement_dataset[j].day) {
                        check = 1;
                        engagement_twitter_facebook.push({
                            day: twitter_engagement_dataset[i].day, 
                            facebook :facebook_engagement_dataset[j].facebook,
                            total_page_likes: facebook_engagement_dataset[j].total_page_likes, 
                            twitter: twitter_engagement_dataset[i].twitter,
                            retweets_count: twitter_engagement_dataset[i].retweets_count, 
                            favorites_count: twitter_engagement_dataset[i].favorites_count  

                        });
                        continue;
                        }
                    }
                if (check !== 1) {
                    engagement_twitter_facebook.push({
                        day: twitter_engagement_dataset[i].day, 
                        facebook: '0',
                        total_page_likes: '0',
                        twitter: twitter_engagement_dataset[i].twitter,
                        retweets_count: twitter_engagement_dataset[i].retweets_count, 
                        favorites_count: twitter_engagement_dataset[i].favorites_count  
                    });
                }
            }
            for(var j=0; j<facebook_engagement_dataset.length; j++){
                if (twitter_engagement_dataset[twitter_engagement_dataset.length-1].day < facebook_engagement_dataset[j].day ){
                    engagement_twitter_facebook.push({
                        day: facebook_engagement_dataset[j].day, 
                        facebook: facebook_engagement_dataset[j].facebook, 
                        total_page_likes: facebook_engagement_dataset[j].total_page_likes, 
                        twitter: '0',
                        retweets_count: '0',
                        favorites_count: '0'
                    });
                }
            }
        }

        //combine the new array engagement_twitter_facebook with youtube dataset 
        var engagement_twitter_facebook_youtube = [];
        if (engagement_twitter_facebook.length >= youtube_engagement_dataset.length) {  
            for(var i=0;i < engagement_twitter_facebook.length; i++){
                var check = 0;
                for(var j=0;j<youtube_engagement_dataset.length;j++){
                    if(engagement_twitter_facebook[i].day === youtube_engagement_dataset[j].day) {
                        check = 1;
                        engagement_twitter_facebook_youtube.push({
                            day: engagement_twitter_facebook[i].day, 
                            facebook: engagement_twitter_facebook[i].facebook, 
                            total_page_likes: engagement_twitter_facebook[i].total_page_likes, 
                            twitter: engagement_twitter_facebook[i].twitter, 
                            retweets_count: engagement_twitter_facebook[i].retweets_count, 
                            favorites_count: engagement_twitter_facebook[i].favorites_count,  
                            youtube: youtube_engagement_dataset[j].youtube,
                            commentCount: youtube_engagement_dataset[j].commentCount,
                            favoriteCount: youtube_engagement_dataset[j].favoriteCount

                        });
                        continue;
                        }
                    }
                if (check !== 1) {
                    engagement_twitter_facebook_youtube.push({
                        day: engagement_twitter_facebook[i].day, 
                        facebook: engagement_twitter_facebook[i].facebook, 
                        total_page_likes: engagement_twitter_facebook[i].total_page_likes, 
                        twitter: engagement_twitter_facebook[i].twitter, 
                        retweets_count: engagement_twitter_facebook[i].retweets_count, 
                        favorites_count: engagement_twitter_facebook[i].favorites_count,  
                        youtube: '0',
                        commentCount: '0',
                        favoriteCount: '0'
                    });
                }
            }

            for(var j=0; j<youtube_engagement_dataset.length; j++){
                if (engagement_twitter_facebook[engagement_twitter_facebook.length-1].day < youtube_engagement_dataset[j].day ){
                    engagement_twitter_facebook_youtube.push({
                        day: youtube_engagement_dataset[j].day,  
                        facebook: '0',
                        total_page_likes: '0', 
                        twitter: '0',
                        retweets_count: '0', 
                        favorites_count: '0',
                        youtube: youtube_engagement_dataset[j].youtube,
                        commentCount: youtube_engagement_dataset[j].commentCount,
                        favoriteCount: youtube_engagement_dataset[j].favoriteCount
                    });
                }
            }
        }else {
            for(var i=0;i<youtube_engagement_dataset.length;i++){
                var check = 0;
                for(var j=0;j<engagement_twitter_facebook.length;j++){
                    if(youtube_engagement_dataset[i].day === engagement_twitter_facebook[j].day) {
                        check = 1;
                        engagement_twitter_facebook_youtube.push({
                            day: youtube_engagement_dataset[i].day, 
                            facebook: engagement_twitter_facebook[j].facebook,
                            total_page_likes: engagement_twitter_facebook[j].total_page_likes, 
                            twitter: engagement_twitter_facebook[j].twitter,
                            retweets_count: engagement_twitter_facebook[j].retweets_count, 
                            favorites_count: engagement_twitter_facebook[j].favorites_count,  
                            youtube: youtube_engagement_dataset[i].youtube,
                            commentCount: youtube_engagement_dataset[i].commentCount,
                            favoriteCount: youtube_engagement_dataset[i].favoriteCount
                        });
                        continue;
                        }
                    }
                if (check !== 1) {
                    engagement_twitter_facebook_youtube.push({
                        day: youtube_engagement_dataset[i].day, 
                        facebook: '0',
                        total_page_likes: '0',
                        twitter: '0',
                        retweets_count: '0',
                        favorites_count: '0',
                        youtube: youtube_engagement_dataset[i].youtube,
                        commentCount: youtube_engagement_dataset[i].commentCount,
                        favoriteCount: youtube_engagement_dataset[i].favoriteCount

                    });
                }
            }

            for(var j=0; j<engagement_twitter_facebook.length; j++){
                if (youtube_engagement_dataset[youtube_engagement_dataset.length-1].day < engagement_twitter_facebook[j].day ){
                    engagement_twitter_facebook_youtube.push({
                        day: engagement_twitter_facebook[j].day, 
                        facebook: engagement_twitter_facebook[j].facebook, 
                        total_page_likes: engagement_twitter_facebook[j].total_page_likes, 
                        twitter: engagement_twitter_facebook[j].twitter, 
                        retweets_count: engagement_twitter_facebook[j].retweets_count, 
                        favorites_count: engagement_twitter_facebook[j].favorites_count,  
                        youtube: '0',
                        commentCount: '0',
                        favoriteCount: '0'
                    });
                }
            }
        }

        return engagement_twitter_facebook_youtube;
    }
    
    var stockdataset = multipleDatasets(facebook_engagement_dataset, twitter_engagement_dataset, youtube_engagement_dataset);

    var chart;
    AmCharts.ready(function() {
        createStockChart();
    });

    function createStockChart() {
        chart = new AmCharts.AmStockChart();
        chart.pathToImages = "../js/libs/amstockchart/amcharts/images/";
        
        // DATASETS //////////////////////////////////////////
        var dataSet = new AmCharts.DataSet();
        dataSet.color = "#b0de09";
        dataSet.fieldMappings = [{
                fromField: "twitter",
                toField: "twitter"
            }, {
                fromField: "facebook",
                toField: "facebook"
            }, {
                fromField: "youtube",
                toField: "youtube"
            }, {
                fromField: "retweets_count",
                toField: "retweets"
            },
            {
                fromField: "favorites_count",
                toField: "favorites"
            },
            {
                fromField: "total_page_likes",
                toField: "likes"
            },
            {
                fromField: "commentCount",
                toField: "ytcomments"
            },
            {
                fromField: "favoriteCount",
                toField: "ytfavorites"
        }];
        dataSet.dataProvider = stockdataset;
        dataSet.categoryField = "day";
        chart.showCategoryAxis = true;
        // set data sets to the chart
        chart.dataSets = [dataSet];

        // PANELS ////////////////////////////////                                                  
        // first stock panel
        var stockPanel1 = new AmCharts.StockPanel();
        stockPanel1.showCategoryAxis = true;
        stockPanel1.categoryAxis.axisColor = "#DADADA";
        stockPanel1.title = "Engagment All";
        stockPanel1.valueAxes = [{
            axisAlpha: 0,
            stackType: "regular",
            gridAlpha: 0.1
        }];

        // graph of first stock panel
        var graph1 = new AmCharts.StockGraph();
        graph1.valueField = "twitter";
        graph1.lineAlpha = 1;
        graph1.fillAlphas = 0.7;
        graph1.useDataSetColors = false;
        graph1.lineColor = "#7BE0E0";
        graph1.title = "Twitter";
        graph1.fillColors = "#7BE0E0";
        graph1.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel1.addStockGraph(graph1);

         // graph of first stock panel
        var graph2 = new AmCharts.StockGraph();
        graph2.valueField = "facebook";
        graph2.lineAlpha = 1;
        graph2.fillAlphas = 0.4;
        graph2.useDataSetColors = false;
        graph2.lineColor = "#4898e8";
        graph2.title = "Facebook";
        graph2.fillColors = "#4898e8";
        graph2.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel1.addStockGraph(graph2);

        // graph of first stock panel
        var graph3 = new AmCharts.StockGraph();
        graph3.valueField = "youtube";
        graph3.lineAlpha = 1;
        graph3.fillAlphas = 0.5;
        graph3.useDataSetColors = false;
        graph3.lineColor = "#ed1c24";
        graph3.title = "YouTube";
        graph3.fillColors = "#ed1c24";
        graph3.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel1.addStockGraph(graph3);

        // create stock legend                
        var stockLegend1 = new AmCharts.StockLegend();
        stockLegend1.position = "bottom";
        stockLegend1.valueAlign = "left";
        stockLegend1.periodValueText = "total: [[value.sum]]";
        stockLegend1.valueWidth = 100;
        stockLegend1.color = "#999999";
        stockPanel1.stockLegend = stockLegend1;

        //second stock panel
        var stockPanel2 = new AmCharts.StockPanel();
        stockPanel2.title = "Twitter";
        stockPanel2.categoryAxis.axisColor = "#DADADA";
        stockPanel2.valueAxes = [{
            axisAlpha: 0,
            stackType: "regular",
            gridAlpha: 0.1
        }];
 
        var graph4 = new AmCharts.StockGraph();
        graph4.type = "column";
        graph4.valueField = "retweets";
        graph4.lineAlpha = 1;
        graph4.fillAlphas = 0.7;
        graph4.useDataSetColors = false;
        graph4.lineColor = "#7BE0E0";
        graph4.title = "Retweets";
        graph4.fillColors = "#7BE0E0";
        graph4.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel2.addStockGraph(graph4);

        var graph5 = new AmCharts.StockGraph();
        graph5.type = "column";
        graph5.valueField = "favorites";
        graph5.lineAlpha = 1;
        graph5.fillAlphas = 0.7;
        graph5.useDataSetColors = false;
        graph5.lineColor = "#066E65";
        graph5.title = "Favorites";
        graph5.fillColors = "#066E65";
        graph5.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel2.addStockGraph(graph5);

        // create stock legend                
        var stockLegend2 = new AmCharts.StockLegend();
        stockLegend2.position = "bottom";
        stockLegend2.valueAlign = "left";
        stockLegend2.periodValueText = "total: [[value.sum]]";
        stockLegend2.valueWidth = 100;
        stockLegend2.color = "#999999";
        stockPanel2.stockLegend = stockLegend2;
        //end of second stock panel

        //third stock panel
        var stockPanel3 = new AmCharts.StockPanel();
        stockPanel3.title = "Facebook";
        stockPanel3.categoryAxis.axisColor = "#DADADA";
        stockPanel3.valueAxes = [{
            axisAlpha: 0,
            stackType: "regular",
            gridAlpha: 0.1
        }];
 
        var graph6 = new AmCharts.StockGraph();
        graph6.type = "column";
        graph6.valueField = "likes";
        graph6.lineAlpha = 1;
        graph6.fillAlphas = 0.4;
        graph6.useDataSetColors = false;
        graph6.lineColor = "#4898e8";
        graph6.title = "Likes";
        graph6.fillColors = "#4898e8";
        graph6.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel3.addStockGraph(graph6);

        // var graph7 = new AmCharts.StockGraph();
        // graph7.type = "column";
        // graph7.valueField = "sharedposts";
        // graph7.lineAlpha = 1;
        // graph7.fillAlphas = 0.4;
        // graph7.useDataSetColors = false;
        // graph7.lineColor = "#6761b5";
        // graph7.title = "Shares";
        // graph7.fillColors = "#6761b5";
        // graph7.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        // stockPanel3.addStockGraph(graph7);

        // create stock legend                
        var stockLegend3 = new AmCharts.StockLegend();
        stockLegend3.position = "bottom";
        stockLegend3.valueAlign = "left";
        stockLegend3.periodValueText = "total: [[value.sum]]";
        stockLegend3.valueWidth = 100;
        stockLegend3.color = "#999999";
        stockPanel3.stockLegend = stockLegend3;
        //end of third panel

        //fourth stock panel
        var stockPanel4 = new AmCharts.StockPanel();
        stockPanel4.title = "YouTube";
        stockPanel4.categoryAxis.axisColor = "#DADADA";
        stockPanel4.valueAxes = [{
            axisAlpha: 0,
            stackType: "regular",
            gridAlpha: 0.1
        }];
 
        var graph8 = new AmCharts.StockGraph();
        graph8.type = "column";
        graph8.valueField = "ytcomments";
        graph8.lineAlpha = 1;
        graph8.fillAlphas = 0.4;
        graph8.useDataSetColors = false;
        graph8.lineColor = "#ed1c24";
        graph8.title = "Comments";
        graph8.fillColors = "#ed1c24";
        graph8.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel4.addStockGraph(graph8);

        var graph9 = new AmCharts.StockGraph();
        graph9.type = "column";
        graph9.valueField = "ytfavorites";
        graph9.lineAlpha = 1;
        graph9.fillAlphas = 0.4;
        graph9.useDataSetColors = false;
        graph9.lineColor = "#f36e31";
        graph9.title = "Favorites";
        graph9.fillColors = "#f36e31";
        graph9.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel4.addStockGraph(graph9);

        // create stock legend                
        var stockLegend4 = new AmCharts.StockLegend();
        stockLegend4.position = "bottom";
        stockLegend4.valueAlign = "left";
        stockLegend4.periodValueText = "total: [[value.sum]]";
        stockLegend4.valueWidth = 100;
        stockLegend4.color = "#999999";
        stockPanel4.stockLegend = stockLegend4;
        //end of fourth panel

        // set panels to the chart
        chart.panels = [stockPanel1,stockPanel2,stockPanel3,stockPanel4];

        // OTHER SETTINGS ////////////////////////////////////
        var scrollbarSettings = new AmCharts.ChartScrollbarSettings();
        scrollbarSettings.graph = graph1;
        scrollbarSettings.position = "top";
        scrollbarSettings.graphType = "line";
        scrollbarSettings.usePeriod = "WW";
        scrollbarSettings.height = 40;
        chart.chartScrollbarSettings = scrollbarSettings;

        var cursorSettings = new AmCharts.ChartCursorSettings();
        cursorSettings.valueBalloonsEnabled = true;
        chart.chartCursorSettings = cursorSettings;

        var categoryAxesSettings = new AmCharts.CategoryAxesSettings();
        categoryAxesSettings.axisHeight = 40;
        chart.categoryAxesSettings  = categoryAxesSettings;

        // PERIOD SELECTOR ///////////////////////////////////
        var periodSelector = new AmCharts.PeriodSelector();
        periodSelector.position = "top";
        periodSelector.periods = [{
            period: "DD",
            count: 10,
            label: "10 days"},
        {
            period: "MM",
            count: 1,
            selected: true,
            label: "1 month"},
        {
            period: "YYYY",
            count: 1,
            label: "1 year"},
        {
            period: "YTD",
            label: "YTD"},
        {
            period: "MAX",
            label: "MAX"}];
        chart.periodSelector = periodSelector;

        // ADD GUIDES ON CHART ///////////////////////////////////
        angular.forEach($scope.eventsguides, function(value, key){
             stockPanel1.categoryAxis.addGuide(value);
             stockPanel2.categoryAxis.addGuide(value);
             stockPanel3.categoryAxis.addGuide(value);
             stockPanel4.categoryAxis.addGuide(value);
        });

        // Datepicker
        chart.addListener('rendered', function (event) {
            var dataProvider = chart.dataSets[0].dataProvider,
                amchartsStartDate = $('#chartdiv-engagement .amcharts-start-date-input'),
                amchartsEndDate = $('#chartdiv-engagement .amcharts-end-date-input');
                
            amchartsStartDate.datepicker({
                format: 'dd-mm-yyyy',
                autoclose: true
            }).on('changeDate', function(e){
                amchartsStartDate.trigger('blur');
            });

            amchartsEndDate.datepicker({
                format: 'dd-mm-yyyy',
                autoclose: true
            }).on('changeDate', function(e){
                amchartsEndDate.trigger('blur');
            });
        });

        // Export chart ///////////
        chart.export = AmCharts.exportCFG;

        chart.write('chartdiv-engagement');
    }

  
}]).


/**
 * Controller: EngagementPerVideoController
 * EngagementPerVideoController CONTROLLER
 * for the engagement tpl
 */
controller('EngagementPerVideoController', ['$rootScope', '$scope', '$http', '$timeout', function($rootScope, $scope, $http, $timeout) {
    'use strict';

    var facebook_engagement_dataset = window.facebook_engagement_dataset,
        twitter_engagement_dataset = window.total_twitter_engagement_dataset,
        youtube_engagement_dataset = window.youtube_engagement_dataset;

    function multipleDatasets(facebook_engagement_dataset, twitter_engagement_dataset, youtube_engagement_dataset){
        
        var engagement_twitter_facebook = [];
        
        //combine facebook and twitter dataset to a new array engagement_twitter_facebook
        if (facebook_engagement_dataset.length >= twitter_engagement_dataset.length) {  
            for(var i=0;i<facebook_engagement_dataset.length;i++){
                var check = 0;
                for(var j=0;j<twitter_engagement_dataset.length;j++){
                    if(facebook_engagement_dataset[i].day === twitter_engagement_dataset[j].day) {
                        check = 1;
                        engagement_twitter_facebook.push({
                            day: facebook_engagement_dataset[i].day, 
                            facebook: facebook_engagement_dataset[i].facebook,
                            likes: facebook_engagement_dataset[i].likes, 
                            shares: facebook_engagement_dataset[i].sharedposts, 
                            twitter: twitter_engagement_dataset[j].twitter,
                            retweets: twitter_engagement_dataset[j].retweets, 
                            favorites: twitter_engagement_dataset[j].favorites  
                        });
                        continue;
                        }
                    }
                if (check !== 1) {
                    engagement_twitter_facebook.push({
                        day: facebook_engagement_dataset[i].day, 
                        facebook: facebook_engagement_dataset[i].facebook, 
                        likes: facebook_engagement_dataset[i].likes, 
                        shares: facebook_engagement_dataset[i].sharedposts,
                        twitter: '0',
                        retweets: '0', 
                        favorites: '0'  
                    });
                }
            }
            for(var j=0; j<twitter_engagement_dataset.length; j++){
                if (facebook_engagement_dataset[facebook_engagement_dataset.length-1].day < twitter_engagement_dataset[j].day ){
                    engagement_twitter_facebook.push({
                        day: twitter_engagement_dataset[j].day,  
                        facebook: '0',
                        likes: '0', 
                        shares: '0',
                        twitter: twitter_engagement_dataset[j].twitter,
                        retweets: twitter_engagement_dataset[j].retweets, 
                        favorites: twitter_engagement_dataset[j].favorites  
                    });
                }
            }
        } else {
            for(var i=0;i<twitter_engagement_dataset.length;i++){
                var check = 0;
                for(var j=0;j<facebook_engagement_dataset.length;j++){
                    if(twitter_engagement_dataset[i].day === facebook_engagement_dataset[j].day) {
                        check = 1;
                        engagement_twitter_facebook.push({
                            day: twitter_engagement_dataset[i].day, 
                            facebook :facebook_engagement_dataset[j].facebook,
                            likes: facebook_engagement_dataset[j].likes, 
                            shares: facebook_engagement_dataset[j].sharedposts, 
                            twitter: twitter_engagement_dataset[i].twitter,
                            retweets: twitter_engagement_dataset[i].retweets, 
                            favorites: twitter_engagement_dataset[i].favorites  

                        });
                        continue;
                        }
                    }
                if (check !== 1) {
                    engagement_twitter_facebook.push({
                        day: twitter_engagement_dataset[i].day, 
                        facebook: '0',
                        likes: '0',
                        shares: '0',
                        twitter: twitter_engagement_dataset[i].twitter,
                        retweets: twitter_engagement_dataset[i].retweets, 
                        favorites: twitter_engagement_dataset[i].favorites  
                    });
                }
            }
            for(var j=0; j<facebook_engagement_dataset.length; j++){
                if (twitter_engagement_dataset[twitter_engagement_dataset.length-1].day < facebook_engagement_dataset[j].day ){
                    engagement_twitter_facebook.push({
                        day: facebook_engagement_dataset[j].day, 
                        facebook: facebook_engagement_dataset[j].facebook, 
                        likes: facebook_engagement_dataset[j].likes, 
                        shares: facebook_engagement_dataset[j].sharedposts,
                        twitter: '0',
                        retweets: '0',
                        favorites: '0'
                    });
                }
            }
        }

        //combine the new array engagement_twitter_facebook with youtube dataset 
        var engagement_twitter_facebook_youtube = [];
        if (engagement_twitter_facebook.length >= youtube_engagement_dataset.length) {  
            for(var i=0;i < engagement_twitter_facebook.length; i++){
                var check = 0;
                for(var j=0;j<youtube_engagement_dataset.length;j++){
                    if(engagement_twitter_facebook[i].day === youtube_engagement_dataset[j].day) {
                        check = 1;
                        engagement_twitter_facebook_youtube.push({
                            day: engagement_twitter_facebook[i].day, 
                            facebook: engagement_twitter_facebook[i].facebook, 
                            likes: engagement_twitter_facebook[i].likes, 
                            shares: engagement_twitter_facebook[i].shares,
                            twitter: engagement_twitter_facebook[i].twitter, 
                            retweets: engagement_twitter_facebook[i].retweets, 
                            favorites: engagement_twitter_facebook[i].favorites,  
                            youtube: youtube_engagement_dataset[j].youtube,
                            commentCount: youtube_engagement_dataset[j].commentCount,
                            favoriteCount: youtube_engagement_dataset[j].favoriteCount

                        });
                        continue;
                        }
                    }
                if (check !== 1) {
                    engagement_twitter_facebook_youtube.push({
                        day: engagement_twitter_facebook[i].day, 
                        facebook: engagement_twitter_facebook[i].facebook, 
                        likes: engagement_twitter_facebook[i].likes, 
                        shares: engagement_twitter_facebook[i].shares,
                        twitter: engagement_twitter_facebook[i].twitter, 
                        retweets: engagement_twitter_facebook[i].retweets, 
                        favorites: engagement_twitter_facebook[i].favorites,  
                        youtube: '0',
                        commentCount: '0',
                        favoriteCount: '0'
                    });
                }
            }

            for(var j=0; j<youtube_engagement_dataset.length; j++){
                if (engagement_twitter_facebook[engagement_twitter_facebook.length-1].day < youtube_engagement_dataset[j].day ){
                    engagement_twitter_facebook_youtube.push({
                        day: youtube_engagement_dataset[j].day,  
                        facebook: '0',
                        likes: '0', 
                        shares: '0',
                        twitter: '0',
                        retweets: '0', 
                        favorites: '0',
                        youtube: youtube_engagement_dataset[j].youtube,
                        commentCount: youtube_engagement_dataset[j].commentCount,
                        favoriteCount: youtube_engagement_dataset[j].favoriteCount
                    });
                }
            }
        }else {
            for(var i=0;i<youtube_engagement_dataset.length;i++){
                var check = 0;
                for(var j=0;j<engagement_twitter_facebook.length;j++){
                    if(youtube_engagement_dataset[i].day === engagement_twitter_facebook[j].day) {
                        check = 1;
                        engagement_twitter_facebook_youtube.push({
                            day: youtube_engagement_dataset[i].day, 
                            facebook: engagement_twitter_facebook[j].facebook,
                            likes: engagement_twitter_facebook[j].likes, 
                            shares: engagement_twitter_facebook[j].shares,
                            twitter: engagement_twitter_facebook[j].twitter,
                            retweets: engagement_twitter_facebook[j].retweets, 
                            favorites: engagement_twitter_facebook[j].favorites,  
                            youtube: youtube_engagement_dataset[i].youtube,
                            commentCount: youtube_engagement_dataset[i].commentCount,
                            favoriteCount: youtube_engagement_dataset[i].favoriteCount
                        });
                        continue;
                        }
                    }
                if (check !== 1) {
                    engagement_twitter_facebook_youtube.push({
                        day: youtube_engagement_dataset[i].day, 
                        facebook: '0',
                        likes: '0',
                        shares: '0',
                        twitter: '0',
                        retweets: '0',
                        favorites: '0',
                        youtube: youtube_engagement_dataset[i].youtube,
                        commentCount: youtube_engagement_dataset[i].commentCount,
                        favoriteCount: youtube_engagement_dataset[i].favoriteCount

                    });
                }
            }

            for(var j=0; j<engagement_twitter_facebook.length; j++){
                if (youtube_engagement_dataset[youtube_engagement_dataset.length-1].day < engagement_twitter_facebook[j].day ){
                    engagement_twitter_facebook_youtube.push({
                        day: engagement_twitter_facebook[j].day, 
                        facebook: engagement_twitter_facebook[j].facebook, 
                        likes: engagement_twitter_facebook[j].likes, 
                        shares: engagement_twitter_facebook[j].shares,
                        twitter: engagement_twitter_facebook[j].twitter, 
                        retweets: engagement_twitter_facebook[j].retweets, 
                        favorites: engagement_twitter_facebook[j].favorites,  
                        youtube: '0',
                        commentCount: '0',
                        favoriteCount: '0'
                    });
                }
            }
        }

        return engagement_twitter_facebook_youtube;
    }
    
    var stockdataset = multipleDatasets(facebook_engagement_dataset, twitter_engagement_dataset, youtube_engagement_dataset);

    var chart;
    AmCharts.ready(function() {
        createStockChart();
    });

    function createStockChart() {
        chart = new AmCharts.AmStockChart();
        chart.pathToImages = "../js/libs/amstockchart/amcharts/images/";
        
        // DATASETS //////////////////////////////////////////
        var dataSet = new AmCharts.DataSet();
        dataSet.color = "#b0de09";
        dataSet.fieldMappings = [{
                fromField: "twitter",
                toField: "twitter"
            }, {
                fromField: "facebook",
                toField: "facebook"
            }, {
                fromField: "youtube",
                toField: "youtube"
            }, {
                fromField: "retweets",
                toField: "retweets"
            },
            {
                fromField: "favorites",
                toField: "favorites"
            },
            {
                fromField: "likes",
                toField: "likes"
            },
            {
                fromField: "shares",
                toField: "sharedposts"
            },
            {
                fromField: "commentCount",
                toField: "ytcomments"
            },
            {
                fromField: "favoriteCount",
                toField: "ytfavorites"
        }];
        dataSet.dataProvider = stockdataset;
        dataSet.categoryField = "day";
        chart.showCategoryAxis = true;
        // set data sets to the chart
        chart.dataSets = [dataSet];

        // PANELS ////////////////////////////////                                                  
        // first stock panel
        var stockPanel1 = new AmCharts.StockPanel();
        stockPanel1.showCategoryAxis = true;
        stockPanel1.categoryAxis.axisColor = "#DADADA";
        stockPanel1.title = "Engagment All";
        stockPanel1.valueAxes = [{
            axisAlpha: 0,
            stackType: "regular",
            gridAlpha: 0.1
        }];

        // graph of first stock panel
        var graph1 = new AmCharts.StockGraph();
        graph1.valueField = "twitter";
        graph1.lineAlpha = 1;
        graph1.fillAlphas = 0.7;
        graph1.useDataSetColors = false;
        graph1.lineColor = "#7BE0E0";
        graph1.title = "Twitter";
        graph1.fillColors = "#7BE0E0";
        graph1.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel1.addStockGraph(graph1);

         // graph of first stock panel
        var graph2 = new AmCharts.StockGraph();
        graph2.valueField = "facebook";
        graph2.lineAlpha = 1;
        graph2.fillAlphas = 0.4;
        graph2.useDataSetColors = false;
        graph2.lineColor = "#4898e8";
        graph2.title = "Facebook";
        graph2.fillColors = "#4898e8";
        graph2.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel1.addStockGraph(graph2);

        // graph of first stock panel
        var graph3 = new AmCharts.StockGraph();
        graph3.valueField = "youtube";
        graph3.lineAlpha = 1;
        graph3.fillAlphas = 0.5;
        graph3.useDataSetColors = false;
        graph3.lineColor = "#ed1c24";
        graph3.title = "YouTube";
        graph3.fillColors = "#ed1c24";
        graph3.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel1.addStockGraph(graph3);

        // create stock legend                
        var stockLegend1 = new AmCharts.StockLegend();
        stockLegend1.position = "bottom";
        stockLegend1.valueAlign = "left";
        stockLegend1.periodValueText = "total: [[value.sum]]";
        stockLegend1.valueWidth = 100;
        stockLegend1.color = "#999999";
        stockPanel1.stockLegend = stockLegend1;

        //second stock panel
        var stockPanel2 = new AmCharts.StockPanel();
        stockPanel2.title = "Twitter";
        stockPanel2.categoryAxis.axisColor = "#DADADA";
        stockPanel2.valueAxes = [{
            axisAlpha: 0,
            stackType: "regular",
            gridAlpha: 0.1
        }];
 
        var graph4 = new AmCharts.StockGraph();
        graph4.type = "column";
        graph4.valueField = "retweets";
        graph4.lineAlpha = 1;
        graph4.fillAlphas = 0.7;
        graph4.useDataSetColors = false;
        graph4.lineColor = "#7BE0E0";
        graph4.title = "Retweets";
        graph4.fillColors = "#7BE0E0";
        graph4.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel2.addStockGraph(graph4);

        var graph5 = new AmCharts.StockGraph();
        graph5.type = "column";
        graph5.valueField = "favorites";
        graph5.lineAlpha = 1;
        graph5.fillAlphas = 0.7;
        graph5.useDataSetColors = false;
        graph5.lineColor = "#066E65";
        graph5.title = "Favorites";
        graph5.fillColors = "#066E65";
        graph5.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel2.addStockGraph(graph5);

        // create stock legend                
        var stockLegend2 = new AmCharts.StockLegend();
        stockLegend2.position = "bottom";
        stockLegend2.valueAlign = "left";
        stockLegend2.periodValueText = "total: [[value.sum]]";
        stockLegend2.valueWidth = 100;
        stockLegend2.color = "#999999";
        stockPanel2.stockLegend = stockLegend2;
        //end of second stock panel

        //third stock panel
        var stockPanel3 = new AmCharts.StockPanel();
        stockPanel3.title = "Facebook";
        stockPanel3.categoryAxis.axisColor = "#DADADA";
        stockPanel3.valueAxes = [{
            axisAlpha: 0,
            stackType: "regular",
            gridAlpha: 0.1
        }];
 
        var graph6 = new AmCharts.StockGraph();
        graph6.type = "column";
        graph6.valueField = "likes";
        graph6.lineAlpha = 1;
        graph6.fillAlphas = 0.4;
        graph6.useDataSetColors = false;
        graph6.lineColor = "#4898e8";
        graph6.title = "Likes";
        graph6.fillColors = "#4898e8";
        graph6.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel3.addStockGraph(graph6);

        var graph7 = new AmCharts.StockGraph();
        graph7.type = "column";
        graph7.valueField = "sharedposts";
        graph7.lineAlpha = 1;
        graph7.fillAlphas = 0.4;
        graph7.useDataSetColors = false;
        graph7.lineColor = "#6761b5";
        graph7.title = "Shares";
        graph7.fillColors = "#6761b5";
        graph7.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel3.addStockGraph(graph7);

        // create stock legend                
        var stockLegend3 = new AmCharts.StockLegend();
        stockLegend3.position = "bottom";
        stockLegend3.valueAlign = "left";
        stockLegend3.periodValueText = "total: [[value.sum]]";
        stockLegend3.valueWidth = 100;
        stockLegend3.color = "#999999";
        stockPanel3.stockLegend = stockLegend3;
        //end of third panel

        //fourth stock panel
        var stockPanel4 = new AmCharts.StockPanel();
        stockPanel4.title = "YouTube";
        stockPanel4.categoryAxis.axisColor = "#DADADA";
        stockPanel4.valueAxes = [{
            axisAlpha: 0,
            stackType: "regular",
            gridAlpha: 0.1
        }];
 
        var graph8 = new AmCharts.StockGraph();
        graph8.type = "column";
        graph8.valueField = "ytcomments";
        graph8.lineAlpha = 1;
        graph8.fillAlphas = 0.4;
        graph8.useDataSetColors = false;
        graph8.lineColor = "#ed1c24";
        graph8.title = "Comments";
        graph8.fillColors = "#ed1c24";
        graph8.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel4.addStockGraph(graph8);

        var graph9 = new AmCharts.StockGraph();
        graph9.type = "column";
        graph9.valueField = "ytfavorites";
        graph9.lineAlpha = 1;
        graph9.fillAlphas = 0.4;
        graph9.useDataSetColors = false;
        graph9.lineColor = "#f36e31";
        graph9.title = "Favorites";
        graph9.fillColors = "#f36e31";
        graph9.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel4.addStockGraph(graph9);

        // create stock legend                
        var stockLegend4 = new AmCharts.StockLegend();
        stockLegend4.position = "bottom";
        stockLegend4.valueAlign = "left";
        stockLegend4.periodValueText = "total: [[value.sum]]";
        stockLegend4.valueWidth = 100;
        stockLegend4.color = "#999999";
        stockPanel4.stockLegend = stockLegend4;
        //end of fourth panel

        // set panels to the chart
        chart.panels = [stockPanel1,stockPanel2,stockPanel3,stockPanel4];

        // OTHER SETTINGS ////////////////////////////////////
        var scrollbarSettings = new AmCharts.ChartScrollbarSettings();
        scrollbarSettings.graph = graph1;
        scrollbarSettings.position = "top";
        scrollbarSettings.graphType = "line";
        scrollbarSettings.usePeriod = "WW";
        scrollbarSettings.height = 40;
        chart.chartScrollbarSettings = scrollbarSettings;

        var cursorSettings = new AmCharts.ChartCursorSettings();
        cursorSettings.valueBalloonsEnabled = true;
        chart.chartCursorSettings = cursorSettings;

        var categoryAxesSettings = new AmCharts.CategoryAxesSettings();
        categoryAxesSettings.axisHeight = 40;
        chart.categoryAxesSettings  = categoryAxesSettings;

        // PERIOD SELECTOR ///////////////////////////////////
        var periodSelector = new AmCharts.PeriodSelector();
        periodSelector.position = "top";
        periodSelector.periods = [{
            period: "DD",
            count: 10,
            label: "10 days"},
        {
            period: "MM",
            count: 1,
            selected: true,
            label: "1 month"},
        {
            period: "YYYY",
            count: 1,
            label: "1 year"},
        {
            period: "YTD",
            label: "YTD"},
        {
            period: "MAX",
            label: "MAX"}];
        chart.periodSelector = periodSelector;

        // ADD GUIDES ON CHART ///////////////////////////////////
        angular.forEach($scope.eventsguides, function(value, key){
             stockPanel1.categoryAxis.addGuide(value);
             stockPanel2.categoryAxis.addGuide(value);
             stockPanel3.categoryAxis.addGuide(value);
             stockPanel4.categoryAxis.addGuide(value);
        });

        // Datepicker
        chart.addListener('rendered', function (event) {
            var dataProvider = chart.dataSets[0].dataProvider,
                amchartsStartDate = $('#chartdiv-video-engagement .amcharts-start-date-input'),
                amchartsEndDate = $('#chartdiv-video-engagement .amcharts-end-date-input');
                
            amchartsStartDate.datepicker({
                format: 'dd-mm-yyyy',
                autoclose: true
            }).on('changeDate', function(e){
                amchartsStartDate.trigger('blur');
            });

            amchartsEndDate.datepicker({
                format: 'dd-mm-yyyy',
                autoclose: true
            }).on('changeDate', function(e){
                amchartsEndDate.trigger('blur');
            });
        });

        // Export chart ///////////
        chart.export = AmCharts.exportCFG;

        chart.write('chartdiv-video-engagement');
    }

    // Update dataset after choose video from dropdown
    $scope.$on('update-datasets', function(event, data) {

        var facebook_engagement_dataset = data.facebook_likes,
            twitter_engagement_dataset = data.twitter_engagement_dataset,
            youtube_engagement_dataset = data.youtube_engagement_dataset;

        var newDataset = multipleDatasets(facebook_engagement_dataset, twitter_engagement_dataset, youtube_engagement_dataset);

        chart.dataSets[0].dataProvider = newDataset; 
        chart.validateData();
        
    });

    // reset values to All 
    $scope.$on('reset-datasets', function(){
        
        chart.dataSets[0].dataProvider = stockdataset; 
        chart.validateData();
    });
  
}]).

/**
 * Controller: ViewsAllController
 * ViewsAllController
 * for the views tpl
 */

controller('ViewsController', ['$rootScope', '$scope', '$http', '$timeout', function($rootScope, $scope, $http, $timeout) {
    'use strict';

    // Get seperate datasetsto compine them in one
    var youtubedataset = window.youtube_dataset,
        jwviewsdataset = window.total_thunderviews;

    function multipleViewsDatasets(youtubedataset, jwviewsdataset){
        
        var combined_views = [];
        
        //combine facebook and twitter dataset to a new array combined_views
        if (youtubedataset.length >= jwviewsdataset.length) {  
            for(var i=0;i<youtubedataset.length;i++){
                var check = 0;
                for(var j=0;j<jwviewsdataset.length;j++){
                    if(youtubedataset[i].day === jwviewsdataset[j].day) {
                        check = 1;
                        combined_views.push({
                            day: youtubedataset[i].day, 
                            youtube: youtubedataset[i].views, 
                            thunderboom :jwviewsdataset[j].views});
                        continue;
                        }
                    }
                if (check !== 1) {
                    combined_views.push({
                        day: youtubedataset[i].day, 
                        youtube: youtubedataset[i].views, 
                        thunderboom: '0'
                    });
                }
            }
            for(var j=0; j<jwviewsdataset.length; j++){
                if (youtubedataset[youtubedataset.length-1].day < jwviewsdataset[j].day ){
                    combined_views.push({
                        day: jwviewsdataset[j].day,  
                        youtube: '0',
                        thunderboom: jwviewsdataset[j].views
                    });
                }
            }

        } else {
            for(var i=0;i<jwviewsdataset.length;i++){
                var check = 0;
                for(var j=0;j<youtubedataset.length;j++){
                    if(jwviewsdataset[i].day === youtubedataset[j].day) {
                        check = 1;
                        combined_views.push({
                            day: jwviewsdataset[i].day, 
                            youtube :youtubedataset[j].views,
                            thunderboom: jwviewsdataset[i].views});
                        continue;
                        }
                    }
                if (check !== 1) {
                    combined_views.push({
                        day: jwviewsdataset[i].day, 
                        youtube: '0',
                        thunderboom: jwviewsdataset[i].views});
                }
            }
            for(var j=0; j<youtubedataset.length; j++){
                if (jwviewsdataset[jwviewsdataset.length-1].day < youtubedataset[j].day ){
                    combined_views.push({
                        day: youtubedataset[j].day, 
                        youtube: youtubedataset[j].views, 
                        thunderboom: '0'
                    });
                }
            }
        }

        //combine the new array engagement_twitter_facebook with youtube dataset 
        // var engagement_twitter_facebook_youtube = [];
        // if (engagement_twitter_facebook.length >= youtube_engagement_dataset.length) {  
        //     for(var i=0;i < engagement_twitter_facebook.length; i++){
        //         var check = 0;
        //         for(var j=0;j<youtube_engagement_dataset.length;j++){
        //             if(engagement_twitter_facebook[i].day === youtube_engagement_dataset[j].day) {
        //                 check = 1;
        //                 engagement_twitter_facebook_youtube.push({
        //                     day: engagement_twitter_facebook[i].day, 
        //                     facebook: engagement_twitter_facebook[i].facebook, 
        //                     twitter: engagement_twitter_facebook[i].twitter, 
        //                     youtube :youtube_engagement_dataset[j].youtube});
        //                 continue;
        //                 }
        //             }
        //         if (check !== 1) {
        //             engagement_twitter_facebook_youtube.push({
        //                 day: engagement_twitter_facebook[i].day, 
        //                 facebook: engagement_twitter_facebook[i].facebook, 
        //                 twitter: engagement_twitter_facebook[i].twitter, 
        //                 youtube: '0'
        //             });
        //         }
        //     }

        //     for(var j=0; j<youtube_engagement_dataset.length; j++){
        //         if (engagement_twitter_facebook[engagement_twitter_facebook.length-1].day < youtube_engagement_dataset[j].day ){
        //             engagement_twitter_facebook_youtube.push({
        //                 day: youtube_engagement_dataset[j].day,  
        //                 facebook: '0',
        //                 twitter: '0',
        //                 youtube: youtube_engagement_dataset[j].youtube
        //             });
        //         }
        //     }
        // }else {
        //     for(var i=0;i<youtube_engagement_dataset.length;i++){
        //         var check = 0;
        //         for(var j=0;j<engagement_twitter_facebook.length;j++){
        //             if(youtube_engagement_dataset[i].day === engagement_twitter_facebook[j].day) {
        //                 check = 1;
        //                 engagement_twitter_facebook_youtube.push({
        //                     day: youtube_engagement_dataset[i].day, 
        //                     facebook :engagement_twitter_facebook[j].facebook,
        //                     twitter :engagement_twitter_facebook[j].twitter,
        //                     youtube: youtube_engagement_dataset[i].youtube});
        //                 continue;
        //                 }
        //             }
        //         if (check !== 1) {
        //             engagement_twitter_facebook_youtube.push({
        //                 day: youtube_engagement_dataset[i].day, 
        //                 facebook: '0',
        //                 twitter: '0',
        //                 youtube: youtube_engagement_dataset[i].youtube});
        //         }
        //     }

        //     for(var j=0; j<engagement_twitter_facebook.length; j++){
        //         if (youtube_engagement_dataset[youtube_engagement_dataset.length-1].day < engagement_twitter_facebook[j].day ){
        //             engagement_twitter_facebook_youtube.push({
        //                 day: engagement_twitter_facebook[j].day, 
        //                 facebook: engagement_twitter_facebook[j].facebook, 
        //                 twitter: engagement_twitter_facebook[j].twitter, 
        //                 youtube: '0'
        //             });
        //         }
        //     }
        // }

        return combined_views;
    }

    var stockdataset = multipleViewsDatasets(youtubedataset, jwviewsdataset);

    var chart;
    AmCharts.ready(function() {
        // generateChartData();
        createStockChart();
    });

    function createStockChart() {
        chart = new AmCharts.AmStockChart();
        chart.pathToImages = "../js/libs/amstockchart/amcharts/images/";

        // DATASETS //////////////////////////////////////////
        var dataSet = new AmCharts.DataSet();
        dataSet.color = "#b0de09";
        dataSet.fieldMappings = [{
                fromField: "youtube",
                toField: "youtube"
        }, {
            fromField: "thunderboom",
            toField: "thunderboom"
        }];
        dataSet.dataProvider = stockdataset;
        dataSet.categoryField = "day";
        chart.showCategoryAxis = true;

        // set data sets to the chart
        chart.dataSets = [dataSet];

        // PANELS ///////////////////////////////////////////                                                  
        // first stock panel
        var stockPanel1 = new AmCharts.StockPanel();
        stockPanel1.showCategoryAxis = true;
        stockPanel1.categoryAxis.axisColor = "#DADADA";
        stockPanel1.title = "Total Views";
        stockPanel1.valueAxes = [{
            axisAlpha: 0,
            stackType: "regular",
            gridAlpha: 0.1
        }];

        // graph of first stock panel
        var graph1 = new AmCharts.StockGraph();
        graph1.valueField = "youtube";
        graph1.lineAlpha = 1;
        graph1.fillAlphas = 0.5;
        graph1.useDataSetColors = false;
        graph1.lineColor = "#ed1c24";
        graph1.title = "YouTube";
        graph1.fillColors = "#ed1c24";
        graph1.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel1.addStockGraph(graph1);

         // graph of first stock panel
        var graph2 = new AmCharts.StockGraph();
        graph2.valueField = "thunderboom";
        graph2.lineAlpha = 1;
        graph2.fillAlphas = 0.4;
        graph2.useDataSetColors = false;
        graph2.lineColor = "#80b452";
        graph2.title = "Thunderboom";
        graph2.fillColors = "#80b452";
        graph2.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel1.addStockGraph(graph2);

        // create stock legend                
        var stockLegend1 = new AmCharts.StockLegend();
        stockLegend1.position = "bottom";
        stockLegend1.valueAlign = "left";
        stockLegend1.periodValueText = "total: [[value.sum]]";
        stockLegend1.valueWidth = 100;
        stockLegend1.color = "#999999";
        stockPanel1.stockLegend = stockLegend1;
        //end of first stock panel

        //second stock panel
        var stockPanel2 = new AmCharts.StockPanel();
        stockPanel2.title = "YouTube Views";
        stockPanel2.categoryAxis.axisColor = "#DADADA";
        stockPanel2.valueAxes = [{
            axisAlpha: 0,
            stackType: "regular",
            gridAlpha: 0.1
        }];
 
        var graph3 = new AmCharts.StockGraph();
        graph3.type = "column";
        graph3.valueField = "youtube";
        graph3.comparable = true;
        graph3.compareFromStart = true;
        graph3.lineAlpha = 1;
        graph3.fillAlphas = 0.7;
        graph3.useDataSetColors = false;
        graph3.lineColor = "#ed1c24";
        graph3.title = "Youtube Views";
        graph3.fillColors = "#ed1c24";
        graph3.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel2.addStockGraph(graph3);

        // create stock legend                
        var stockLegend2 = new AmCharts.StockLegend();
        stockLegend2.position = "bottom";
        stockLegend2.valueAlign = "left";
        stockLegend2.periodValueText = "total: [[value.sum]]";
        stockLegend2.valueWidth = 100;
        stockLegend2.color = "#999999";
        stockPanel2.stockLegend = stockLegend2;
        //end of second stock panel

        //third stock panel
        var stockPanel3 = new AmCharts.StockPanel();
        stockPanel3.title = "Thunderboom Views";
        stockPanel3.categoryAxis.axisColor = "#DADADA";
        stockPanel3.valueAxes = [{
            axisAlpha: 0,
            stackType: "regular",
            gridAlpha: 0.1
        }];
 
        var graph4 = new AmCharts.StockGraph();
        graph4.type = "column";
        graph4.valueField = "thunderboom";
        graph4.lineAlpha = 1;
        graph4.fillAlphas = 0.4;
        graph4.useDataSetColors = false;
        graph4.lineColor = "#80b452";
        graph4.title = "Thunderboom views";
        graph4.fillColors = "#80b452";
        graph4.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel3.addStockGraph(graph4);

        // create stock legend                
        var stockLegend3 = new AmCharts.StockLegend();
        stockLegend3.position = "bottom";
        stockLegend3.valueAlign = "left";
        stockLegend3.periodValueText = "total: [[value.sum]]";
        stockLegend3.valueWidth = 100;
        stockLegend3.color = "#999999";
        stockPanel3.stockLegend = stockLegend3;
        //end of third panel


        // set panels to the chart
        chart.panels = [stockPanel1,stockPanel2,stockPanel3];

        // OTHER SETTINGS ////////////////////////////////////
        var scrollbarSettings = new AmCharts.ChartScrollbarSettings();
        scrollbarSettings.graph = graph1;
        scrollbarSettings.position = "top";
        scrollbarSettings.graphType = "line";
        scrollbarSettings.usePeriod = "WW";
        scrollbarSettings.height = 40;
        chart.chartScrollbarSettings = scrollbarSettings;

        var cursorSettings = new AmCharts.ChartCursorSettings();
        cursorSettings.valueBalloonsEnabled = true;
        chart.chartCursorSettings = cursorSettings;

        var categoryAxesSettings = new AmCharts.CategoryAxesSettings();
        categoryAxesSettings.axisHeight = 40;
        chart.categoryAxesSettings  = categoryAxesSettings;

        // PERIOD SELECTOR ///////////////////////////////////
        var periodSelector = new AmCharts.PeriodSelector();
        periodSelector.position = "top";
        periodSelector.periods = [{
            period: "DD",
            count: 10,
            label: "10 days"},
        {
            period: "MM",
            count: 1,
            selected: true,
            label: "1 month"},
        {
            period: "YYYY",
            count: 1,
            label: "1 year"},
        {
            period: "YTD",
            label: "YTD"},
        {
            period: "MAX",
            label: "MAX"}];

        chart.periodSelector = periodSelector;

        angular.forEach($scope.eventsguides, function(value, key){
             stockPanel1.categoryAxis.addGuide(value);
             stockPanel2.categoryAxis.addGuide(value);
             stockPanel3.categoryAxis.addGuide(value);
        });

        // Datepicker
        chart.addListener('rendered', function (event) {
            var dataProvider = chart.dataSets[0].dataProvider,
                amchartsStartDate = $('#chartdiv-views .amcharts-start-date-input'),
                amchartsEndDate = $('#chartdiv-views .amcharts-end-date-input');
                
            amchartsStartDate.datepicker({
                format: 'dd-mm-yyyy',
                autoclose: true
            }).on('changeDate', function(e){
                amchartsStartDate.trigger('blur');
            });

            amchartsEndDate.datepicker({
                format: 'dd-mm-yyyy',
                autoclose: true
            }).on('changeDate', function(e){
                amchartsEndDate.trigger('blur');
            });
        });

        // Export chart ///////////
        chart.export = AmCharts.exportCFG;

        chart.write('chartdiv-views');
    }

    // Update dataset after choose video from dropdown
    $scope.$on('update-datasets', function(event, data) {

        var youtubeDataset = data.youtube_views_per_day,
            jwViewsDataset = data.jw_views_dataset;

        var newDataset = multipleViewsDatasets(youtubeDataset, jwViewsDataset);

        chart.dataSets[0].dataProvider = newDataset; 
        chart.validateData();
        
    });

    // reset values to All 
    $scope.$on('reset-datasets', function(){
        
        chart.dataSets[0].dataProvider = stockdataset; 
        chart.validateData();
    });
  
}]).

/**
 * Controller: EngagementJwAnalyticsController
 * ENGAGEMENT JW ANALYTICS CONTROLLER
 * 
 */
controller('EngagementJwAnalyticsController', ['$rootScope', '$scope', '$http', '$timeout', function($rootScope, $scope, $http, $timeout) {
    'use strict';

    var dataset = [{position: "0", views: "0"}]

    var chart;
    AmCharts.ready(function() {
        createStockChart();
    });

    function createStockChart() {
        chart = new AmCharts.AmStockChart();
        chart.pathToImages = "../js/libs/amstockchart/amcharts/images/";

        // DATASETS //////////////////////////////////////////
        var dataSet = new AmCharts.DataSet();
        dataSet.color = "#b0de09";
        dataSet.fieldMappings = [{
                fromField: "views",
                toField: "views"
        }];
        dataSet.dataProvider = dataset;
        dataSet.categoryField = "position";
        chart.showCategoryAxis = true;

        // set data sets to the chart
        chart.dataSets = [dataSet];

        // PANELS ///////////////////////////////////////////                                                  
        // first stock panel
        var stockPanel1 = new AmCharts.StockPanel();
        stockPanel1.showCategoryAxis = true;
        stockPanel1.categoryAxis.axisColor = "#DADADA";
        stockPanel1.title = "Thunderboom Views";
        stockPanel1.valueAxes = [{
            axisAlpha: 0,
            stackType: "regular",
            gridAlpha: 0.1
        }];

        // graph of first stock panel
        var graph1 = new AmCharts.StockGraph();
        graph1.valueField = "views";
        graph1.lineAlpha = 1;
        graph1.fillAlphas = 0.5;
        graph1.useDataSetColors = false;
        graph1.lineColor = "#FD8C3A";
        graph1.title = "Thunderboom views";
        graph1.fillColors = "#FD8C3A";
        graph1.balloonText = "<span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>";

        stockPanel1.addStockGraph(graph1);

        // create stock legend                
        var stockLegend1 = new AmCharts.StockLegend();
        stockLegend1.position = "bottom";
        stockLegend1.valueAlign = "left";
        stockLegend1.periodValueText = "total: [[value.sum]]";
        stockLegend1.valueWidth = 100;
        stockLegend1.color = "#999999";
        stockPanel1.stockLegend = stockLegend1;

        // set panels to the chart
        chart.panels = [stockPanel1];

        // Export chart ///////////
        chart.export = AmCharts.exportCFG;

        chart.write('chartdiv-jwviews');
    }

    $scope.$on('update-datasets', function(event, data) {
        var dataset = data.jwplatform_engagement_dataset.video.engagements;
        chart.dataSets[0].dataProvider = dataset;
        chart.validateData();
    });

    // reset values to All 
    $scope.$on('reset-datasets', function(){
        chart.dataSets[0].dataProvider = dataset;
        chart.validateData();
    });

}]).

/**
 * Controller: HeatMapController
 * HEAT MAP CONTROLLER
 * 
 */
controller('HeatMapController', ['$rootScope', '$scope', '$http', '$timeout', function($rootScope, $scope, $http, $timeout) {
    'use strict';

    // Adding 500 Data Points
    var map, pointarray, heatmap;

    var data = [
        new google.maps.LatLng(51.508742, -0.131836),
        new google.maps.LatLng(52.988337, -8.349609),
        new google.maps.LatLng(55.973798, -3.164062),
        new google.maps.LatLng(52.536273, -1.845703),
        new google.maps.LatLng(53.813626, -1.538086),
        new google.maps.LatLng(55.591135, -4.557859),
        new google.maps.LatLng(51.367456, -0.35705),
        new google.maps.LatLng(51.495065, 0),
        new google.maps.LatLng(51.467697, -0.197754),
        new google.maps.LatLng(51.454007, -0.98877),
        new google.maps.LatLng(51.51558,  -0.197754),
        new google.maps.LatLng(50.833698, -0.142822),
        new google.maps.LatLng(50.826758, -0.098877),
        new google.maps.LatLng(51.401798, -0.254786),
        new google.maps.LatLng(51.376935, -0.246493),
        new google.maps.LatLng(51.390594, -0.284785),
        new google.maps.LatLng(51.386646, -0.302252),
        new google.maps.LatLng(51.391824, -0.320101),
        new google.maps.LatLng(51.400236, -0.354739),
        new google.maps.LatLng(51.355793, -0.30435),
        new google.maps.LatLng(58.516048, -3.243888),
        new google.maps.LatLng(51.507351, -0.127758),
        new google.maps.LatLng(51.498664, -0.377369),
        new google.maps.LatLng(51.501096, -0.425323),
        new google.maps.LatLng(51.521502, -0.411092),
        new google.maps.LatLng(51.543349, -0.378766),
        new google.maps.LatLng(51.538147, -0.338734),
        new google.maps.LatLng(51.507421, -0.473156),
        new google.maps.LatLng(51.544162, -0.481698),
        new google.maps.LatLng(51.577804, -0.484545),
        new google.maps.LatLng(51.513606, -0.149799),
        new google.maps.LatLng(51.516007, -0.10643),
        new google.maps.LatLng(51.516834, -2.629762),
        new google.maps.LatLng(51.497, -2.675),
        new google.maps.LatLng(51.412, -2.611),
        new google.maps.LatLng(51.413, -2.561),
        new google.maps.LatLng(53.570202, -0.624399),
        new google.maps.LatLng(53.572, -0.701),
        new google.maps.LatLng(53.68, -0.446),
        new google.maps.LatLng(53.684, -0.359),
        new google.maps.LatLng(53.534107, -1.102256),
        new google.maps.LatLng(53.558, -0.505),
        new google.maps.LatLng(53.416449, -0.645818),
        new google.maps.LatLng(53.323, -0.927),
        new google.maps.LatLng(53.540041, -1.060731),
        new google.maps.LatLng(53.575009, -0.094131),
        new google.maps.LatLng(55.911, -2.942),
        new google.maps.LatLng(55.856, -2.851),
        new google.maps.LatLng(55.862, -2.96),
        new google.maps.LatLng(55.786, -2.96),
        new google.maps.LatLng(53.357109, -6.262207),
        new google.maps.LatLng(53.357109, -6.262207),
        new google.maps.LatLng(53.480759, -2.242631)

        
    ];

    function initialize() {
        var mapOptions = {
            zoom: 8,
            center: new google.maps.LatLng(51.507351, -0.127758),
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };

        map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);

        var pointArray = new google.maps.MVCArray(data);

        heatmap = new google.maps.visualization.HeatmapLayer({
            data: pointArray
        });

        heatmap.setMap(map);
    }

    google.maps.event.addDomListener(window, 'load', initialize);

}]).

/**
 * Controller: AdminTabsController
 * ADMIN TABS VIEW CONTROLLER
 */
controller('AdminTabsController', ['$rootScope', '$scope', '$http', '$timeout', function($rootScope, $scope, $http, $timeout) {
    'use strict';

    $scope.tabs = [
        { title:'Organisations', content:'Dynamic content 1'},
        { title:'Notifications', content:'Dynamic content 2'}
    ];

}]).

/**
 * Controller: AdminNotificationsController
 * ADMIN NOTIFICATIONS CONTROLLER
 */
controller('AdminNotificationsController', ['$rootScope', '$scope', '$http', '$timeout', function($rootScope, $scope, $http, $timeout) {
    'use strict';

    $scope.notificationsTable = [];
    $http({
        url: '/notifications',
        method: 'GET',
        dataType: 'JSON'
    }).success(function(data, status, headers, config) {

        angular.forEach(data, function(value, key) {

            $scope.notificationsTable.push(
                {   id: value.id, 
                    type: value.type,
                    title: value.title,
                    url: value.url,
                    target: value.target,
                    organisation: [],
                    starts_at: value.start_date,
                    ends_at: value.end_date,
                    message: value.message
                }
            );
        });

    }).error(function(data, status, headers, config) {

    });

    $scope.editNotificationBtn = function(n, index){

        $scope.initNotification = false;
        $scope.$editNotification = true;
        $scope.editID = n.id;
        $scope.title = n.title;
        $scope.message = n.message;
        $scope.link = n.url;
        $scope.notificationDates = [
            {
                starts_at: new Date(n.starts_at),
                ends_at: new Date(n.ends_at)
            }
        ];
        $scope.selectedTypeName = n.type;
        $scope.selectedTargetName = n.target;

    };
 
    $scope.deleteNotificationBtn = function(n, index) {

        $http({
            url: '/notifications/delete',
            method: 'POST',
            dataType: 'JSON',
            data: {
                id: $scope.id
            }
        }).success(function(data, status, headers, config) {

            $scope.notificationsTable.splice(index, 1);

            if (data.code == 200){
                $rootScope.alertSuccess.html(data.msg).fadeIn();
            }else if( data.code == 400 ){
                $rootScope.alertDanger.html(data.msg).fadeIn();
            }
            setTimeout(function (){
                $rootScope.alert.fadeOut();
            }, 3000);

        }).error(function(data, status, headers, config) {

        });
    };

    $scope.targets = [
        { id: 1, name: 'Global'},
        { id: 2, name: 'Organisation'},
        { id: 3, name: 'Service'}
    ];

    $scope.selectedTarget = $scope.targets[0];
    $scope.selectedTargetValue = 1;
    $scope.selectedTargetName = $scope.targets[0].name;

    $scope.setTarget = function(a) {
        $scope.selectedTarget = a;
        $scope.selectedTargetValue = $scope.selectedTarget.id;
        $scope.selectedTargetName = $scope.selectedTarget.name;
    };

    $scope.types = [
        { id: 1, name: 'Info' },
        { id: 2, name: 'Action' }
    ];

    $scope.selectedType = $scope.types[0];
    $scope.selectedTypeValue = 1;
    $scope.selectedTypeName = $scope.types[0].name;

    $scope.setType = function(a) {
        $scope.selectedType = a;
        $scope.selectedTypeValue = $scope.selectedType.id;
        $scope.selectedTypeName = $scope.selectedType.name;
    };

    $scope.inputOrganisations = [ 
        { id: 1, name: 'myOrg' },
        { id: 2, name: 'save-the-children' },
        { id: 3, name: 'save-the-monkey' },
        { id: 4, name: 'feel-free' },
        { id: 5, name: 'batman' }
    ];     


    var currentYear = moment().year();
    var currentMonth = moment().month();
    var currentDay = moment().day();

    var today = moment();
    var tomorrow = moment(today).add(1, 'days');

    $scope.notificationDates = [
        {
            starts_at: new Date(today),
            ends_at: new Date(tomorrow)
        }
    ];

    $scope.toggle = function($event, field, date) {
        $event.preventDefault();
        $event.stopPropagation();

        date[field] = !date[field];
    };

    $scope.updateNotification = function() {
        return true;
    };

    $scope.fSelectNone = function() {
        $scope.selectedOrganisationID = 0;
    };

    $scope.fReset = function() {
        $scope.selectedOrganisationID = 0;
    };   

    $scope.selectedOrganisationID = 0;       

    // Form submit handler.
    $scope.submit = function(form, date) {
        // Trigger validation flag.
        $scope.submitted = true;

        if (form.$invalid) {
            return;
        }

        angular.forEach( $scope.outputOrganisations, function( value, key ) {    
            /* do your stuff here */  
            $scope.selectedOrganisationID = value.id;

        });

        var inputDataCreate = {
            title: $scope.title,
            message: $scope.message,
            url: $scope.link,
            starts_at: date.starts_at,
            ends_at: date.ends_at,
            org_id: $scope.selectedOrganisationID,
            target: $scope.selectedTargetName,
            type: $scope.selectedTypeName 
        };

        var inputDataUpdate = {
            title: $scope.title,
            message: $scope.message,
            url: $scope.link,
            starts_at: date.starts_at,
            ends_at: date.ends_at,
            org_id: $scope.selectedOrganisationID,
            id: $scope.resourceID,
            target: $scope.selectedTargetName,
            type: $scope.selectedTypeName 
        };

        if (angular.isUndefined($scope.resourceID) && angular.isUndefined($scope.editID)) {
            $http({
                url: '/notifications/create',
                method: 'POST',
                dataType: 'JSON',
                data: inputDataCreate
            }).success(function(data, status, headers, config) {

                if (data.code == 200){

                    //get resource id after success
                    $scope.resourceID = data.resource_id;

                    //push in table the new event
                    $scope.notificationsTable.push({
                        id: data.resource_id,
                        title: $scope.title,
                        message: $scope.message,
                        url: $scope.link,
                        starts_at: date.starts_at,
                        ends_at: date.ends_at,
                        org_id: $scope.selectedOrganisationID,
                        target: $scope.selectedTargetName,
                        type: $scope.selectedTypeName 
                    });

                    $rootScope.alertSuccess.html(data.message).fadeIn();
                }else if( data.code == 400){
                    $rootScope.alertSuccess.html(data.message).fadeIn();
                }
                else if( data.code == 401){
                    $rootScope.alertSuccess.html(data.message).fadeIn();
                }
                else if( data.code == 402){
                    $rootScope.alertSuccess.html(data.message).fadeIn();
                }
                else if( data.code == 404){
                    $rootScope.alertSuccess.html(data.message).fadeIn();
                }
                else{
                    $rootScope.alertSuccess.html(data.message).fadeIn();
                }

            }).error(function(data, status, headers, config) {

            }).finally(function() {
                // Hide status messages after three seconds.
                $timeout(function() {
                    $rootScope.alert.fadeOut();
                }, 3000);
            });

        }else{
            $http({
                url: '/notifications/update',
                method: 'POST',
                dataType: 'JSON',
                data: inputDataUpdate
            }).success(function(data, status, headers, config) {

                if (data.code == 201){

                    // $scope.notificationsTable.push({
                    //     id: data.resource_id,
                    //     title: $scope.title,
                    //     message: $scope.message,
                    //     url: $scope.link,
                    //     starts_at: date.starts_at,
                    //     ends_at: date.ends_at,
                    //     org_id: $scope.selectedOrganisationID,
                    //     target: $scope.selectedTargetName,
                    //     type: $scope.selectedTypeName 
                    // });

                    $rootScope.alertSuccess.html(data.message).fadeIn();
                }else if( data.code == 400){
                    $rootScope.alertSuccess.html(data.message).fadeIn();
                }
                else if( data.code == 401){
                    $rootScope.alertSuccess.html(data.message).fadeIn();
                }
                else if( data.code == 402){
                    $rootScope.alertSuccess.html(data.message).fadeIn();
                }
                else if( data.code == 404){
                    $rootScope.alertSuccess.html(data.message).fadeIn();
                }
                else{
                    $rootScope.alertSuccess.html(data.message).fadeIn();
                }

            }).error(function(data, status, headers, config) {

            }).finally(function() {
                // Hide status messages after three seconds.
                $timeout(function() {
                    $rootScope.alert.fadeOut();
                }, 3000);
            });
        }
    };

}]).

/**
 * Controller: CountryMapController
 * COUNTRY MAP CONTROLLER
 * 
 */
controller('CountryMapController', ['$rootScope', '$scope', '$http', '$timeout', function($rootScope, $scope, $http, $timeout) {
    'use strict';

    // add all your code to this method, as this will ensure that page is loaded
    AmCharts.ready(function() {
        // create AmMap object
        var map = new AmCharts.AmMap();
        // set path to images
        map.pathToImages = "../js/libs/ammap/images/";
        map.colorSteps = 10;

        /* create data provider object
         map property is usually the same as the name of the map file.

         getAreasFromMap indicates that amMap should read all the areas available
         in the map data and treat them as they are included in your data provider.
         in case you don't set it to true, all the areas except listed in data
         provider will be treated as unlisted.
        */

        // Get geolocation analytics from youtube to use in map
        // var dataset_map = {$yt_views_geo_dataset|json_encode};
        // Get geolocation analytics from youtube to use in map
        //var dataset_map = [{"id":"DE","value":"27"},{"id":"US","value":"30"},{"id":"GR","value":"35"},{"id":"FR","value":"52"},{"id":"dump","value":"0"}];

        var dataset_map = window.youtube_geoAll_dataset;

        var dataProvider = {
            map: "worldLow",
            getAreasFromMap:true,
            areas: dataset_map
        }; 
        // pass data provider to the map object
        map.dataProvider = dataProvider;

        /* create areas settings
         * autoZoom set to true means that the map will zoom-in when clicked on the area
         * selectedColor indicates color of the clicked area.
         */
        map.areasSettings = {
            alpha: 0.8,
            autoZoom: false,
            color : "#f6f6f6",   
            colorSolid : "#095faf",
            outlineColor : "#999999",
            rollOverColor : "#005aad",
            rollOverOutlineColor : "#ffffff",
            balloonText: "[[value]] views in [[title]]"
        };
        map.zoomControl = {
            buttonFillColor : "#A1A1A1",
            buttonRollOverColor : "#A1A1A1",
            zoomControlEnabled: true
        }

        map.valueLegend = {
            right: 10,
            minValue: "Least",
            maxValue: "Most"
        };

        // let's say we want a small map to be displayed, so let's create it
        // map.smallMap = new AmCharts.SmallMap();

        // write the map to container div
        map.write("mapdiv");

        return $scope.map = map;

    });

    $scope.$on('update-datasets', function(event, data) {

        var dataProvider = {
            map: "worldLow",
            getAreasFromMap: true,
            areas: data.youtube_views_geo_per_day
        }; 

        $scope.map.dataProvider = dataProvider;
        $scope.map.validateData();
    });

    // reset values to All 
    $scope.$on('reset-datasets', function(){

        var dataset_map = window.youtube_geoAll_dataset;
        var dataProvider = {
            map: "worldLow",
            getAreasFromMap:true,
            areas: dataset_map
        }; 
        $scope.map.dataProvider = dataProvider;
        $scope.map.validateData();
    });

}]).

/**
 * Controller: VideoUploadController
 * ARCHIVE VIDEO UPLOAD CONTROLLER
 */
controller('VideoUploadController', ['$rootScope', '$scope', '$http', '$timeout', '$upload', function($rootScope, $scope, $http, $timeout, $upload) {
    'use strict';

    var uploadVideoForm = $('#upload-video-form'),
        redirect = uploadVideoForm.data('redirect'),
        key = uploadVideoForm.data('key'),
        token = uploadVideoForm.data('token');

    $scope.progressPercentage = 0;

    $scope.upload = function (files) {
        if (files && files.length) {
            var file = files[0];
            $scope.uploadVideoBtn = true;

            $upload.upload({
                url: 'http://upload.jwplatform.com/v1/videos/upload',
                fields : {
                    api_format: 'json',
                    key: key,
                    token: token
                },
                file: file
            }).progress(function (evt) {
                $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);

            }).success(function (data, status, headers, config) {
                $scope.uploadVideoBtn = false;

                window.location = redirect + '?video_key=' + data.media.key;
            });
        }
    };

}]).

/**
 * Controller: TrendingController
 * TRENDING CONTROLLER
 */
controller('TrendingController', ['$rootScope', '$scope', '$http', '$timeout', function($rootScope, $scope, $http, $timeout) {
    'use strict';

    $scope.parseTweet = function(text){
        var patterns = {
            link: /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,
            user: /(^|\s)@(\w+)/g,
            hash: /(^|\s)#(\w+)/g
        };
        return text
            .replace(patterns.link, '<a href="$1" target="_blank">$1</a>')
            .replace(patterns.user, '$1@<a href="http://www.twitter.com/$2" target="_blank">$2</a>')
            .replace(patterns.hash, '$1#<a href="http://search.twitter.com/search?q=%23$2" target="_blank">$2</a>');
    }

}]).

/**
 * Controller: StreamController
 * STREAM CONTROLLER
 */
controller('StreamController', ['$rootScope', '$scope', '$http', '$timeout', function($rootScope, $scope, $http, $timeout) {
    'use strict';

    $scope.preloader = true;
    $scope.tweets = [];

    if ($rootScope.twitterAccess){
        $http({
            url: '/trending/stream',
            method: 'GET',
            dataType: 'JSON',
        }).success(function(data, status, headers, config) {
            $scope.preloader = false;

            angular.forEach(data.tweets, function(value, key){
                $scope.tweets.push({
                    screen_name: value.screen_name,
                    profile_image_url: value.profile_image_url,
                    text: $scope.parseTweet(value.text),
                    id: value.id
                });
            });

            $scope.nextResults = data.search_metadata.next_results;
            $scope.loadMore = true;

        }).error(function(data, status, headers, config) {

        }).finally(function(){

        });
    }

    $scope.loadMoreTwits = function(){
        $scope.preloaderLoadMore = true;
        $http({
            url: '/trending/stream' + $scope.nextResults,
            method: 'GET',
            dataType: 'JSON',
        }).success(function(data, status, headers, config) {

            $scope.nextResults = data.search_metadata.next_results;
            $scope.preloaderLoadMore = false;

            angular.forEach(data.tweets, function(value, key){

                $scope.tweets.push({
                    screen_name: value.screen_name,
                    profile_image_url: value.profile_image_url,
                    text: $scope.parseTweet(value.text),
                    id: value.id
                });
            });

            $scope.tweets.shift();

        }).error(function(data, status, headers, config) {

        }).finally(function(){

        });
    }

}]).

/**
 * Controller: TrendsController
 * STREAM CONTROLLER
 */
controller('TrendsController', ['$rootScope', '$scope', '$http', '$timeout', function($rootScope, $scope, $http, $timeout) {
    'use strict';

    $scope.preloader = true;
    $scope.tweets = [];

    if ($rootScope.twitterAccess){
        $http({
            url: '/trending/trends',
            method: 'GET',
            dataType: 'JSON',
        }).success(function(data, status, headers, config) {
            $scope.preloader = false;

            $scope.trends = data;

        }).error(function(data, status, headers, config) {

        }).finally(function(){

        });
    }

}]).

/**
 * Controller: MentionsController
 * MENTIONS CONTROLLER
 */
controller('MentionsController', ['$rootScope', '$scope', '$http', '$timeout', function($rootScope, $scope, $http, $timeout) {
    'use strict';

    $scope.preloader = true;
    $scope.mentionsData = [];

    if ($rootScope.twitterAccess){
        $http({
            url: '/trending/mentions_timeline',
            method: 'GET',
            dataType: 'JSON',
        }).success(function(data, status, headers, config) {
            $scope.preloader = false;

            angular.forEach(data.tweets, function(value, key){
                $scope.mentionsData.push({
                    screen_name: value.screen_name,
                    profile_image_url: value.profile_image_url,
                    text: $scope.parseTweet(value.text),
                    id: value.id
                });
            });

            $scope.nextResults = data.search_metadata.next_results;

        }).error(function(data, status, headers, config) {

        }).finally(function(){

        });
    }

    $scope.loadMoreTwits = function(){
        $scope.preloaderLoadMore = true;
        $http({
            url: '/trending/mentions_timeline' + $scope.nextResults,
            method: 'GET',
            dataType: 'JSON',
        }).success(function(data, status, headers, config) {

            $scope.nextResults = data.search_metadata.next_results;
            $scope.preloaderLoadMore = false;

            angular.forEach(data.tweets, function(value, key){
                $scope.mentionsData.push({
                    screen_name: value.screen_name,
                    profile_image_url: value.profile_image_url,
                    text: $scope.parseTweet(value.text),
                    id: value.id
                });
            });

            $scope.mentionsData.shift();

        }).error(function(data, status, headers, config) {

        }).finally(function(){

        });
    }
}]).

/**
 * Controller: HashtagController
 * HASHTAG CONTROLLER
 */
controller('HashtagController', ['$rootScope', '$scope', '$http', '$timeout', function($rootScope, $scope, $http, $timeout) {
    'use strict';

    $scope.getResults = false;

    $scope.searchHashTags = function(){
        $scope.preloader = true;
        $scope.getResults = false;

        $scope.searchHashTagNew = $scope.searchHashTag.replace('#', '');

        $http({
            url: '/trending/search_hashtags?q=' + $scope.searchHashTagNew + '&count=20',
            method: 'GET'
        }).success(function(data, status, headers, config) {
            $scope.preloader = false;
            $scope.getResults = true;

            $scope.hashTags = [];

            angular.forEach(data.tweets, function(value, key){

                $scope.hashTags.push({
                    screen_name: value.screen_name,
                    profile_image_url: value.profile_image_url,
                    text: $scope.parseTweet(value.text),
                    id: value.id
                });
            });

            $scope.nextResults = data.search_metadata.next_results;

        }).error(function(data, status, headers, config) {

        }).finally(function(){

        });

        $scope.loadMoreTwits = function(){
            $scope.preloaderLoadMore = true;
            $http({
                url: '/trending/search_hashtags' + $scope.nextResults,
                method: 'GET',
                dataType: 'JSON',
            }).success(function(data, status, headers, config) {

                $scope.nextResults = data.search_metadata.next_results;
                $scope.preloaderLoadMore = false;

                angular.forEach(data.tweets, function(value, key){

                    $scope.hashTags.push({
                        screen_name: value.screen_name,
                        profile_image_url: value.profile_image_url,
                        text: $scope.parseTweet(value.text),
                        id: value.id
                    });

                });

                $scope.hashTags.shift();

            }).error(function(data, status, headers, config) {

            }).finally(function(){

            });
        }
    }
}]).

/**
 * Controller: VideoUploadController
 * ARCHIVE VIDEO UPLOAD CONTROLLER
 */
controller('MenuController', ['$rootScope', '$scope', '$http', '$timeout', '$upload', function($rootScope, $scope, $http, $timeout, $upload) {
    'use strict';

    $scope.pushBody = function(){
        $('.container-outer').toggleClass('cbp-spmenu-push-toright');
    }

}]).

/**
 * Controller: TwitterMsgController
 * TWITTER CONTROLLER
 */
controller('TwitterMsgController', ['$rootScope', '$scope', '$http', '$timeout', function($rootScope, $scope, $http, $timeout) {
    'use strict';

    $scope.preloader = true;
 
}]).

/**
 * Controller: NotificationsController
 * NOTIFICATIONS CONTROLLER
 */
controller('NotificationsController', ['$rootScope', '$scope', '$http', '$timeout', function($rootScope, $scope, $http, $timeout) {
    'use strict';

    $scope.notifications = window.notifications;

}]);






