'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.userSchema = undefined;

var _BAPLive = require('../BAPLive');

var _BAPLive2 = _interopRequireDefault(_BAPLive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userSchema = exports.userSchema = {
    name: 'User',
    properties: {
        id: '_id',
        username: 'username',
        email: 'email',
        password: 'password',
        avatar: 'avatar',
        deviceToken: 'deviceToken',
        createAt: 'createAt',
        updateAt: 'updateAt',
        phone: 'phone',
        gender: 'gender'
    }
};

var getSchemaName = function getSchemaName() {
    return _BAPLive2.default.config.userSchema.name;
};

var getIdField = function getIdField() {
    return _BAPLive2.default.config.userSchema.properties.id;
};

var getUsernameField = function getUsernameField() {
    return _BAPLive2.default.config.userSchema.properties.username;
};

var getEmailField = function getEmailField() {
    return _BAPLive2.default.config.userSchema.properties.email;
};

var getPasswordField = function getPasswordField() {
    return _BAPLive2.default.config.userSchema.properties.password;
};

exports.default = {
    getSchemaName: getSchemaName,
    getIdField: getIdField,
    getUsernameField: getUsernameField,
    getEmailField: getEmailField,
    getPasswordField: getPasswordField
};