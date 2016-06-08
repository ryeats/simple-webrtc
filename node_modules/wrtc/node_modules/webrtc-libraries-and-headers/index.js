'us strict';

var download = require('download');
var execSync = require('child_process').execSync;
var path = require('path');
var pkg = require('./package');
var fs = require('fs');
var gunzip = require('gunzip-maybe');
var tar = require('tar-fs');
var url = require('url');

var binary = pkg.binary;
var options = {
  arch: process.env.TARGET_ARCH || process.arch,
  platform: process.env.TARGET_PLATFORM || process.platform,
  version: pkg.version
};

function printf(str, options) {
  return Object.keys(options).reduce(function(str, key) {
    return str.replace(new RegExp('{' + key + '}', 'g'), options[key]);
  }, str);
}

var host = binary.host;
var modulePath = path.resolve(printf(binary.module_path, options));
var packageName = printf(binary.package_name, options);
var remotePath = printf(binary.remote_path, options);

var fullUrl
   = process.env.WEBRTC_LIBRARIES_AND_HEADERS_DOWNLOAD_URL
  || url.resolve(host, remotePath + '/' + encodeURIComponent(packageName));

/**
 * Attempt to download WebRTC libraries and headers. If they're unavailable,
 * fallback to building from source.
 * @returns {Promise}
 */
function downloadOrBuild() {
  if (process.env.SKIP_DOWNLOAD) {
    return build();
  }
  console.log(
    'Attempting to download WebRTC libraries and headers for platform "%s" ' +
    'and architecture "%s" from\n', options.platform, options.arch);
  console.log('  %s\n', fullUrl);
  return new Promise(function(resolve, reject) {
    download(fullUrl)
      .once('error', reject)
      .pipe(gunzip())
      .once('error', reject)
      .pipe(tar.extract('.'))
      .once('error', reject)
      .once('finish', resolve)
  }).then(function() {
    console.log('Complete!');
  }, function(error) {
    if (error.statusCode === 404) {
      if (process.env.BUILD_WEBRTC) {
        console.log('Binaries unavailable! Falling back to building from source.');
        return build();
      }
      console.error(
        'Binaries unavailable! Try building from source by setting ' +
        'BUILD_WEBRTC=1. See ' +
        'https://github.com/markandrus/webrtc-libraries-and-headers for more ' +
        'information.');
    } else {
      console.error(error);
    }
    process.exit(1);
  });
}

/**
 * Attempt to build WebRTC libraries from source.
 * @returns {Promise}
 */
function build() {
  var env = Object.assign({}, process.env);
  env.OUT = modulePath;
  env.WEBRTC_REF = '49f7bd3';
  execSync('npm install build-webrtc', {
    env: env,
    stdio: 'inherit'
  });
}

if (!fs.existsSync('lib') || !fs.existsSync('include')) {
  downloadOrBuild();
}
