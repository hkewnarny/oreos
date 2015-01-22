var app = angular.module('oreosApp', ['ui.bootstrap']);

app.controller('MainCtrl', function($scope) {
});

app.directive('oreoDirective', function($compile, $sce, $filter, YouTubeService, PlaylistService) {
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
      
      $scope.model.playList = [];
      $scope.model.playlistFiler = {
          playlist: 'playlistTitle1'
      };

      $scope.model.availablePlaylist = [{
          playlistName: 'playlistTitle1'
      }, {
          playlistName: 'playListTitle2'
      }, {
          playlistName: 'playlistTitle3'
      }];


      $scope.selectPlaylist = function(playlist) {
          $scope.model.selectedPlaylist = playlist;
          $scope.model.playlistFiler = {
              playlist: playlist
          };

          var songs = $filter('filter')($scope.model.playList, $scope.model.playlistFiler);
          if (songs[0]) {
              $scope.selectSong(songs[0].videoId);
          }
      };

//        $scope.selectPlaylist($scope.model.availablePlaylist[0].playlistName);

      var socket = io();

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

        PlaylistService.findAll().then(function(videos){
            $scope.model.playList = videos;
            $scope.selectPlaylist($scope.model.availablePlaylist[0].playlistName);
        }, function(error) {
            console.log('error');
            console.log(error);
        });

      $scope.sendAudioCommand = function(func, args) {
        $('#youtube-player')[0].contentWindow.postMessage(JSON.stringify({
          'event': 'command',
           'func': func,
          'args': args || []
        }), "*");

        switch(func) {
          case 'playVideo':
            socket.emit('playSong', "foo");
            break;
          case 'pauseVideo':
            socket.emit('pauseSong', "foo");
            break;
        }

      };

        $scope.selectSong = function(videoId) {
            $scope.videoId = videoId;
        };

        $scope.deleteSong = function(id) {
          PlaylistService.remove({id:id}).then(function(successResponse) {
            console.log("deleted: ")
            console.log(successResponse);

            PlaylistService.findAll().then(function(videos){
                $scope.model.playList = videos;

                console.log('$scope.model.playList');
                console.log($scope.model.playList);
            }, function(error) {
              console.log('error');
              console.log(error);
            });

          }, function(error) {
            console.log('error on remove');
          });
        };

      $scope.addToPlaylist = function(uploader, videoTitle, videoId) {
        var data = {
          title: videoTitle,
          uploader: uploader,
          videoId: videoId,
          playlist: $scope.model.selectedPlaylist
        }

        PlaylistService.add(data).then(function(successResponse) {

          console.log(successResponse.video);

          PlaylistService.findAll().then(function(videos){
              $scope.model.playList = videos;

              console.log('$scope.model.playList');
              console.log($scope.model.playList);
          }, function(error) {
            console.log('error');
            console.log(error);
          });

        }, function(error) {
          console.log('error on add');
        });
      };

      var doAudioCommand = function(func) {
        $('#youtube-player')[0].contentWindow.postMessage(JSON.stringify({
          'event': 'command',
           'func': func,
           'args': []
        }), "*");
      };

      // Client socket listeners
      socket.on('pauseSong', function(data) {
        doAudioCommand('pauseVideo');
      });

      socket.on('playSong', function(data) {
        doAudioCommand('playVideo');
      });

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
    add: function(song) {
      var defer = $q.defer();
      $http.post("/songs", song).
        success(function(data) {
          defer.resolve(data);
        }).error(function(err) {
          console.log("error:");
          console.log(err);
        });
      return defer.promise;
    },
    remove: function(id) {
      var defer = $q.defer();
      $http.post("/remove", id).
        success(function(data) {
          console.log("removed success: ");
          console.log(data);
          defer.resolve(data);
        }).error(function(err) {
          console.log("error:");
          console.log(err);
        });
      return defer.promise;
    },
    findAll: function() {
      var defer = $q.defer();
      $http.get("/songs").
        success(function(data){
          defer.resolve(data);
        }).error(function(data){
          console.log("error " + data);
        });
      return defer.promise;
    }
  };
});
