"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.typing = exports.getMessages = exports.sendMessage = undefined;

var _BAPLive = require("../BAPLive");

var _BAPLive2 = _interopRequireDefault(_BAPLive);

var _UserSchema = require("../schema/UserSchema");

var _UserSchema2 = _interopRequireDefault(_UserSchema);

var _ResponseUtil = require("../util/ResponseUtil");

var _RoomSchema = require("../schema/RoomSchema");

var _RoomSchema2 = _interopRequireDefault(_RoomSchema);

var _MessageSchema = require("../schema/MessageSchema");

var _MessageSchema2 = _interopRequireDefault(_MessageSchema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var ObjectID = require('mongodb').ObjectID;

var sendMessage = exports.sendMessage = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(socket, data, ack) {
        var _message;

        var roomId, content, room, now, message, result, savedMessage, user;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        roomId = data.roomId, content = data.content;

                        if (!(!roomId || !content)) {
                            _context.next = 3;
                            break;
                        }

                        return _context.abrupt("return", (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.errorResponse)(400, 'bad_request')));

                    case 3:
                        _context.next = 5;
                        return _BAPLive2.default.database.collection(_RoomSchema2.default.getSchemaName()).findOne(_defineProperty({}, _RoomSchema2.default.getIdField(), new ObjectID(roomId)));

                    case 5:
                        room = _context.sent;

                        if (room) {
                            _context.next = 8;
                            break;
                        }

                        return _context.abrupt("return", (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.errorResponse)(400, 'room_not_found')));

                    case 8:
                        now = new Date();
                        message = (_message = {}, _defineProperty(_message, _MessageSchema2.default.getRoomIdField(), new ObjectID(roomId)), _defineProperty(_message, _MessageSchema2.default.getUserIdField(), new ObjectID(socket.user[_UserSchema2.default.getIdField()])), _defineProperty(_message, _MessageSchema2.default.getContentField(), content), _defineProperty(_message, _MessageSchema2.default.getUpdateAtField(), now), _defineProperty(_message, _MessageSchema2.default.getCreateAtField(), now), _message);
                        _context.next = 12;
                        return _BAPLive2.default.database.collection(_MessageSchema2.default.getSchemaName()).insertOne(message);

                    case 12:
                        result = _context.sent;
                        _context.next = 15;
                        return _BAPLive2.default.database.collection(_MessageSchema2.default.getSchemaName()).findOne(_defineProperty({}, _MessageSchema2.default.getIdField(), new ObjectID(result.insertedId)));

                    case 15:
                        savedMessage = _context.sent;
                        _context.next = 18;
                        return _BAPLive2.default.database.collection(_UserSchema2.default.getSchemaName()).findOne(_defineProperty({}, _UserSchema2.default.getIdField(), new ObjectID(socket.user[_UserSchema2.default.getIdField()])), _defineProperty({}, _UserSchema2.default.getPasswordField(), 0));

                    case 18:
                        user = _context.sent;

                        savedMessage.user = user;
                        (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.dataResponse)(savedMessage));
                        socket.to(roomId).emit('on-message', (0, _ResponseUtil.dataResponse)(savedMessage));

                    case 22:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function sendMessage(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
}();

var getMessages = exports.getMessages = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(socket, data, ack) {
        var _ref3;

        var dateTime, roomId, query, _$project;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        dateTime = data.dateTime, roomId = data.roomId;

                        if (roomId) {
                            _context2.next = 3;
                            break;
                        }

                        return _context2.abrupt("return", (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.errorResponse)(400, 'bad_request')));

                    case 3:
                        query = dateTime ? (_ref3 = {}, _defineProperty(_ref3, _MessageSchema2.default.getUpdateAtField(), {
                            $lt: new Date(dateTime)

                        }), _defineProperty(_ref3, _MessageSchema2.default.getRoomIdField(), new ObjectID(roomId)), _ref3) : _defineProperty({}, _MessageSchema2.default.getRoomIdField(), new ObjectID(roomId));

                        try {
                            _BAPLive2.default.database.collection(_MessageSchema2.default.getSchemaName()).aggregate([{
                                $match: query
                            }, {
                                $lookup: {
                                    from: _UserSchema2.default.getSchemaName(),
                                    localField: _MessageSchema2.default.getUserIdField(),
                                    foreignField: _UserSchema2.default.getIdField(),
                                    as: 'user'
                                }
                            }, { $unwind: "$user" }, {
                                $project: (_$project = {}, _defineProperty(_$project, _MessageSchema2.default.getUserIdField(), 1), _defineProperty(_$project, _MessageSchema2.default.getUpdateAtField(), 1), _defineProperty(_$project, _MessageSchema2.default.getCreateAtField(), 1), _defineProperty(_$project, _MessageSchema2.default.getRoomIdField(), 1), _defineProperty(_$project, _MessageSchema2.default.getContentField(), 1), _defineProperty(_$project, "user", _defineProperty({}, _UserSchema2.default.getEmailField(), 1)), _$project)
                            }, {
                                $sort: _defineProperty({}, _MessageSchema2.default.getUpdateAtField(), -1)
                            }, {
                                $limit: 20
                            }, {
                                $sort: _defineProperty({}, _MessageSchema2.default.getUpdateAtField(), 1)
                            }], function (err, res) {
                                if (err) throw err;
                                (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.dataResponse)(res));
                            });
                        } catch (err) {
                            (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.serverError)());
                        }

                    case 5:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function getMessages(_x4, _x5, _x6) {
        return _ref2.apply(this, arguments);
    };
}();

var typing = exports.typing = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(socket, data, ack) {
        var roomId, status, user, result;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        roomId = data.roomId, status = data.status;
                        user = void 0;

                        if (!socket.user) {
                            _context3.next = 6;
                            break;
                        }

                        _context3.next = 5;
                        return _BAPLive2.default.database.collection(_UserSchema2.default.getSchemaName()).findOne(_defineProperty({}, _UserSchema2.default.getIdField(), new ObjectID(socket.user[_UserSchema2.default.getIdField()])), _defineProperty({}, _UserSchema2.default.getPasswordField(), 0));

                    case 5:
                        user = _context3.sent;

                    case 6:
                        result = {
                            user: user,
                            room: {
                                _id: roomId
                            },
                            status: status
                        };

                        socket.to(roomId).emit('on-typing', (0, _ResponseUtil.dataResponse)(result));

                    case 8:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function typing(_x7, _x8, _x9) {
        return _ref5.apply(this, arguments);
    };
}();