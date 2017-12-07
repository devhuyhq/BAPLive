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
```

## Config

```javascript
BAPLive.default.init(
    databaseUrl, //mongodb database url, eg: mongodb://localhost:27017/baplivedemo
    io,          //socket.io instance to communicate with client application
    config,      //
    key,         //secret JWT key for authentication
    streamUrl    //stream url for publishing and providing stream, eg: rtmp://172.16.1.0:1935/live
);
```

## [Api Document](./docs/api_docs.md)
