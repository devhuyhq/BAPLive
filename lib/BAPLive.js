import {MongoClient} from 'mongodb';

import {userSchema} from "./schema/UserSchema";
import {roomSchema} from "./schema/RoomSchema";
import {messageSchema} from "./schema/MessageSchema";
import {likeSchema} from "./schema/LikeSchema";

let databaseUrl = null;
let database = null;
let io = null;
let jwtKey = null;
let config = {
    userSchema,
    roomSchema,
    messageSchema,
    likeSchema
};



const init = (url, sio, cf, key) => {
    MongoClient.connect(url, (err, db) => {
        database = db;
    });
    jwtKey = key;
    databaseUrl = url;

    if (cf) {
        config = cf;
    }

    if (sio) {
        io = sio;

        io.on('connection', function (socket) {
            socket.on('create-room', (data) => {
                const {name} = data;
            });
            socket.on('leave-room', (data) => {
            });
            socket.on('join-room', (data) => {
            });
            socket.on('list-user', (data) => {
            });
            socket.on('like-room', (data) => {
            });
            socket.on('list-room', (data, ack) => {
                ack('');
            });
            socket.on('chat-history', (data) => {
            });
            socket.on('sign-in', (data) => {
                const {email, password} = data;

            });
        });

    }
};

export default {
    init,
    database,
    databaseUrl,
    io,
    config,
}