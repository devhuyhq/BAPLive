import BAPLive from "../BAPLive";
import UserSchema from "../schema/UserSchema";
import {dataResponse, errorResponse, serverError} from "../util/ResponseUtil";
import RoomSchema from "../schema/RoomSchema";
import MessageSchema from "../schema/MessageSchema";

const ObjectID = require('mongodb').ObjectID;

export const sendMessage = async (socket, data, ack) => {
    const {roomId, content} = data;
    if (!roomId || !content) {
        return ack(errorResponse(400, 'bad_request'));
    }

    const room = await BAPLive.database.collection(RoomSchema.getSchemaName()).findOne({
        [RoomSchema.getIdField()]: new ObjectID(roomId)
    });
    if (!room) {
        return ack(errorResponse(400, 'room_not_found'))
    }
    const now = new Date();
    const message = {
        [MessageSchema.getRoomIdField()]: new ObjectID(roomId),
        [MessageSchema.getUserIdField()]: new ObjectID(socket.user[UserSchema.getIdField()]),
        [MessageSchema.getContentField()]: content,
        [MessageSchema.getUpdateAtField()]: now,
        [MessageSchema.getCreateAtField()]: now,
    };
    const result = await BAPLive.database.collection(MessageSchema.getSchemaName()).insertOne(message);
    const savedMessage = await BAPLive.database.collection(MessageSchema.getSchemaName()).findOne({
        [MessageSchema.getIdField()]: new ObjectID(result.insertedId)
    });
    const user = await BAPLive.database.collection(UserSchema.getSchemaName()).findOne({
        [UserSchema.getIdField()]: new ObjectID(socket.user[UserSchema.getIdField()])
    }, { [UserSchema.getPasswordField()]: 0} );
    savedMessage[UserSchema.getSchemaName()] = user;
    ack(dataResponse(savedMessage));
    socket.to(roomId).emit('on-message', dataResponse(savedMessage));
};

export const getMessages = async (socket, data, ack) => {
    const {dateTime, roomId} = data;
    if (!roomId) {
        return ack(errorResponse(400, 'bad_request'))
    }
    const query = dateTime ? {
        [MessageSchema.getUpdateAtField()]: {
            $lt: new Date(dateTime),

        },
        [MessageSchema.getRoomIdField()]: new ObjectID(roomId),
    } : {[MessageSchema.getRoomIdField()]: new ObjectID(roomId),};
    try {
        BAPLive.database.collection(MessageSchema.getSchemaName()).aggregate([
            {
                $match: query
            },
            {
                $lookup: {
                    from: UserSchema.getSchemaName(),
                    localField: MessageSchema.getUserIdField(),
                    foreignField: UserSchema.getIdField(),
                    as: UserSchema.getSchemaName(),
                }
            },
            {$unwind: "$" + UserSchema.getSchemaName()},
            {
                $project: {
                    [MessageSchema.getUserIdField()]: 1,
                    [MessageSchema.getUpdateAtField()]: 1,
                    [MessageSchema.getCreateAtField()]: 1,
                    [MessageSchema.getRoomIdField()]: 1,
                    [MessageSchema.getContentField()]: 1,
                    [UserSchema.getSchemaName()]: {
                        [UserSchema.getEmailField()]: 1,
                    }
                }
            },
            {
                $sort: {
                    [MessageSchema.getUpdateAtField()]: -1,
                }
            },
            {
                $limit: 20
            },
            {
                $sort: {
                    [MessageSchema.getUpdateAtField()]: 1,
                }
            },
        ], (err, res) => {
            if (err) throw err;
            ack(dataResponse(res))
        });
    } catch (err) {
        console.log(err);
        ack(serverError())
    }

};