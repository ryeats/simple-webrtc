var browserify = require('browserify-middleware');
var express = require('express');
var app = express();

browserify.settings.development('basedir', __dirname);

app.use('/js', browserify(__dirname + '/client/dir'));
app.get('/js/bundle.js', browserify(['webrtc-swarm', 'signalhub']));
app.get('/js/file.js', browserify(__dirname + '/client/file.js'));
// app.get('/js/syntax-error.js', browserify(__dirname + '/client/syntax-error.js'));

app.use(express.static(__dirname + '/static'));

app.get('/ajax', function (req, res) {
  res.end('An AJAX request was made using modules that were made available publicly');
});

app.listen(3000);

var swarm = require('webrtc-swarm');
var signalhub = require('signalhub');
var wrtc = require('wrtc');

var hub = signalhub('swarm-example', ['http://localhost:3000']);

var sw = swarm(hub, {
  wrtc: wrtc // you don't need this if you use it in the browser 
});

sw.on('peer', function (peer, id) {
  console.log('connected to a new peer:', id)
  console.log('total peers:', sw.peers.length)
});
