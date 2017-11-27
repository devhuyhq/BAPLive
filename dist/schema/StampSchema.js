'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.stampSchema = undefined;

var _BAPLive = require('../BAPLive');

var _BAPLive2 = _interopRequireDefault(_BAPLive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stampSchema = exports.stampSchema = {
    name: 'Stamp',
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
    return _BAPLive2.default.config.stampSchema.name;
};

var getIdField = function getIdField() {
    return _BAPLive2.default.config.stampSchema.properties.id;
};

var getUserIdField = function getUserIdField() {
    return _BAPLive2.default.config.stampSchema.properties.userId;
};

var getRoomIdField = function getRoomIdField() {
    return _BAPLive2.default.config.stampSchema.properties.roomId;
};

var getCreateAtField = function getCreateAtField() {
    return _BAPLive2.default.config.stampSchema.properties.createAt;
};

var getUpdateAtField = function getUpdateAtField() {
    return _BAPLive2.default.config.stampSchema.properties.updateAt;
};

var getContentField = function getContentField() {
    return _BAPLive2.default.config.stampSchema.properties.content;
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