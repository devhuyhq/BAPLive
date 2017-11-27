import BAPLive from "../BAPLive";

export const stampSchema = {
    name: 'Stamp',
    properties: {
        id: '_id',
        content: 'content',
        userId: 'userId',
        roomId: 'roomId',
        createAt: 'createAt',
        updateAt: 'updateAt',
    }
};

const getSchemaName = () => {
    return BAPLive.config.stampSchema.name;
};

const getIdField = () => {
    return BAPLive.config.stampSchema.properties.id;
};

const getUserIdField = () => {
    return BAPLive.config.stampSchema.properties.userId;
};


const getRoomIdField = () => {
    return BAPLive.config.stampSchema.properties.roomId;
};

const getCreateAtField = () => {
    return BAPLive.config.stampSchema.properties.createAt;
};

const getUpdateAtField = () => {
    return BAPLive.config.stampSchema.properties.updateAt;
};

const getContentField = () => {
    return BAPLive.config.stampSchema.properties.content;
};


export default {
    getSchemaName,
    getIdField,
    getCreateAtField,
    getUpdateAtField,
    getContentField,
    getRoomIdField,
    getUserIdField
}