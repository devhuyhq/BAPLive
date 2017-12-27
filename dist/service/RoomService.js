"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.likeRoom = exports.getRoomInfo = exports.changeStatus = exports.leaveRoom = exports.joinRoom = exports.createRoom = exports.getListRoom = undefined;

var _RoomSchema = require("../schema/RoomSchema");

var _RoomSchema2 = _interopRequireDefault(_RoomSchema);

var _BAPLive = require("../BAPLive");

var _BAPLive2 = _interopRequireDefault(_BAPLive);

var _ResponseUtil = require("../util/ResponseUtil");

var _UserSchema = require("../schema/UserSchema");

var _UserSchema2 = _interopRequireDefault(_UserSchema);

var _MemberSchema = require("../schema/MemberSchema");

var _MemberSchema2 = _interopRequireDefault(_MemberSchema);

var _LikeSchema = require("../schema/LikeSchema");

var _LikeSchema2 = _interopRequireDefault(_LikeSchema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var ObjectID = require('mongodb').ObjectID;

var getListRoom = exports.getListRoom = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(socket, data, ack) {
        var _admin, _$project;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        console.log('list-room');
                        try {
                            _BAPLive2.default.database.collection(_RoomSchema2.default.getSchemaName()).aggregate([{
                                $lookup: {
                                    from: _UserSchema2.default.getSchemaName(),
                                    localField: _RoomSchema2.default.getAdminField(),
                                    foreignField: _UserSchema2.default.getIdField(),
                                    as: 'admin'
                                }
                            }, { $unwind: "$" + 'admin' }, {
                                $project: (_$project = {}, _defineProperty(_$project, _RoomSchema2.default.getRoomNameField(), 1), _defineProperty(_$project, _RoomSchema2.default.getUpdateAtField(), 1), _defineProperty(_$project, _RoomSchema2.default.getCreateAtField(), 1), _defineProperty(_$project, _RoomSchema2.default.getAdminField(), 1), _defineProperty(_$project, _RoomSchema2.default.getStatusField(), 1), _defineProperty(_$project, _RoomSchema2.default.getUrlField(), 1), _defineProperty(_$project, _RoomSchema2.default.getImageField(), 1), _defineProperty(_$project, "admin", (_admin = {}, _defineProperty(_admin, _UserSchema2.default.getEmailField(), 1), _defineProperty(_admin, _UserSchema2.default.getIdField(), 1), _admin)), _$project)
                            }, { $sort: _defineProperty({}, _RoomSchema2.default.getUpdateAtField(), -1) }], function (err, res) {
                                if (err) throw err;
                                (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.dataResponse)(res));
                            });
                        } catch (err) {
                            (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.serverError)());
                        }

                    case 2:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function getListRoom(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
}();

var createRoom = exports.createRoom = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(socket, data, ack) {
        var roomName, user, now, _room, room, result, savedRoom, admin;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        roomName = data.roomName;
                        user = socket.user;
                        now = new Date();
                        _context2.prev = 3;
                        room = (_room = {}, _defineProperty(_room, _RoomSchema2.default.getAdminField(), new ObjectID(socket.user[_UserSchema2.default.getIdField()])), _defineProperty(_room, _RoomSchema2.default.getRoomNameField(), roomName), _defineProperty(_room, _RoomSchema2.default.getCreateAtField(), now), _defineProperty(_room, _RoomSchema2.default.getUpdateAtField(), now), _defineProperty(_room, _RoomSchema2.default.getStatusField(), 0), _room);
                        _context2.next = 7;
                        return _BAPLive2.default.database.collection(_RoomSchema2.default.getSchemaName()).insertOne(room);

                    case 7:
                        result = _context2.sent;
                        _context2.next = 10;
                        return _BAPLive2.default.database.collection(_RoomSchema2.default.getSchemaName()).updateOne(_defineProperty({}, _RoomSchema2.default.getIdField(), result.insertedId), {
                            $set: _defineProperty({}, _RoomSchema2.default.getUrlField(), _BAPLive2.default.streamUrl + "/" + result.insertedId)
                        });

                    case 10:
                        _context2.next = 12;
                        return _BAPLive2.default.database.collection(_RoomSchema2.default.getSchemaName()).findOne(_defineProperty({}, _RoomSchema2.default.getIdField(), result.insertedId));

                    case 12:
                        savedRoom = _context2.sent;
                        _context2.next = 15;
                        return _BAPLive2.default.database.collection(_UserSchema2.default.getSchemaName()).findOne(_defineProperty({}, _UserSchema2.default.getIdField(), new ObjectID(socket.user[_UserSchema2.default.getIdField()])), _defineProperty({}, _UserSchema2.default.getPasswordField(), 0));

                    case 15:
                        admin = _context2.sent;

                        savedRoom.admin = admin;
                        console.log('create-room');
                        console.log(admin);
                        (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.dataResponse)(savedRoom));
                        _BAPLive2.default.io.sockets.emit('on-room-live', (0, _ResponseUtil.dataResponse)(savedRoom));
                        _context2.next = 27;
                        break;

                    case 23:
                        _context2.prev = 23;
                        _context2.t0 = _context2["catch"](3);

                        console.log(_context2.t0);
                        (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.serverError)());

                    case 27:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, undefined, [[3, 23]]);
    }));

    return function createRoom(_x4, _x5, _x6) {
        return _ref2.apply(this, arguments);
    };
}();

