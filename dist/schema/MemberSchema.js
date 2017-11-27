'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.memberSchema = undefined;

var _BAPLive = require('../BAPLive');

var _BAPLive2 = _interopRequireDefault(_BAPLive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var memberSchema = exports.memberSchema = {
    name: 'Member',
    properties: {
        id: '_id',
        userId: 'userId',
        roomId: 'roomId',
        createAt: 'createAt',
        updateAt: 'updateAt',
        status: 'status',
        deviceId: 'deviceId'
    }
};

var getSchemaName = function getSchemaName() {
    return _BAPLive2.default.config.memberSchema.name;
};

var getIdField = function getIdField() {
    return _BAPLive2.default.config.memberSchema.properties.id;
};

var getUserIdField = function getUserIdField() {
    return _BAPLive2.default.config.memberSchema.properties.userId;
};

var getRoomIdField = function getRoomIdField() {
    return _BAPLive2.default.config.memberSchema.properties.roomId;
};

var getCreateAtField = function getCreateAtField() {
    return _BAPLive2.default.config.memberSchema.properties.createAt;
};

var getUpdateAtField = function getUpdateAtField() {
    return _BAPLive2.default.config.memberSchema.properties.updateAt;
};

var getStatusField = function getStatusField() {
    return _BAPLive2.default.config.memberSchema.properties.status;
};

var getDeviceIdField = function getDeviceIdField() {
    return _BAPLive2.default.config.memberSchema.properties.deviceId;
};

exports.default = {
    getSchemaName: getSchemaName,
    getIdField: getIdField,
    getCreateAtField: getCreateAtField,
    getUpdateAtField: getUpdateAtField,
    getStatusField: getStatusField,
    getDeviceIdField: getDeviceIdField,
    getRoomIdField: getRoomIdField,
    getUserIdField: getUserIdField
};