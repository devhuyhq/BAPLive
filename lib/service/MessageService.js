import BAPLive from "../BAPLive";
import UserSchema from "../schema/UserSchema";
import {dataResponse, errorResponse} from "../util/ResponseUtil";
import RoomSchema from "../schema/RoomSchema";
import MessageSchema from "../schema/MessageSchema";

export const sendMessage = async (socket, data, ack) => {
    const {roomId, content} = data;
    if (!roomId || !content) {
        return ack(errorResponse(400, 'bad_request'));
    }

    const room = await BAPLive.database.collection(RoomSchema.getSchemaName()).findOne({
        [RoomSchema.getIdField()]: roomId
    });
    if (!room) {
        return ack(errorResponse(400, 'room_not_found'))
    }
    const now = new Date();
    const message = {
        [MessageSchema.getRoomIdField()]: roomId,
        [MessageSchema.getUserIdField()]: socket.user[UserSchema.getIdField()],
        [MessageSchema.getContentField()]: content,
        [MessageSchema.getUpdateAtField()]: now,
        [MessageSchema.getCreateAtField()]: now,
    };
    const result = await BAPLive.database.collection(MessageSchema.getSchemaName()).insertOne(message);
    const savedMessage = await BAPLive.database.collection(MessageSchema.getSchemaName()).findOne({
        [MessageSchema.getIdField()]: result.insertedId
    });
    ack(dataResponse(savedMessage));
    socket.to(roomId).emit('on-message', savedMessage);
};

export const getMessages = async (socket, data, ack) => {
    const {dateTime} = data;
    const query = dateTime ? {[MessageSchema.getUpdateAtField()]: {
        $lt: new Date(dateTime),
    }} : {};
    const messages = BAPLive.database.collection(MessageSchema.getSchemaName()).find(
        query,
        {limit: 20}
    ).sort({
        [MessageSchema.getUpdateAtField()]: 1,
    }).toArray();
    ack(messages)
};