var joinRoom = exports.joinRoom = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(socket, data, ack) {
        var _BAPLive$database$col10;

        var roomId, deviceId, room, userId, member, _BAPLive$database$col6, _BAPLive$database$col7, now, _$set2, _BAPLive$database$col9, onlineMemberCount, response, user;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        roomId = data.roomId, deviceId = data.deviceId;

                        if (!(!roomId || !deviceId)) {
                            _context3.next = 3;
                            break;
                        }

                        return _context3.abrupt("return", (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.errorResponse)(400, 'bad_request')));

                    case 3:
                        _context3.next = 5;
                        return _BAPLive2.default.database.collection(_RoomSchema2.default.getSchemaName()).findOne(_defineProperty({}, _RoomSchema2.default.getIdField(), new ObjectID(roomId)));

                    case 5:
                        room = _context3.sent;

                        if (room) {
                            _context3.next = 8;
                            break;
                        }

                        return _context3.abrupt("return", (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.errorResponse)(400, 'room_not_found')));

                    case 8:
                        userId = socket.user && socket.user[_UserSchema2.default.getIdField()];
                        member = void 0;

                        if (!userId) {
                            _context3.next = 16;
                            break;
                        }

                        _context3.next = 13;
                        return _BAPLive2.default.database.collection(_MemberSchema2.default.getSchemaName()).findOne((_BAPLive$database$col6 = {}, _defineProperty(_BAPLive$database$col6, _MemberSchema2.default.getRoomIdField(), new ObjectID(roomId)), _defineProperty(_BAPLive$database$col6, _MemberSchema2.default.getUserIdField(), new ObjectID(userId)), _BAPLive$database$col6));

                    case 13:
                        member = _context3.sent;
                        _context3.next = 19;
                        break;

                    case 16:
                        _context3.next = 18;
                        return _BAPLive2.default.database.collection(_MemberSchema2.default.getSchemaName()).findOne((_BAPLive$database$col7 = {}, _defineProperty(_BAPLive$database$col7, _MemberSchema2.default.getRoomIdField(), new ObjectID(roomId)), _defineProperty(_BAPLive$database$col7, _MemberSchema2.default.getDeviceIdField(), deviceId), _BAPLive$database$col7));

                    case 18:
                        member = _context3.sent;

                    case 19:
                        now = new Date();

                        if (!member) {
                            _context3.next = 25;
                            break;
                        }

                        _context3.next = 23;
                        return _BAPLive2.default.database.collection(_MemberSchema2.default.getSchemaName()).updateOne(_defineProperty({}, _MemberSchema2.default.getIdField(), new ObjectID(member[_MemberSchema2.default.getIdField()])), {
                            $set: (_$set2 = {}, _defineProperty(_$set2, _MemberSchema2.default.getUserIdField(), new ObjectID(userId)), _defineProperty(_$set2, _MemberSchema2.default.getDeviceIdField(), deviceId), _defineProperty(_$set2, _MemberSchema2.default.getStatusField(), 0), _defineProperty(_$set2, _MemberSchema2.default.getUpdateAtField(), now), _$set2)
                        });

                    case 23:
                        _context3.next = 27;
                        break;

                    case 25:
                        _context3.next = 27;
                        return _BAPLive2.default.database.collection(_MemberSchema2.default.getSchemaName()).insertOne((_BAPLive$database$col9 = {}, _defineProperty(_BAPLive$database$col9, _MemberSchema2.default.getUserIdField(), new ObjectID(userId)), _defineProperty(_BAPLive$database$col9, _MemberSchema2.default.getRoomIdField(), new ObjectID(roomId)), _defineProperty(_BAPLive$database$col9, _MemberSchema2.default.getDeviceIdField(), deviceId), _defineProperty(_BAPLive$database$col9, _MemberSchema2.default.getUpdateAtField(), now), _defineProperty(_BAPLive$database$col9, _MemberSchema2.default.getCreateAtField(), now), _defineProperty(_BAPLive$database$col9, _MemberSchema2.default.getStatusField(), 0), _BAPLive$database$col9));

                    case 27:
                        _context3.next = 29;
                        return _BAPLive2.default.database.collection(_MemberSchema2.default.getSchemaName()).find((_BAPLive$database$col10 = {}, _defineProperty(_BAPLive$database$col10, _MemberSchema2.default.getRoomIdField(), new ObjectID(roomId)), _defineProperty(_BAPLive$database$col10, _MemberSchema2.default.getStatusField(), 0), _BAPLive$database$col10)).count();

                    case 29:
                        onlineMemberCount = _context3.sent;

                        room.onlineMemberCount = onlineMemberCount;

                        response = {
                            room: room
                        };

                        if (!userId) {
                            _context3.next = 39;
                            break;
                        }

                        _context3.next = 35;
                        return _BAPLive2.default.database.collection(_UserSchema2.default.getSchemaName()).findOne(_defineProperty({}, _UserSchema2.default.getIdField(), new ObjectID(userId)), _defineProperty({}, _UserSchema2.default.getPasswordField(), 0));

                    case 35:
                        user = _context3.sent;

                        response.user = user;
                        _context3.next = 40;
                        break;

                    case 39:
                        response[_MemberSchema2.default.getDeviceIdField()] = deviceId;

                    case 40:

                        (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.dataResponse)(response));
                        socket.join(roomId, function () {
                            socket.to(roomId).emit('on-join-room', (0, _ResponseUtil.dataResponse)(response));
                        });

                    case 42:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function joinRoom(_x7, _x8, _x9) {
        return _ref3.apply(this, arguments);
    };
}();

