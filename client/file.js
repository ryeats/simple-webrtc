// require('./file-dep');
// console.log('file.js');

// var swarm = require('webrtc-swarm');
// var signalhub = require('signalhub');
// // var wrtc = require('wrtc');
//
// var hub = signalhub('swarm-example', ['http://localhost:3000']);
//
// var sw = swarm(hub, {
//     // wrtc: wrtc // you don't need this if you use it in the browser
// });
//
// sw.on('peer', function (peer, id) {
//     console.log('connected to a new peer:', id)
//     console.log('total peers:', sw.peers.length)
// });


var signalhub = require('signalhub');
var swarm = require('webrtc-swarm');

var sw = swarm(signalhub('swarm-example', 'https://signalhub.mafintosh.com'));

sw.on('peer', function (peer, id) {
    console.log('new peer joined:', id);
    peer.on('data', function (c) {
        console.log('got data', c)
    });
    peer.write('hello')
});

sw.on('disconnect', function (peer, id) {
    console.log('DISCONNECT', id)
});

console.log('peers:'+sw.peers);
window.sw=sw;