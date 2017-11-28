import RoomSchema from "../schema/RoomSchema";
import BAPLive from "../BAPLive";
import {dataResponse, errorResponse, sendAck, serverError} from "../util/ResponseUtil";
import UserSchema from "../schema/UserSchema";
import MemberSchema from "../schema/MemberSchema";
import LikeSchema from "../schema/LikeSchema";

const ObjectID = require('mongodb').ObjectID;

export const getListRoom = async (socket, data, ack) => {
    try {
        BAPLive.database.collection(RoomSchema.getSchemaName()).aggregate([
            {
                $lookup: {
                    from: UserSchema.getSchemaName(),
                    localField: RoomSchema.getAdminField(),
                    foreignField: UserSchema.getIdField(),
                    as: UserSchema.getSchemaName(),
                }
            },
            {$unwind: "$" + UserSchema.getSchemaName()},
            {
                $project: {
                    [RoomSchema.getRoomNameField()]: 1,
                    [RoomSchema.getUpdateAtField()]: 1,
                    [RoomSchema.getCreateAtField()]: 1,
                    [RoomSchema.getAdminField()]: 1,
                    [RoomSchema.getStatusField()]: 1,
                    [RoomSchema.getUrlField()]: 1,
                    [RoomSchema.getImageField()]: 1,
                    [UserSchema.getSchemaName()]: {
                        [UserSchema.getEmailField()]: 1,
                    }
                }
            },
            {$sort: {[RoomSchema.getUpdateAtField()]: -1}}
        ], (err, res) => {
            if (err) throw err;
            sendAck(ack, dataResponse(res))
        });

    } catch (err) {
        sendAck(ack, serverError());
    }
};

export const createRoom = async (socket, data, ack) => {
    const {roomName} = data;
    const user = socket.user;
    const now = new Date();
    try {
        const room = {
            [RoomSchema.getAdminField()]: new ObjectID(socket.user[UserSchema.getIdField()]),
            [RoomSchema.getRoomNameField()]: roomName,
            [RoomSchema.getCreateAtField()]: now,
            [RoomSchema.getUpdateAtField()]: now,
            [RoomSchema.getStatusField()]: 0,

        };
        const result = await BAPLive.database.collection(RoomSchema.getSchemaName()).insertOne(room);
        await BAPLive.database.collection(RoomSchema.getSchemaName()).updateOne({
            [RoomSchema.getIdField()]: result.insertedId
        }, {
            $set: {
                [RoomSchema.getUrlField()]: `${BAPLive.streamUrl}/${result.insertedId}`
            },
        });
        const savedRoom = await BAPLive.database.collection(RoomSchema.getSchemaName()).findOne({
            [RoomSchema.getIdField()]: result.insertedId
        });
        sendAck(ack, dataResponse(savedRoom));
        BAPLive.io.sockets.emit('on-room-live', dataResponse(savedRoom));
    } catch (err) {
        sendAck(ack, serverError());
    }
};

export const joinRoom = async (socket, data, ack) => {
    const {roomId, deviceId} = data;
    if (!roomId || !deviceId) {
        return sendAck(ack, errorResponse(400, 'bad_request'));
    }
    const room = await BAPLive.database.collection(RoomSchema.getSchemaName()).findOne({
        [RoomSchema.getIdField()]: new ObjectID(roomId)
    });
    if (!room) {
        return sendAck(ack, errorResponse(400, 'room_not_found'))
    }

    const userId = socket.user && socket.user[UserSchema.getIdField()];
    let member;
    if (userId) {
        member = await BAPLive.database.collection(MemberSchema.getSchemaName()).findOne({
            [MemberSchema.getRoomIdField()]: new ObjectID(roomId),
            [MemberSchema.getUserIdField()]: new ObjectID(userId),
        });
    } else {
        member = await BAPLive.database.collection(MemberSchema.getSchemaName()).findOne({
            [MemberSchema.getRoomIdField()]: new ObjectID(roomId),
            [MemberSchema.getDeviceIdField()]: deviceId,
        });
    }
    const now = new Date();
    if (member) {
        await BAPLive.database.collection(MemberSchema.getSchemaName()).updateOne(
            {
                [MemberSchema.getIdField()]: new ObjectID(member[MemberSchema.getIdField()]),
            },
            {
                $set: {
                    [MemberSchema.getUserIdField()]: new ObjectID(userId),
                    [MemberSchema.getDeviceIdField()]: deviceId,
                    [MemberSchema.getStatusField()]: 0,
                    [MemberSchema.getUpdateAtField()]: now,
                }
            }
        )
    } else {
        await BAPLive.database.collection(MemberSchema.getSchemaName()).insertOne(
            {
                [MemberSchema.getUserIdField()]: new ObjectID(userId),
                [MemberSchema.getRoomIdField()]: new ObjectID(roomId),
                [MemberSchema.getDeviceIdField()]: deviceId,
                [MemberSchema.getUpdateAtField()]: now,
                [MemberSchema.getCreateAtField()]: now,
                [MemberSchema.getStatusField()]: 0,
            }
        )
    }

    let updatedMember;
    if (userId) {
        const user = await BAPLive.database.collection(UserSchema.getSchemaName()).findOne({
            [UserSchema.getIdField()]: new ObjectID(userId)
        }, {[UserSchema.getPasswordField()]: 0});

        updatedMember = await BAPLive.database.collection(MemberSchema.getSchemaName()).findOne({
            [MemberSchema.getRoomIdField()]: new ObjectID(roomId),
            [MemberSchema.getUserIdField()]: new ObjectID(userId),
        });
        updatedMember[UserSchema.getSchemaName()] = user;
    } else {
        updatedMember = await BAPLive.database.collection(MemberSchema.getSchemaName()).findOne({
            [MemberSchema.getRoomIdField()]: new ObjectID(roomId),
            [MemberSchema.getDeviceIdField()]: deviceId,
        });
    }

    const onlineMemberCount = await BAPLive.database
        .collection(MemberSchema.getSchemaName()).find(
            {
                [MemberSchema.getRoomIdField()]: new ObjectID(roomId),
                [MemberSchema.getStatusField()]: 0,
            }
        ).count();
    updatedMember.onlineMemberCount = onlineMemberCount;
    sendAck(ack, dataResponse(updatedMember));
    socket.join(roomId, () => {
        socket.to(roomId).emit(
            'on-join-room',
            dataResponse(updatedMember)
        )
    });
};