var leaveRoom = exports.leaveRoom = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(socket, data, ack) {
        var _$set3, _BAPLive$database$col17;

        var roomId, deviceId, room, userId, user, member, _BAPLive$database$col14, _BAPLive$database$col15, now, onlineMemberCount, response, _user;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        roomId = data.roomId, deviceId = data.deviceId;

                        if (!(!roomId || !deviceId)) {
                            _context4.next = 3;
                            break;
                        }

                        return _context4.abrupt("return", (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.errorResponse)(400, 'bad_request')));

                    case 3:
                        _context4.next = 5;
                        return _BAPLive2.default.database.collection(_RoomSchema2.default.getSchemaName()).findOne(_defineProperty({}, _RoomSchema2.default.getIdField(), new ObjectID(roomId)));

                    case 5:
                        room = _context4.sent;

                        if (room) {
                            _context4.next = 8;
                            break;
                        }

                        return _context4.abrupt("return", (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.errorResponse)(400, 'room_not_found')));

                    case 8:
                        userId = socket.user && socket.user[_UserSchema2.default.getIdField()];
                        user = void 0;
                        member = void 0;

                        if (!userId) {
                            _context4.next = 17;
                            break;
                        }

                        _context4.next = 14;
                        return _BAPLive2.default.database.collection(_MemberSchema2.default.getSchemaName()).findOne((_BAPLive$database$col14 = {}, _defineProperty(_BAPLive$database$col14, _MemberSchema2.default.getRoomIdField(), new ObjectID(roomId)), _defineProperty(_BAPLive$database$col14, _MemberSchema2.default.getUserIdField(), new ObjectID(userId)), _BAPLive$database$col14));

                    case 14:
                        member = _context4.sent;
                        _context4.next = 20;
                        break;

                    case 17:
                        _context4.next = 19;
                        return _BAPLive2.default.database.collection(_MemberSchema2.default.getSchemaName()).findOne((_BAPLive$database$col15 = {}, _defineProperty(_BAPLive$database$col15, _MemberSchema2.default.getRoomIdField(), new ObjectID(roomId)), _defineProperty(_BAPLive$database$col15, _MemberSchema2.default.getDeviceIdField(), deviceId), _BAPLive$database$col15));

                    case 19:
                        member = _context4.sent;

                    case 20:
                        if (member) {
                            _context4.next = 22;
                            break;
                        }

                        return _context4.abrupt("return", (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.errorResponse)(400, 'member_not_found')));

                    case 22:
                        now = new Date();

                        _BAPLive2.default.database.collection(_MemberSchema2.default.getSchemaName()).updateOne(_defineProperty({}, _MemberSchema2.default.getIdField(), new ObjectID(member[_MemberSchema2.default.getIdField()])), {
                            $set: (_$set3 = {}, _defineProperty(_$set3, _MemberSchema2.default.getUserIdField(), new ObjectID(userId)), _defineProperty(_$set3, _MemberSchema2.default.getDeviceIdField(), deviceId), _defineProperty(_$set3, _MemberSchema2.default.getStatusField(), 1), _defineProperty(_$set3, _MemberSchema2.default.getUpdateAtField(), now), _$set3)
                        });
                        _context4.next = 26;
                        return _BAPLive2.default.database.collection(_MemberSchema2.default.getSchemaName()).find((_BAPLive$database$col17 = {}, _defineProperty(_BAPLive$database$col17, _MemberSchema2.default.getRoomIdField(), new ObjectID(roomId)), _defineProperty(_BAPLive$database$col17, _MemberSchema2.default.getStatusField(), 0), _BAPLive$database$col17)).count();

                    case 26:
                        onlineMemberCount = _context4.sent;

                        room.onlineMemberCount = onlineMemberCount;
                        response = {
                            room: room
                        };

                        if (!userId) {
                            _context4.next = 36;
                            break;
                        }

                        _context4.next = 32;
                        return _BAPLive2.default.database.collection(_UserSchema2.default.getSchemaName()).findOne(_defineProperty({}, _UserSchema2.default.getIdField(), new ObjectID(userId)), _defineProperty({}, _UserSchema2.default.getPasswordField(), 0));

                    case 32:
                        _user = _context4.sent;

                        response.user = _user;
                        _context4.next = 37;
                        break;

                    case 36:
                        response[_MemberSchema2.default.getDeviceIdField()] = deviceId;

                    case 37:

                        (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.dataResponse)(response));
                        socket.to(roomId).emit('on-leave-room', (0, _ResponseUtil.dataResponse)(response));
                        socket.leave(roomId);

                    case 40:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function leaveRoom(_x10, _x11, _x12) {
        return _ref4.apply(this, arguments);
    };
}();

