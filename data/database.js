var Datastore = require('nedb');

module.exports = {
  playlist: new Datastore({ filename: 'playlists', autoload: true }),
  song:    new Datastore({ filename: 'songs', autoload: true })
}