var browserify = require('browserify-middleware');
var express = require('express');

var app = express();

browserify.settings.development('basedir', __dirname);

app.get('/js/bundle.js', browserify(['webrtc-swarm', 'signalhub','console-log-div']));
app.get('/js/client.js', browserify(__dirname + '/client/client.js'));

app.use(express.static(__dirname + '/static'));
app.use('/js/console-log-div.js',  express.static(__dirname + '/node_modules/console-log-div/console-log-div.js'))

app.listen(3000);

var signalhubSvr = require('signalhub/server')({
    maxBroadcasts: 0,
        key: null,
        cert: null,
        host: 'localhost'
});

signalhubSvr.on('subscribe', function (channel) {
    console.log('subscribe: %s', channel)
});

signalhubSvr.on('publish', function (channel, message) {
    console.log('broadcast: %s (%d)', channel, message.length)
});

signalhubSvr.listen(9000, 'localhost', function () {
    console.log('signalhub listening on port %d', signalhubSvr.address().port)
});

/*
var swarm = require('webrtc-swarm');
var signalhub = require('signalhub');
//todo this is buggy and blows up on when a new peer connects
var wrtc = require('wrtc');

// var hub = signalhub('swarm-example', ['https://signalhub.mafintosh.com']);
var hub = signalhub('swarm-example', ['http://localhost:9000']);

var sw = swarm(hub, {
  wrtc: wrtc // you don't need this if you use it in the browser
});

sw.on('peer', function (peer, id) {
    console.log('connected to a new peer:', id);
    console.log('total peers:', sw.peers.length);
    peer.on('data', function (c) {
        console.log('got data:', c);
    });
});

sw.on('disconnect', function (peer, id) {
    console.log('disconnected from a peer:', id);
    console.log('total peers:', sw.peers.length);
});
 */