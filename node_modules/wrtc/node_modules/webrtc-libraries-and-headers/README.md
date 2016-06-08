webrtc-libraries-and-headers
============================

This project packages [WebRTC](https://webrtc.org/native-code) libraries and
headers.

Install
-------

To install WebRTC libraries and headers from [branch-heads/50](https://chromium.googlesource.com/external/webrtc/+/branch-heads/50), run

```
npm install --save webrtc-libraries-and-headers@0.50.0-49f7bd3
```

**Binaries unavailable?** If binaries are unavailable for your particular
combination of platform and architecture, you can fallback to building from
source using [build-webrtc](https://github.com/markandrus/build-webrtc). Just
set the environment variable `BUILD_WEBRTC=1`. See
[the build-webrtc documentation](https://github.com/markandrus/build-webrtc/blob/master/docs/README.md)
for more information.

Usage
-----

Assuming install succeeds, you will have a lib directory containing WebRTC
libraries and an include directory containing WebRTC headers. If you want to
build a [Node Addon](https://nodejs.org/api/addons.html) or some other project
that depends on WebRTC, set your linker and compiler flags accordingly.

Versioning
----------

WebRTC doesn't follow [SemVer](http://semver.org), and I'm not sure they have
any API guarantees, even within branch heads. Because of this, we use the
following versioning scheme for tracking WebRTC:

```
0.$MAJOR.$PATCH-$COMMIT
```

`MAJOR` is the WebRTC branch head. `COMMIT` is the WebRTC commit.
