var app = angular.module('oerosApp', ['ui.bootstrap']);

app.controller('MainCtrl', function($scope) {
});

app.directive('oreoDirective', function($compile, $sce, YouTubeService, PlaylistService) {
  return {
    restrict: 'A', //attribute or element
    scope: {
    },
    templateUrl: 'oreo.html',
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

      console.log("testing dbservice");

      var sampleData = {
        title: "Taylor",
        uploader: "vevo",
        videoId: "123"
      }

      PlaylistService.add(sampleData).then(function() {
        PlaylistService.findAll().then(function(videos){
          console.log(videos);
        }, function(error) {
          console.log('error');
          console.log(error);
        })
      });


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

app.service('PlaylistService', function($q, $http) {
  return {
    add: function(video) {
      var defer = $q.defer();
      $http.post("/videos", video).
        success(function(id) {
          defer.resolve(id);
        }).error(function(id) {
          console.log("error" + id);
        });
      return defer.promise;
    },
    findAll: function() {
      var defer = $q.defer();
      $http.get("/videos").
        success(function(data){
          defer.resolve(data);
        }).error(function(data){
          console.log("error " + data);
        });
      return defer.promise;
    }
  };
});
