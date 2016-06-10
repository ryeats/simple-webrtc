var signalhub = require('signalhub');
var swarm = require('webrtc-swarm');

// var sw = swarm(signalhub('swarm-example', 'https://signalhub.mafintosh.com'));
var sw = swarm(signalhub('swarm-example', 'http://localhost:9000'));

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

console.log('peers:'+sw.peers);
window.sw=sw;
setInterval(function () {
    window.sw.peers.forEach(function (peer) {
        peer.write('some data');
    })

}, 10000);