export const leaveRoom = async (socket, data, ack) => {
    const {roomId, deviceId} = data;
    if (!roomId || !deviceId) {
        return sendAck(ack, errorResponse(400, 'bad_request'));
    }
    const room = await BAPLive.database.collection(RoomSchema.getSchemaName()).findOne({
        [RoomSchema.getIdField()]: new ObjectID(roomId)
    });
    if (!room) {
        return sendAck(ack, errorResponse(400, 'room_not_found'))
    }

    const userId = socket.user && socket.user[UserSchema.getIdField()];
    let user;
    let member;
    if (userId) {
        member = await BAPLive.database.collection(MemberSchema.getSchemaName()).findOne({
            [MemberSchema.getRoomIdField()]: new ObjectID(roomId),
            [MemberSchema.getUserIdField()]: new ObjectID(userId),
        });
    } else {
        member = await BAPLive.database.collection(MemberSchema.getSchemaName()).findOne({
            [MemberSchema.getRoomIdField()]: new ObjectID(roomId),
            [MemberSchema.getDeviceIdField()]: deviceId,
        });
    }
    if (!member) {
        return sendAck(ack, errorResponse(400, 'member_not_found'))
    }

    const now = new Date();
    BAPLive.database.collection(MemberSchema.getSchemaName()).updateOne(
        {
            [MemberSchema.getIdField()]: new ObjectID(member[MemberSchema.getIdField()]),
        },
        {
            $set: {
                [MemberSchema.getUserIdField()]: new ObjectID(userId),
                [MemberSchema.getDeviceIdField()]: deviceId,
                [MemberSchema.getStatusField()]: 1,
                [MemberSchema.getUpdateAtField()]: now,
            }
        }
    );
    let updatedMember;
    if (userId) {
        const user = await BAPLive.database.collection(UserSchema.getSchemaName()).findOne({
            [UserSchema.getIdField()]: new ObjectID(userId)
        }, {[UserSchema.getPasswordField()]: 0});

        updatedMember = await BAPLive.database.collection(MemberSchema.getSchemaName()).findOne({
            [MemberSchema.getRoomIdField()]: new ObjectID(roomId),
            [MemberSchema.getUserIdField()]: new ObjectID(userId),
        });
        updatedMember[UserSchema.getSchemaName()] = user;
    } else {
        updatedMember = await BAPLive.database.collection(MemberSchema.getSchemaName()).findOne({
            [MemberSchema.getRoomIdField()]: new ObjectID(roomId),
            [MemberSchema.getDeviceIdField()]: deviceId,
        });
    }

    const onlineMemberCount = await BAPLive.database
        .collection(MemberSchema.getSchemaName()).find(
            {
                [MemberSchema.getRoomIdField()]: new ObjectID(roomId),
                [MemberSchema.getStatusField()]: 0,
            }
        ).count();
    updatedMember.onlineMemberCount = onlineMemberCount;
    sendAck(ack, dataResponse(updatedMember));
    socket.to(roomId).emit(
        'on-leave-room',
        dataResponse(updatedMember)
    );
    socket.leave(roomId);
};

