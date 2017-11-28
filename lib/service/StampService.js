import BAPLive from "../BAPLive";
import UserSchema from "../schema/UserSchema";
import {dataResponse, errorResponse, sendAck, serverError} from "../util/ResponseUtil";
import RoomSchema from "../schema/RoomSchema";
import MessageSchema from "../schema/MessageSchema";
import StampSchema from "../schema/StampSchema";

const ObjectID = require('mongodb').ObjectID;

export const sendStamp = async (socket, data, ack) => {
    const {roomId, content} = data;
    if (!roomId || !content) {
        return sendAck(ack, errorResponse(400, 'bad_request'));
    }

    const room = await BAPLive.database.collection(RoomSchema.getSchemaName()).findOne({
        [RoomSchema.getIdField()]: new ObjectID(roomId)
    });
    if (!room) {
        return sendAck(ack, errorResponse(400, 'room_not_found'))
    }
    const now = new Date();
    const stamp = {
        [StampSchema.getRoomIdField()]: new ObjectID(roomId),
        [StampSchema.getUserIdField()]: new ObjectID(socket.user[UserSchema.getIdField()]),
        [StampSchema.getContentField()]: content,
        [StampSchema.getUpdateAtField()]: now,
        [StampSchema.getCreateAtField()]: now,
    };
    const result = await BAPLive.database.collection(StampSchema.getSchemaName()).insertOne(stamp);
    const savedStamp = await BAPLive.database.collection(StampSchema.getSchemaName()).findOne({
        [StampSchema.getIdField()]: new ObjectID(result.insertedId)
    });
    const user = await BAPLive.database.collection(UserSchema.getSchemaName()).findOne({
        [UserSchema.getIdField()]: new ObjectID(socket.user[UserSchema.getIdField()])
    }, { [UserSchema.getPasswordField()]: 0} );
    savedStamp[UserSchema.getSchemaName()] = user;
    sendAck(ack, dataResponse(savedStamp));
    socket.to(roomId).emit('on-stamp', dataResponse(savedStamp));
};

export const getStamps = async (socket, data, ack) => {
    const {roomId} = data;
    if (!roomId) {
        return sendAck(ack, errorResponse(400, 'bad_request'))
    }
    const query = {[StampSchema.getRoomIdField()]: new ObjectID(roomId)};
    try {
        BAPLive.database.collection(StampSchema.getSchemaName()).aggregate([
            {
                $match: query
            },
            {
                $lookup: {
                    from: UserSchema.getSchemaName(),
                    localField: StampSchema.getUserIdField(),
                    foreignField: UserSchema.getIdField(),
                    as: UserSchema.getSchemaName(),
                }
            },
            {$unwind: "$" + UserSchema.getSchemaName()},
            {
                $project: {
                    [StampSchema.getUserIdField()]: 1,
                    [StampSchema.getUpdateAtField()]: 1,
                    [StampSchema.getCreateAtField()]: 1,
                    [StampSchema.getRoomIdField()]: 1,
                    [StampSchema.getContentField()]: 1,
                    [UserSchema.getSchemaName()]: {
                        [UserSchema.getEmailField()]: 1,
                    }
                }
            },
            {
                $sort: {
                    [StampSchema.getUpdateAtField()]: -1,
                }
            },
            {
                $limit: 20
            },
            {
                $sort: {
                    [StampSchema.getUpdateAtField()]: 1,
                }
            },
        ], (err, res) => {
            if (err) throw err;
            sendAck(ack, dataResponse(res))
        });
    } catch (err) {
        sendAck(ack, serverError())
    }

};