var changeStatus = exports.changeStatus = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(socket, data, ack) {
        var roomId, status, user, room, updateData;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        roomId = data.roomId, status = data.status;
                        user = socket.user;

                        if (!(!roomId || !status)) {
                            _context5.next = 4;
                            break;
                        }

                        return _context5.abrupt("return", (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.errorResponse)(400, 'bad_request')));

                    case 4:
                        _context5.next = 6;
                        return _BAPLive2.default.database.collection(_RoomSchema2.default.getSchemaName()).findOne(_defineProperty({}, _RoomSchema2.default.getIdField(), new ObjectID(roomId)));

                    case 6:
                        room = _context5.sent;

                        if (room) {
                            _context5.next = 9;
                            break;
                        }

                        return _context5.abrupt("return", (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.errorResponse)(400, 'room_not_found')));

                    case 9:
                        if (!(room[_RoomSchema2.default.getAdminField()].toString() !== user[_UserSchema2.default.getIdField()])) {
                            _context5.next = 11;
                            break;
                        }

                        return _context5.abrupt("return", (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.errorResponse)(401, 'no_permission')));

                    case 11:
                        updateData = _defineProperty({}, _RoomSchema2.default.getStatusField(), status);


                        _BAPLive2.default.database.collection(_RoomSchema2.default.getSchemaName()).updateOne(_defineProperty({}, _RoomSchema2.default.getIdField(), new ObjectID(roomId)), {
                            $set: updateData
                        });

                        (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.dataResponse)(Object.assign({}, room, updateData)));

                        _BAPLive2.default.io.sockets.emit('on-change-status', (0, _ResponseUtil.dataResponse)(Object.assign({}, room, updateData)));

                    case 15:
                    case "end":
                        return _context5.stop();
                }
            }
        }, _callee5, undefined);
    }));

    return function changeStatus(_x13, _x14, _x15) {
        return _ref5.apply(this, arguments);
    };
}();

