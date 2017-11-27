'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.likeSchema = undefined;

var _BAPLive = require('../BAPLive');

var _BAPLive2 = _interopRequireDefault(_BAPLive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var likeSchema = exports.likeSchema = {
    name: 'Like',
    properties: {
        id: '_id',
        userId: 'userId',
        roomId: 'roomId',
        createAt: 'createAt',
        updateAt: 'updateAt'
    }
};

var getSchemaName = function getSchemaName() {
    return _BAPLive2.default.config.likeSchema.name;
};

var getIdField = function getIdField() {
    return _BAPLive2.default.config.likeSchema.properties.id;
};

var getUserIdField = function getUserIdField() {
    return _BAPLive2.default.config.likeSchema.properties.userId;
};

var getRoomIdField = function getRoomIdField() {
    return _BAPLive2.default.config.likeSchema.properties.roomId;
};

var getCreateAtField = function getCreateAtField() {
    return _BAPLive2.default.config.likeSchema.properties.createAt;
};

var getUpdateAtField = function getUpdateAtField() {
    return _BAPLive2.default.config.likeSchema.properties.updateAt;
};

exports.default = {
    getSchemaName: getSchemaName,
    getIdField: getIdField,
    getCreateAtField: getCreateAtField,
    getUpdateAtField: getUpdateAtField,
    getRoomIdField: getRoomIdField,
    getUserIdField: getUserIdField
};