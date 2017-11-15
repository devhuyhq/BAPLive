import RoomSchema from "../schema/RoomSchema";
import BAPLive from "../BAPLive";
import {dataResponse, errorResponse, serverError} from "../util/ResponseUtil";
import UserSchema from "../schema/UserSchema";
import MemberSchema from "../schema/MemberSchema";
import LikeSchema from "../schema/LikeSchema";

export const getListRoom = async (socket, data, ack) => {
    try {
        const rooms = await BAPLive.database.collection(RoomSchema.getSchemaName()).find().toArray();
        ack(dataResponse(rooms))
    } catch (err) {
        ack(serverError());
    }
};

export const createRoom = async (socket, data, ack) => {
    const {roomName} = data;
    const user = socket.user;
    const now = new Date();
    try {
        const room = {
            [RoomSchema.getAdminField()]: socket.user[UserSchema.getIdField()],
            [RoomSchema.getRoomNameField()]: roomName,
            [RoomSchema.getCreateAtField()]: now,
            [RoomSchema.getUpdateAtField()]: now,
            [RoomSchema.getStatusField()]: 0,
        };
        const result = await BAPLive.database.collection(RoomSchema.getSchemaName()).insertOne(room);
        const savedRoom = await BAPLive.database.collection(RoomSchema.getSchemaName()).findOne({
            [RoomSchema.getIdField()]: result.insertedId
        });
        ack(dataResponse(savedRoom));
        socket.broadcast.emit('on-room-live', savedRoom);
    } catch (err) {
        ack(serverError());
    }
};

export const joinRoom = async (socket, data, ack) => {
    const {roomId, deviceId} = data;
    if (!roomId || !deviceId) {
        return ack(errorResponse(400, 'bad_request'));
    }
    const room = await BAPLive.database.collection(RoomSchema.getSchemaName()).findOne({
        [RoomSchema.getIdField()]: roomId
    });
    if (!room) {
        return ack(errorResponse(400, 'room_not_found'))
    }

    const userId = socket.user && socket.user[UserSchema.getIdField()];
    let member;
    if (userId) {
        member = await BAPLive.database.collection(MemberSchema.getSchemaName()).findOne({
            [MemberSchema.getRoomIdField()]: roomId,
            [MemberSchema.getUserIdField()]: userId,
        });
    } else {
        member = await BAPLive.database.collection(MemberSchema.getSchemaName()).findOne({
            [MemberSchema.getRoomIdField()]: roomId,
            [MemberSchema.getDeviceIdField()]: deviceId,
        });
    }
    if (member) {
        BAPLive.database.collection(MemberSchema.getSchemaName()).updateOne(
            {
                [MemberSchema.getIdField()]: member[MemberSchema.getIdField()],
            },
            {
                [MemberSchema.getUserIdField()]: userId,
                [MemberSchema.getDeviceIdField()]: deviceId,
                [MemberSchema.getStatusField()]: 0,
            }
        )
    } else {
        BAPLive.database.collection(MemberSchema.getSchemaName()).insertOne(
            {
                [MemberSchema.getUserIdField()]: userId,
                [MemberSchema.getRoomIdField()]: roomId,
                [MemberSchema.getDeviceIdField()]: deviceId,
                [MemberSchema.getStatusField()]: 0,
            }
        )
    }

    let user;
    if (userId) {
        user = await BAPLive.database.collection(UserSchema.getSchemaName()).findOne({
            [UserSchema.getIdField()]: userId
        });
    }
    socket.join(roomId, () => {
        socket.to(roomId).emit(
            'on-join-room',
            {
                [UserSchema.getSchemaName()]: user,
                [MemberSchema.getDeviceIdField()]: deviceId,
            }
        )
    });
};

