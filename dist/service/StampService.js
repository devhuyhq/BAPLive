"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getStamps = exports.sendStamp = undefined;

var _BAPLive = require("../BAPLive");

var _BAPLive2 = _interopRequireDefault(_BAPLive);

var _UserSchema = require("../schema/UserSchema");

var _UserSchema2 = _interopRequireDefault(_UserSchema);

var _ResponseUtil = require("../util/ResponseUtil");

var _RoomSchema = require("../schema/RoomSchema");

var _RoomSchema2 = _interopRequireDefault(_RoomSchema);

var _MessageSchema = require("../schema/MessageSchema");

var _MessageSchema2 = _interopRequireDefault(_MessageSchema);

var _StampSchema = require("../schema/StampSchema");

var _StampSchema2 = _interopRequireDefault(_StampSchema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var ObjectID = require('mongodb').ObjectID;

var sendStamp = exports.sendStamp = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(socket, data, ack) {
        var _stamp;

        var roomId, content, room, now, stamp, result, savedStamp, user;
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
                        stamp = (_stamp = {}, _defineProperty(_stamp, _StampSchema2.default.getRoomIdField(), new ObjectID(roomId)), _defineProperty(_stamp, _StampSchema2.default.getUserIdField(), new ObjectID(socket.user[_UserSchema2.default.getIdField()])), _defineProperty(_stamp, _StampSchema2.default.getContentField(), content), _defineProperty(_stamp, _StampSchema2.default.getUpdateAtField(), now), _defineProperty(_stamp, _StampSchema2.default.getCreateAtField(), now), _stamp);
                        _context.next = 12;
                        return _BAPLive2.default.database.collection(_StampSchema2.default.getSchemaName()).insertOne(stamp);

                    case 12:
                        result = _context.sent;
                        _context.next = 15;
                        return _BAPLive2.default.database.collection(_StampSchema2.default.getSchemaName()).findOne(_defineProperty({}, _StampSchema2.default.getIdField(), new ObjectID(result.insertedId)));

                    case 15:
                        savedStamp = _context.sent;
                        _context.next = 18;
                        return _BAPLive2.default.database.collection(_UserSchema2.default.getSchemaName()).findOne(_defineProperty({}, _UserSchema2.default.getIdField(), new ObjectID(socket.user[_UserSchema2.default.getIdField()])), _defineProperty({}, _UserSchema2.default.getPasswordField(), 0));

                    case 18:
                        user = _context.sent;

                        savedStamp[_UserSchema2.default.getSchemaName()] = user;
                        (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.dataResponse)(savedStamp));
                        socket.to(roomId).emit('on-stamp', (0, _ResponseUtil.dataResponse)(savedStamp));

                    case 22:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function sendStamp(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
}();

var getStamps = exports.getStamps = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(socket, data, ack) {
        var roomId, query, _$project;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        roomId = data.roomId;

                        if (roomId) {
                            _context2.next = 3;
                            break;
                        }

                        return _context2.abrupt("return", (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.errorResponse)(400, 'bad_request')));

                    case 3:
                        query = _defineProperty({}, _StampSchema2.default.getRoomIdField(), new ObjectID(roomId));

                        try {
                            _BAPLive2.default.database.collection(_StampSchema2.default.getSchemaName()).aggregate([{
                                $match: query
                            }, {
                                $lookup: {
                                    from: _UserSchema2.default.getSchemaName(),
                                    localField: _StampSchema2.default.getUserIdField(),
                                    foreignField: _UserSchema2.default.getIdField(),
                                    as: _UserSchema2.default.getSchemaName()
                                }
                            }, { $unwind: "$" + _UserSchema2.default.getSchemaName() }, {
                                $project: (_$project = {}, _defineProperty(_$project, _StampSchema2.default.getUserIdField(), 1), _defineProperty(_$project, _StampSchema2.default.getUpdateAtField(), 1), _defineProperty(_$project, _StampSchema2.default.getCreateAtField(), 1), _defineProperty(_$project, _StampSchema2.default.getRoomIdField(), 1), _defineProperty(_$project, _StampSchema2.default.getContentField(), 1), _defineProperty(_$project, _UserSchema2.default.getSchemaName(), _defineProperty({}, _UserSchema2.default.getEmailField(), 1)), _$project)
                            }, {
                                $sort: _defineProperty({}, _StampSchema2.default.getUpdateAtField(), -1)
                            }, {
                                $limit: 20
                            }, {
                                $sort: _defineProperty({}, _StampSchema2.default.getUpdateAtField(), 1)
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

    return function getStamps(_x4, _x5, _x6) {
        return _ref2.apply(this, arguments);
    };
}();