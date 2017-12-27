"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mongodb = require("mongodb");

var _UserSchema = require("./schema/UserSchema");

var _RoomSchema = require("./schema/RoomSchema");

var _MessageSchema = require("./schema/MessageSchema");

var _LikeSchema = require("./schema/LikeSchema");

var _AuthService = require("./service/AuthService");

var _RoomService = require("./service/RoomService");

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _Config = require("./Config");

var _ResponseUtil = require("./util/ResponseUtil");

var _MemberSchema = require("./schema/MemberSchema");

var _MessageService = require("./service/MessageService");

var _StampSchema = require("./schema/StampSchema");

var _StampService = require("./service/StampService");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SECURED_EVENTS = ['check-authentication', 'create-room', 'like-room', 'change-status', 'send-message', 'send-stamp', 'get-profile'];

var BAPLive = function () {
    function BAPLive() {
        _classCallCheck(this, BAPLive);
    }

    _createClass(BAPLive, null, [{
        key: "init",
        value: function init(databaseUrl, io, config, key, streamUrl) {
            var _this = this;

            _mongodb.MongoClient.connect(databaseUrl, function (err, db) {
                _this.database = db;
            });
            this.jwtKey = key;
            this.databaseUrl = databaseUrl;
            if (streamUrl) {
                this.streamUrl = streamUrl;
            }

            if (config) {
                if (config.userSchema) {
                    this.config.userSchema = _extends({}, this.config.userSchema, config.userSchema);
                }
                if (config.roomSchema) {
                    this.config.roomSchema = _extends({}, this.config.roomSchema, config.roomSchema);
                }
                if (config.messageSchema) {
                    this.config.messageSchema = _extends({}, this.config.messageSchema, config.messageSchema);
                }
                if (config.likeSchema) {
                    this.config.likeSchema = _extends({}, this.config.likeSchema, config.likeSchema);
                }
                if (config.memberSchema) {
                    this.config.memberSchema = _extends({}, this.config.memberSchema, config.memberSchema);
                }
                if (config.stampSchema) {
                    this.config.stampSchema = _extends({}, this.config.stampSchema, config.stampSchema);
                }
            }

            if (io) {
                this.io = io;

                io.use(function (socket, next) {
                    var token = socket.request.headers && socket.request.headers.token;

                    if (token) {
                        try {
                            var decoded = _jsonwebtoken2.default.verify(token, _Config.JWT_SECRET_KEY);
                            if (decoded && decoded.user) {
                                socket.user = decoded.user;
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    }
                    next();
                });

                io.on('connection', function (socket) {
                    var _this2 = this;

                    socket.use(function (packet, next) {
                        var event = packet[0];
                        var ack = packet[packet.length - 1];
                        var user = socket.user;
                        if (SECURED_EVENTS.indexOf(event) > -1) {
                            if (!user) {
                                (0, _ResponseUtil.sendAck)(ack, (0, _ResponseUtil.errorResponse)(401, 'wrong_credential'));
                            }
                        }
                        return next();
                    });

                    socket.on('create-room', function (data, ack) {
                        (0, _RoomService.createRoom)(socket, data, ack);
                    });
                    socket.on('leave-room', function (data, ack) {
                        (0, _RoomService.leaveRoom)(socket, data, ack);
                    });
                    socket.on('join-room', function (data, ack) {
                        (0, _RoomService.joinRoom)(socket, data, ack);
                    });
                    socket.on('like-room', function (data, ack) {
                        (0, _RoomService.likeRoom)(socket, data, ack);
                    });
                    socket.on('list-room', function (data, ack) {
                        (0, _RoomService.getListRoom)(socket, data, ack);
                    });
                    socket.on('sign-in', function () {
                        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data, ack) {
                            return regeneratorRuntime.wrap(function _callee$(_context) {
                                while (1) {
                                    switch (_context.prev = _context.next) {
                                        case 0:
                                            (0, _AuthService.signIn)(socket, data, ack);

                                        case 1:
                                        case "end":
                                            return _context.stop();
                                    }
                                }
                            }, _callee, _this2);
                        }));

                        return function (_x, _x2) {
                            return _ref.apply(this, arguments);
                        };
                    }());
                    socket.on('sign-up', function () {
                        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data, ack) {
                            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                while (1) {
                                    switch (_context2.prev = _context2.next) {
                                        case 0:
                                            (0, _AuthService.signUp)(socket, data, ack);

                                        case 1:
                                        case "end":
                                            return _context2.stop();
                                    }
                                }
                            }, _callee2, _this2);
                        }));

                        return function (_x3, _x4) {
                            return _ref2.apply(this, arguments);
                        };
                    }());
                    socket.on('change-status', function () {
                        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(data, ack) {
                            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                while (1) {
                                    switch (_context3.prev = _context3.next) {
                                        case 0:
                                            (0, _RoomService.changeStatus)(socket, data, ack);

                                        case 1:
                                        case "end":
                                            return _context3.stop();
                                    }
                                }
                            }, _callee3, _this2);
                        }));

                        return function (_x5, _x6) {
                            return _ref3.apply(this, arguments);
                        };
                    }());
                    socket.on('get-room-info', function () {
                        var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(data, ack) {
                            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                while (1) {
                                    switch (_context4.prev = _context4.next) {
                                        case 0:
                                            (0, _RoomService.getRoomInfo)(socket, data, ack);

                                        case 1:
                                        case "end":
                                            return _context4.stop();
                                    }
                                }
                            }, _callee4, _this2);
                        }));

                        return function (_x7, _x8) {
                            return _ref4.apply(this, arguments);
                        };
                    }());
                    socket.on('send-message', function () {
                        var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(data, ack) {
                            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                                while (1) {
                                    switch (_context5.prev = _context5.next) {
                                        case 0:
                                            (0, _MessageService.sendMessage)(socket, data, ack);

                                        case 1:
                                        case "end":
                                            return _context5.stop();
                                    }
                                }
                            }, _callee5, _this2);
                        }));

                        return function (_x9, _x10) {
                            return _ref5.apply(this, arguments);
                        };
                    }());
                    socket.on('get-message', function () {
                        var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(data, ack) {
                            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                                while (1) {
                                    switch (_context6.prev = _context6.next) {
                                        case 0:
                                            (0, _MessageService.getMessages)(socket, data, ack);

                                        case 1:
                                        case "end":
                                            return _context6.stop();
                                    }
                                }
                            }, _callee6, _this2);
                        }));

                        return function (_x11, _x12) {
                            return _ref6.apply(this, arguments);
                        };
                    }());
                    socket.on('send-stamp', function () {
                        var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(data, ack) {
                            return regeneratorRuntime.wrap(function _callee7$(_context7) {
                                while (1) {
                                    switch (_context7.prev = _context7.next) {
                                        case 0:
                                            (0, _StampService.sendStamp)(socket, data, ack);

                                        case 1:
                                        case "end":
                                            return _context7.stop();
                                    }
                                }
                            }, _callee7, _this2);
                        }));

                        return function (_x13, _x14) {
                            return _ref7.apply(this, arguments);
                        };
                    }());
                    socket.on('get-stamp', function () {
                        var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(data, ack) {
                            return regeneratorRuntime.wrap(function _callee8$(_context8) {
                                while (1) {
                                    switch (_context8.prev = _context8.next) {
                                        case 0:
                                            (0, _StampService.getStamps)(socket, data, ack);

                                        case 1:
                                        case "end":
                                            return _context8.stop();
                                    }
                                }
                            }, _callee8, _this2);
                        }));

                        return function (_x15, _x16) {
                            return _ref8.apply(this, arguments);
                        };
                    }());
                    socket.on('get-profile', function () {
                        var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(data, ack) {
                            return regeneratorRuntime.wrap(function _callee9$(_context9) {
                                while (1) {
                                    switch (_context9.prev = _context9.next) {
                                        case 0:
                                            (0, _AuthService.getProfile)(socket, data, ack);

                                        case 1:
                                        case "end":
                                            return _context9.stop();
                                    }
                                }
                            }, _callee9, _this2);
                        }));

                        return function (_x17, _x18) {
                            return _ref9.apply(this, arguments);
                        };
                    }());
                    socket.on('typing', function () {
                        var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(data, ack) {
                            return regeneratorRuntime.wrap(function _callee10$(_context10) {
                                while (1) {
                                    switch (_context10.prev = _context10.next) {
                                        case 0:
                                            (0, _MessageService.typing)(socket, data, ack);

                                        case 1:
                                        case "end":
                                            return _context10.stop();
                                    }
                                }
                            }, _callee10, _this2);
                        }));

                        return function (_x19, _x20) {
                            return _ref10.apply(this, arguments);
                        };
                    }());
                    socket.on('check-authentication', function (data, ack) {
                        (0, _AuthService.authentication)(socket, data, ack);
                    });
                });
            }
        }
    }]);

    return BAPLive;
}();

BAPLive.streamUrl = 'rtmp://172.16.1.0:1935/live';
BAPLive.config = {
    userSchema: _UserSchema.userSchema,
    roomSchema: _RoomSchema.roomSchema,
    messageSchema: _MessageSchema.messageSchema,
    likeSchema: _LikeSchema.likeSchema,
    memberSchema: _MemberSchema.memberSchema,
    stampSchema: _StampSchema.stampSchema
};
exports.default = BAPLive;