export const leaveRoom = async (socket, data, ack) => {
    const {roomId, deviceId} = data;
    if (!roomId || !deviceId) {
        return ack(errorResponse(400, 'bad_request'));
    }
    const room = await BAPLive.database.collection(RoomSchema.getSchemaName()).findOne({
        [RoomSchema.getIdField()]: roomId
    });
    if (!room) {
        return ack(errorResponse(400, 'room_not_found'))
    }

    const userId = socket.user && socket.user[UserSchema.getIdField()];
    let user;
    let member;
    if (userId) {
        member = await BAPLive.database.collection(MemberSchema.getSchemaName()).findOne({
            [MemberSchema.getRoomIdField()]: roomId,
            [MemberSchema.getUserIdField()]: userId,
        });
    } else {
        member = await BAPLive.database.collection(MemberSchema.getSchemaName()).findOne({
            [MemberSchema.getRoomIdField()]: roomId,
            [MemberSchema.getDeviceIdField()]: deviceId,
        });
    }
    if (!member) {
        return ack(errorResponse(400, 'member_not_found'))
    }

    BAPLive.database.collection(MemberSchema.getSchemaName()).updateOne(
        {
            [MemberSchema.getIdField()]: member[MemberSchema.getIdField()],
        },
        {
            [MemberSchema.getUserIdField()]: userId,
            [MemberSchema.getDeviceIdField()]: deviceId,
            [MemberSchema.getStatusField()]: 0,
        }
    );
    ack(dataResponse());
    if (userId) {
        user = await BAPLive.database.collection(UserSchema.getSchemaName()).findOne({
            [UserSchema.getIdField()]: userId
        });
    }

    socket.leave(roomId, () => {
        socket.to(roomId).emit(
            'on-leave-room',
            {
                [UserSchema.getSchemaName()]: user,
                [MemberSchema.getDeviceIdField()]: deviceId,
            }
        )
    });
};

export const changeStatus = async (socket, data, ack) => {
    const {roomId, status} = data;
    const user = socket.user;
    if (!roomId || !status) {
        return ack(errorResponse(400, 'bad_request'));
    }
    const room = await BAPLive.database.collection(RoomSchema.getSchemaName()).findOne({
        [RoomSchema.getIdField()]: roomId
    });
    if (!room) {
        return ack(errorResponse(400, 'room_not_found'))
    }

    if (room[RoomSchema.getAdminField()] !== user[UserSchema.getIdField()]) {
        return ack(errorResponse(401, 'no_permission'))
    }

    BAPLive.database.collection(RoomSchema.getSchemaName()).updateOne(
        {
            [RoomSchema.getIdField()]: roomId,
        },
        {
            [RoomSchema.getStatusField()]: status,
        }
    );

    socket.to(roomId).emit(
        'on-change-status',
        Object.assign({}, room, {[RoomSchema.getStatusField()]: status}),
    )
};

export const getRoomInfo = async (socket, data, ack) => {
    const {roomId} = data;
    if (!roomId) {
        return ack(400, 'bad_request')
    }
    const room = await BAPLive.database.collection(RoomSchema.getSchemaName()).findOne({
        [RoomSchema.getIdField()]: roomId
    });
    if (!room) {
        return ack(errorResponse(400, 'room_not_found'))
    }
    ack(dataResponse(room));
};

export const likeRoom = async (socket, data, ack) => {
    const {roomId} = data;
    if (!roomId) {
        return ack(400, 'bad_request')
    }
    const room = await BAPLive.database.collection(RoomSchema.getSchemaName()).findOne({
        [RoomSchema.getIdField()]: roomId
    });
    if (!room) {
        return ack(errorResponse(400, 'room_not_found'))
    }

    const like = await BAPLive.database.collection(LikeSchema.getSchemaName()).findOne({
        [LikeSchema.getRoomIdField()]: roomId,
        [LikeSchema.getUserIdField()]: socket.user[UserSchema.getIdField()]
    });
    if (!like) {
        const now = new Date();
        await BAPLive.database.collection(LikeSchema.getSchemaName()).insertOne({
            [LikeSchema.getUserIdField()]: socket.user[UserSchema.getIdField()],
            [LikeSchema.getRoomIdField()]: roomId,
            [LikeSchema.getCreateAtField()]: now,
            [LikeSchema.getUpdateAtField()]: now,
        })
    } else {
        await BAPLive.database.collection(LikeSchema.getSchemaName()).deleteOne({
            [LikeSchema.getIdField()]: like[LikeSchema.getIdField()],
        })
    }
    ack(dataResponse());
};
