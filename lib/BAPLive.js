import {MongoClient} from 'mongodb';

import {userSchema} from "./schema/UserSchema";
import {roomSchema} from "./schema/RoomSchema";
import {messageSchema} from "./schema/MessageSchema";
import {likeSchema} from "./schema/LikeSchema";
import {signIn} from "./service/AuthService";



class BAPLive {
    static databaseUrl;
    static database;
    static io;
    static jwtKey;
    static config;

    static init(databaseUrl, io, config, key) {
        this.config = {
            userSchema,
            roomSchema,
            messageSchema,
            likeSchema
        };
        MongoClient.connect(databaseUrl, (err, db) => {
            this.database = db;
        });
        this.jwtKey = key;
        this.databaseUrl = databaseUrl;

        if (config) {
            this.config = config;
        }

        if (io) {
            this.io = io;

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
                socket.on('sign-in', async (data, ack) => {
                    signIn(socket, data, ack);
                });
            });

        }
    };
}



export default BAPLive;