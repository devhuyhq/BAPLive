# baplive


## Info
This library used for live stream (NodeJS)

## Add it to your project

Run `npm install --save baplive`


## Usage

```javascript
const express = require('express');
const app = express();
const server = require('http').Server(app);
const BAPLive = require('baplive');

const io = require('socket.io').listen(server, {pingTimeout: 30000});
BAPLive.default.init('mongodb://localhost:27017/baplivedemo', io);

/>
```