var getRoomInfo = exports.getRoomInfo = function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(socket, data, ack) {
        var _$match, _$project2;

        var roomId, room, likes, userId, like;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        roomId = data.roomId;

                        if (roomId) {
                            _context6.next = 3;
                            break;
                        }

                        return _context6.abrupt("return", (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.errorResponse)(400, 'bad_request')));

                    case 3:
                        _context6.next = 5;
                        return _BAPLive2.default.database.collection(_RoomSchema2.default.getSchemaName()).findOne(_defineProperty({}, _RoomSchema2.default.getIdField(), new ObjectID(roomId)));

                    case 5:
                        room = _context6.sent;

                        if (room) {
                            _context6.next = 8;
                            break;
                        }

                        return _context6.abrupt("return", (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.errorResponse)(400, 'room_not_found')));

                    case 8:
                        _context6.next = 10;
                        return _BAPLive2.default.database.collection(_LikeSchema2.default.getSchemaName()).find(_defineProperty({}, _LikeSchema2.default.getRoomIdField(), new ObjectID(roomId))).toArray();

                    case 10:
                        likes = _context6.sent;

                        room.likeCount = likes.length;
                        userId = socket.user && socket.user[_UserSchema2.default.getIdField()];
                        like = likes.find(function (like) {
                            return like[_LikeSchema2.default.getRoomIdField()] == roomId && like[_LikeSchema2.default.getUserIdField()] == userId;
                        });

                        room.isLiked = like !== undefined;

                        _BAPLive2.default.database.collection(_MemberSchema2.default.getSchemaName()).aggregate([{
                            $match: (_$match = {}, _defineProperty(_$match, _MemberSchema2.default.getRoomIdField(), new ObjectID(roomId)), _defineProperty(_$match, _MemberSchema2.default.getStatusField(), 0), _$match)
                        }, {
                            $lookup: {
                                from: _UserSchema2.default.getSchemaName(),
                                localField: _MemberSchema2.default.getUserIdField(),
                                foreignField: _UserSchema2.default.getIdField(),
                                as: 'user'
                            }
                        }, {
                            $unwind: {
                                path: "$user",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            $project: (_$project2 = {}, _defineProperty(_$project2, _MemberSchema2.default.getUserIdField(), 1), _defineProperty(_$project2, _MemberSchema2.default.getRoomIdField(), 1), _defineProperty(_$project2, _MemberSchema2.default.getCreateAtField(), 1), _defineProperty(_$project2, _MemberSchema2.default.getUpdateAtField(), 1), _defineProperty(_$project2, _MemberSchema2.default.getStatusField(), 1), _defineProperty(_$project2, _MemberSchema2.default.getDeviceIdField(), 1), _defineProperty(_$project2, "user", _defineProperty({}, _UserSchema2.default.getEmailField(), 1)), _$project2)
                        }], function (err, res) {
                            if (err) throw err;
                            room.memberCount = res.length;
                            room.members = res.slice(0, 20);
                            (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.dataResponse)(room));
                        });

                    case 16:
                    case "end":
                        return _context6.stop();
                }
            }
        }, _callee6, undefined);
    }));

    return function getRoomInfo(_x16, _x17, _x18) {
        return _ref6.apply(this, arguments);
    };
}();

