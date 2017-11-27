'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var serverError = exports.serverError = function serverError() {
    return {
        status: 500,
        message: 'server_error'
    };
};

var dataResponse = exports.dataResponse = function dataResponse(data) {
    return {
        status: 0,
        data: data
    };
};

var errorResponse = exports.errorResponse = function errorResponse(status, message) {
    return {
        status: status,
        message: message
    };
};

var sendAck = exports.sendAck = function sendAck(ack, data) {
    if (ack && typeof ack === 'function') ack(data);
};