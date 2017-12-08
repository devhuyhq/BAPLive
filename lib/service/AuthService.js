import BAPLive from "../BAPLive";
import UserSchema from "../schema/UserSchema";
import jwt from 'jsonwebtoken';
import {JWT_SECRET_KEY} from "../Config";
import {dataResponse, errorResponse, sendAck} from "../util/ResponseUtil";

export const signIn = async (socket, data, ack) => {
    const {email, password} = data;
    const user = await BAPLive.database.collection(UserSchema.getSchemaName()).findOne({email, password});
    console.log(UserSchema.getSchemaName());
    console.log(password);
    console.log(user);
    if (user) {
        const token = jwt.sign({user}, JWT_SECRET_KEY);
        sendAck(ack, dataResponse(token));
    } else {
        sendAck(ack, errorResponse(69, 'wrong_credential'))
    }
};

export const getProfile = async (socket, data, ack) => {
    sendAck(ack, dataResponse(socket.user));
};