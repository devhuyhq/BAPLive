"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getProfile = exports.signUp = exports.signIn = undefined;

var _BAPLive = require("../BAPLive");

var _BAPLive2 = _interopRequireDefault(_BAPLive);

var _UserSchema = require("../schema/UserSchema");

var _UserSchema2 = _interopRequireDefault(_UserSchema);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _Config = require("../Config");

var _ResponseUtil = require("../util/ResponseUtil");

var _MessageSchema = require("../schema/MessageSchema");

var _MessageSchema2 = _interopRequireDefault(_MessageSchema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var signIn = exports.signIn = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(socket, data, ack) {
        var email, password, user, token;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        email = data.email, password = data.password;
                        _context.next = 3;
                        return _BAPLive2.default.database.collection(_UserSchema2.default.getSchemaName()).findOne({ email: email, password: password });

                    case 3:
                        user = _context.sent;

                        if (user) {
                            token = _jsonwebtoken2.default.sign({ user: user }, _Config.JWT_SECRET_KEY);

                            (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.dataResponse)(token));
                        } else {
                            (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.errorResponse)(69, 'wrong_credential'));
                        }

                    case 5:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function signIn(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
}();

var signUp = exports.signUp = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(socket, data, ack) {
        var email, password, user, result, savedUser, token;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        email = data.email, password = data.password;
                        user = {
                            email: email,
                            password: password
                        };
                        _context2.next = 4;
                        return _BAPLive2.default.database.collection(_UserSchema2.default.getSchemaName()).insertOne(user);

                    case 4:
                        result = _context2.sent;
                        _context2.next = 7;
                        return _BAPLive2.default.database.collection(_UserSchema2.default.getSchemaName()).findOne({ email: email, password: password });

                    case 7:
                        savedUser = _context2.sent;

                        if (savedUser) {
                            token = _jsonwebtoken2.default.sign({ user: savedUser }, _Config.JWT_SECRET_KEY);

                            (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.dataResponse)(token));
                        } else {
                            (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.errorResponse)(69, 'wrong_credential'));
                        }

                    case 9:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function signUp(_x4, _x5, _x6) {
        return _ref2.apply(this, arguments);
    };
}();

var getProfile = exports.getProfile = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(socket, data, ack) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.dataResponse)(socket.user));

                    case 1:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function getProfile(_x7, _x8, _x9) {
        return _ref3.apply(this, arguments);
    };
}();