var app = angular.module('oerosApp', ['ui.bootstrap']);

app.controller('MainCtrl', function($scope) {
});

app.directive('oreoDirective', function($compile, $sce, YouTubeService) {
  return {
    restrict: 'A', //attribute or element
    scope: {
    },
    templateUrl: 'oreo.html',
    // template: '',
    replace: true,
    // require: 'ngModel',
    link: function($scope, elem, attr, ctrl) {
      $scope.model = {};
      $scope.model.search = '';
      
      $scope.model.playList = [{
        artist: 'Taylor Swift',
        title: 'Shake It Off',
        description: 'Awesome song',
        url: 'http://www.youtube.com'
      }, {
        artist: 'Ed Sheeran',
        title: 'Thinking Out Loud',
        description: 'Awesome song',
        url: 'http://www.youtube.com'
      }, {
        artist: 'Justin Timberlake',
        title: 'Not A Bad Thing',
        description: 'Awesome song',
        url: 'http://www.youtube.com'
      }, {
        artist: 'Ne-Yo',
        title: 'When You\'re Mad',
        description: 'Awesome song',
        url: 'http://www.youtube.com'
      }, {
        artist: 'Bruno Mars',
        title: 'Uptown Funk',
        description: 'Awesome song',
        url: 'http://www.youtube.com'
      }];

      $scope.model.youtube = {
          stream: {}
      };

      $scope.videoUrl = '';

      $scope.videoId = 'e-ORhEE9VVg';

      $scope.$watch('videoId', function(id) {
        $scope.videoUrl = $sce.trustAsResourceUrl('http://www.youtube.com/embed/'+ id + '?autoplay=1&enablejsapi=1');
      });

      $scope.$watch('model.search', function(searchTerm) {
          YouTubeService.search(searchTerm).then(function(response) {
              $scope.model.youtube.stream = response;
              console.log($scope.model.youtube.stream);
        });
      });

      $scope.sendAudioCommand = function(func, args) {
        $('#youtube-player')[0].contentWindow.postMessage(JSON.stringify({
          'event': 'command',
           'func': func,
          'args': args || []
        }), "*");
      };

      $scope.playFromPlaylist = function(videoId) {
        console.log('playing video');
        $scope.videoId = videoId;
      };

    },
    controller: function($scope, $element, $attrs) {
    }
  };
});


app.service('YouTubeService', function($q) {
    return {
        search: function(searchTerm) {
            var deferred = $q.defer();


            // var q = $('#query').val();
            var request = gapi.client.youtube.search.list({
                key: API_KEY,
                q: searchTerm,
                part: 'snippet'
            });

            request.execute(function(response) {
                deferred.resolve(response);
            });

            return deferred.promise;
        },
        startVideo: function() {},
        pauseVideo: function() {},
        skipVideo: function() {}
    };
});
