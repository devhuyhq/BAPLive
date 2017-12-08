'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.roomSchema = undefined;

var _BAPLive = require('../BAPLive');

var _BAPLive2 = _interopRequireDefault(_BAPLive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var roomSchema = exports.roomSchema = {
    name: 'Room',
    properties: {
        id: '_id',
        roomName: 'roomName',
        url: 'url',
        image: 'image',
        status: 'status',
        admin: 'adminId',
        createAt: 'createAt',
        updateAt: 'updateAt'
    }
};

var getSchemaName = function getSchemaName() {
    return _BAPLive2.default.config.roomSchema.name;
};

var getIdField = function getIdField() {
    return _BAPLive2.default.config.roomSchema.properties.id;
};

var getRoomNameField = function getRoomNameField() {
    return _BAPLive2.default.config.roomSchema.properties.roomName;
};

var getUrlField = function getUrlField() {
    return _BAPLive2.default.config.roomSchema.properties.url;
};

var getImageField = function getImageField() {
    return _BAPLive2.default.config.roomSchema.properties.image;
};

var getAdminField = function getAdminField() {
    return _BAPLive2.default.config.roomSchema.properties.admin;
};

var getCreateAtField = function getCreateAtField() {
    return _BAPLive2.default.config.roomSchema.properties.createAt;
};

var getUpdateAtField = function getUpdateAtField() {
    return _BAPLive2.default.config.roomSchema.properties.updateAt;
};

var getStatusField = function getStatusField() {
    return _BAPLive2.default.config.roomSchema.properties.status;
};

exports.default = {
    getSchemaName: getSchemaName,
    getIdField: getIdField,
    getRoomNameField: getRoomNameField,
    getUrlField: getUrlField,
    getImageField: getImageField,
    getAdminField: getAdminField,
    getCreateAtField: getCreateAtField,
    getUpdateAtField: getUpdateAtField,
    getStatusField: getStatusField
};