export const changeStatus = async (socket, data, ack) => {
    const {roomId, status} = data;
    const user = socket.user;
    if (!roomId || !status) {
        return sendAck(ack, errorResponse(400, 'bad_request'));
    }
    const room = await BAPLive.database.collection(RoomSchema.getSchemaName()).findOne({
        [RoomSchema.getIdField()]: new ObjectID(roomId)
    });
    if (!room) {
        return sendAck(ack, errorResponse(400, 'room_not_found'))
    }

    if (room[RoomSchema.getAdminField()].toString() !== user[UserSchema.getIdField()]) {
        return sendAck(ack, errorResponse(401, 'no_permission'))
    }

    const updateData = {
        [RoomSchema.getStatusField()]: status,
    };

    BAPLive.database.collection(RoomSchema.getSchemaName()).updateOne(
        {
            [RoomSchema.getIdField()]: new ObjectID(roomId),
        },
        {
            $set: updateData
        }
    );

    sendAck(ack, dataResponse(Object.assign({}, room, updateData)));

    BAPLive.io.sockets.emit(
        'on-change-status',
        dataResponse(Object.assign({}, room, updateData))
    )
};

export const getRoomInfo = async (socket, data, ack) => {
    const {roomId} = data;
    if (!roomId) {
        return sendAck(ack, errorResponse(400, 'bad_request'))
    }
    const room = await BAPLive.database.collection(RoomSchema.getSchemaName()).findOne({
        [RoomSchema.getIdField()]: new ObjectID(roomId)
    });
    if (!room) {
        return sendAck(ack, errorResponse(400, 'room_not_found'))
    }
    const likes = await BAPLive.database
        .collection(LikeSchema.getSchemaName()).find({[LikeSchema.getRoomIdField()]: new ObjectID(roomId)}).toArray();
    room.likeCount = likes.length;
    const userId = socket.user && socket.user[UserSchema.getIdField()];
    const like = likes.find((like) => {
        return (like[LikeSchema.getRoomIdField()] == roomId && like[LikeSchema.getUserIdField()] == userId)
    });
    room.isLiked = like !== undefined;

    BAPLive.database
        .collection(MemberSchema.getSchemaName())
        .aggregate([
            {
                $match: {
                    [MemberSchema.getRoomIdField()]: new ObjectID(roomId),
                    [MemberSchema.getStatusField()]: 0,
                }
            },
            {
                $lookup: {
                    from: UserSchema.getSchemaName(),
                    localField: MemberSchema.getUserIdField(),
                    foreignField: UserSchema.getIdField(),
                    as: UserSchema.getSchemaName(),
                }
            },
            {
                $unwind: {
                    path: "$" + UserSchema.getSchemaName(),
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $project: {
                    [MemberSchema.getUserIdField()]: 1,
                    [MemberSchema.getRoomIdField()]: 1,
                    [MemberSchema.getCreateAtField()]: 1,
                    [MemberSchema.getUpdateAtField()]: 1,
                    [MemberSchema.getStatusField()]: 1,
                    [MemberSchema.getDeviceIdField()]: 1,
                    [UserSchema.getSchemaName()]: {
                        [UserSchema.getEmailField()]: 1,
                    }
                }
            }
        ], (err, res) => {
            if (err) throw err;
            room.memberCount = res.length;
            room.members = res.slice(0, 20);
            sendAck(ack, dataResponse(room));
        });


};

export const likeRoom = async (socket, data, ack) => {
    const {roomId} = data;
    if (!roomId) {
        return sendAck(ack, errorResponse(400, 'bad_request'))
    }
    const room = await BAPLive.database.collection(RoomSchema.getSchemaName()).findOne({
        [RoomSchema.getIdField()]: new ObjectID(roomId)
    });
    if (!room) {
        return sendAck(ack, errorResponse(400, 'room_not_found'))
    }

    const like = await BAPLive.database.collection(LikeSchema.getSchemaName()).findOne({
        [LikeSchema.getRoomIdField()]: new ObjectID(roomId),
        [LikeSchema.getUserIdField()]: new ObjectID(socket.user[UserSchema.getIdField()])
    });
    if (!like) {
        const now = new Date();
        await BAPLive.database.collection(LikeSchema.getSchemaName()).insertOne({
            [LikeSchema.getUserIdField()]: new ObjectID(socket.user[UserSchema.getIdField()]),
            [LikeSchema.getRoomIdField()]: new ObjectID(roomId),
            [LikeSchema.getCreateAtField()]: now,
            [LikeSchema.getUpdateAtField()]: now,
        });
    } else {
        await BAPLive.database.collection(LikeSchema.getSchemaName()).deleteOne({
            [LikeSchema.getIdField()]: new ObjectID(like[LikeSchema.getIdField()]),
        })
    }

    const likeCount = await BAPLive.database
        .collection(LikeSchema.getSchemaName()).find({[LikeSchema.getRoomIdField()]: new ObjectID(roomId)}).count();
    sendAck(ack, dataResponse({
        roomId,
        likeCount,
        isLiked: !like,
    }));

    BAPLive.io.sockets.emit(
        'on-like-room',
        dataResponse({roomId, likeCount})
    )
};