var likeRoom = exports.likeRoom = function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(socket, data, ack) {
        var _BAPLive$database$col25;

        var roomId, room, like, _BAPLive$database$col26, now, likeCount, user;

        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        roomId = data.roomId;

                        if (roomId) {
                            _context7.next = 3;
                            break;
                        }

                        return _context7.abrupt("return", (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.errorResponse)(400, 'bad_request')));

                    case 3:
                        _context7.next = 5;
                        return _BAPLive2.default.database.collection(_RoomSchema2.default.getSchemaName()).findOne(_defineProperty({}, _RoomSchema2.default.getIdField(), new ObjectID(roomId)));

                    case 5:
                        room = _context7.sent;

                        if (room) {
                            _context7.next = 8;
                            break;
                        }

                        return _context7.abrupt("return", (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.errorResponse)(400, 'room_not_found')));

                    case 8:
                        _context7.next = 10;
                        return _BAPLive2.default.database.collection(_LikeSchema2.default.getSchemaName()).findOne((_BAPLive$database$col25 = {}, _defineProperty(_BAPLive$database$col25, _LikeSchema2.default.getRoomIdField(), new ObjectID(roomId)), _defineProperty(_BAPLive$database$col25, _LikeSchema2.default.getUserIdField(), new ObjectID(socket.user[_UserSchema2.default.getIdField()])), _BAPLive$database$col25));

                    case 10:
                        like = _context7.sent;

                        if (like) {
                            _context7.next = 17;
                            break;
                        }

                        now = new Date();
                        _context7.next = 15;
                        return _BAPLive2.default.database.collection(_LikeSchema2.default.getSchemaName()).insertOne((_BAPLive$database$col26 = {}, _defineProperty(_BAPLive$database$col26, _LikeSchema2.default.getUserIdField(), new ObjectID(socket.user[_UserSchema2.default.getIdField()])), _defineProperty(_BAPLive$database$col26, _LikeSchema2.default.getRoomIdField(), new ObjectID(roomId)), _defineProperty(_BAPLive$database$col26, _LikeSchema2.default.getCreateAtField(), now), _defineProperty(_BAPLive$database$col26, _LikeSchema2.default.getUpdateAtField(), now), _BAPLive$database$col26));

                    case 15:
                        _context7.next = 19;
                        break;

                    case 17:
                        _context7.next = 19;
                        return _BAPLive2.default.database.collection(_LikeSchema2.default.getSchemaName()).deleteOne(_defineProperty({}, _LikeSchema2.default.getIdField(), new ObjectID(like[_LikeSchema2.default.getIdField()])));

                    case 19:
                        _context7.next = 21;
                        return _BAPLive2.default.database.collection(_LikeSchema2.default.getSchemaName()).find(_defineProperty({}, _LikeSchema2.default.getRoomIdField(), new ObjectID(roomId))).count();

                    case 21:
                        likeCount = _context7.sent;

                        (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.dataResponse)({
                            roomId: roomId,
                            likeCount: likeCount,
                            isLiked: !like
                        }));

                        _context7.next = 25;
                        return _BAPLive2.default.database.collection(_UserSchema2.default.getSchemaName()).findOne(_defineProperty({}, _UserSchema2.default.getIdField(), new ObjectID(socket.user[_UserSchema2.default.getIdField()])), _defineProperty({}, _UserSchema2.default.getPasswordField(), 0));

                    case 25:
                        user = _context7.sent;


                        _BAPLive2.default.io.sockets.emit('on-like-room', (0, _ResponseUtil.dataResponse)({ user: user, roomId: roomId, likeCount: likeCount }));

                    case 27:
                    case "end":
                        return _context7.stop();
                }
            }
        }, _callee7, undefined);
    }));

    return function likeRoom(_x19, _x20, _x21) {
        return _ref7.apply(this, arguments);
    };
}();