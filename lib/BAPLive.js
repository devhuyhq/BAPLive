import {MongoClient} from 'mongodb';

import {userSchema} from "./schema/UserSchema";
import {roomSchema} from "./schema/RoomSchema";
import {messageSchema} from "./schema/MessageSchema";
import {likeSchema} from "./schema/LikeSchema";
import {signIn} from "./service/AuthService";
import {changeStatus, createRoom, getListRoom, getRoomInfo, joinRoom, leaveRoom, likeRoom} from "./service/RoomService";
import jwt from 'jsonwebtoken';
import {JWT_SECRET_KEY} from "./Config";
import {errorResponse} from "./util/ResponseUtil";
import {memberSchema} from "./schema/MemberSchema";
import {getMessages, sendMessage} from "./service/MessageService";
const SECURED_EVENTS = ['create-room', 'like-room', 'change-status', 'send-message'];

class BAPLive {
    static databaseUrl;
    static database;
    static io;
    static jwtKey;
    static config = {
        userSchema,
        roomSchema,
        messageSchema,
        likeSchema,
        memberSchema,
    };

    static init(databaseUrl, io, config, key) {
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

            io.use((socket, next) => {
                const token = socket.request.headers && socket.request.headers.token;
                if (token) {
                    try {
                        const decoded = jwt.verify(token, JWT_SECRET_KEY);
                        socket.user = decoded.user;
                    } catch (err) {

                    }
                }
                next();
            });

            io.on('connection', function (socket) {

                socket.use((packet, next) => {
                    const event = packet[0];
                    const ack = packet[packet.length - 1];
                    const user = socket.user;
                    if (SECURED_EVENTS.indexOf(event) > -1) {
                        if (!user) {
                            ack(errorResponse(401, 'wrong_credential'))
                        }
                    }
                    return next();
                });

                socket.on('create-room', (data, ack) => {
                    createRoom(socket, data, ack);
                });
                socket.on('leave-room', (data, ack) => {
                    leaveRoom(socket, data, ack)
                });
                socket.on('join-room', (data, ack) => {
                    joinRoom(socket, data, ack);
                });
                socket.on('like-room', (data, ack) => {
                    likeRoom(socket, data, ack);
                });
                socket.on('add-step', (data) => {
                });
                socket.on('list-room', (data, ack) => {
                    getListRoom(socket, data, ack);
                });
                socket.on('sign-in', async (data, ack) => {
                    signIn(socket, data, ack);
                });
                socket.on('change-status', async (data, ack) => {
                    changeStatus(socket, data, ack);
                });
                socket.on('get-room-info', async (data, ack) => {
                    getRoomInfo(socket, data, ack);
                });
                socket.on('send-message', async (data, ack) => {
                    sendMessage(socket, data, ack);
                });
                socket.on('get-message', async (data, ack) => {
                    getMessages(socket, data, ack);
                });
            });

        }
    };
}



export default BAPLive;