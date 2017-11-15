import BAPLive from "../BAPLive";

export const memberSchema = {
    name: 'Member',
    properties: {
        id: '_id',
        userId: 'userId',
        roomId: 'roomId',
        createAt: 'createAt',
        updateAt: 'updateAt',
        status: 'status',
        deviceId: 'deviceId',
    }
};

const getSchemaName = () => {
    return BAPLive.config.memberSchema.name;
};

const getIdField = () => {
    return BAPLive.config.memberSchema.properties.id;
};

const getUserIdField = () => {
    return BAPLive.config.memberSchema.properties.userId;
};


const getRoomIdField = () => {
    return BAPLive.config.memberSchema.properties.roomId;
};

const getCreateAtField = () => {
    return BAPLive.config.memberSchema.properties.createAt;
};

const getUpdateAtField = () => {
    return BAPLive.config.memberSchema.properties.updateAt;
};

const getStatusField = () => {
    return BAPLive.config.memberSchema.properties.status;
};

const getDeviceIdField = () => {
    return BAPLive.config.memberSchema.properties.deviceId;
};


export default {
    getSchemaName,
    getIdField,
    getCreateAtField,
    getUpdateAtField,
    getStatusField,
    getDeviceIdField,
    getRoomIdField,
    getUserIdField
}