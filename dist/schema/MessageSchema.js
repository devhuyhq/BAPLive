'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.messageSchema = undefined;

var _BAPLive = require('../BAPLive');

var _BAPLive2 = _interopRequireDefault(_BAPLive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var messageSchema = exports.messageSchema = {
    name: 'Message',
    properties: {
        id: '_id',
        content: 'content',
        userId: 'userId',
        roomId: 'roomId',
        createAt: 'createAt',
        updateAt: 'updateAt'
    }
};

var getSchemaName = function getSchemaName() {
    return _BAPLive2.default.config.messageSchema.name;
};

var getIdField = function getIdField() {
    return _BAPLive2.default.config.messageSchema.properties.id;
};

var getUserIdField = function getUserIdField() {
    return _BAPLive2.default.config.messageSchema.properties.userId;
};

var getRoomIdField = function getRoomIdField() {
    return _BAPLive2.default.config.messageSchema.properties.roomId;
};

var getCreateAtField = function getCreateAtField() {
    return _BAPLive2.default.config.messageSchema.properties.createAt;
};

var getUpdateAtField = function getUpdateAtField() {
    return _BAPLive2.default.config.messageSchema.properties.updateAt;
};

var getContentField = function getContentField() {
    return _BAPLive2.default.config.messageSchema.properties.content;
};

exports.default = {
    getSchemaName: getSchemaName,
    getIdField: getIdField,
    getCreateAtField: getCreateAtField,
    getUpdateAtField: getUpdateAtField,
    getContentField: getContentField,
    getRoomIdField: getRoomIdField,
    getUserIdField: getUserIdField
};