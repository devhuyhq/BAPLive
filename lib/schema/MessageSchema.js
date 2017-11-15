import BAPLive from "../BAPLive";

export const messageSchema = {
    name: 'Message',
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
    return BAPLive.config.messageSchema.name;
};

const getIdField = () => {
    return BAPLive.config.messageSchema.properties.id;
};

const getUserIdField = () => {
    return BAPLive.config.messageSchema.properties.userId;
};


const getRoomIdField = () => {
    return BAPLive.config.messageSchema.properties.roomId;
};

const getCreateAtField = () => {
    return BAPLive.config.messageSchema.properties.createAt;
};

const getUpdateAtField = () => {
    return BAPLive.config.messageSchema.properties.updateAt;
};

const getContentField = () => {
    return BAPLive.config.messageSchema.properties.content;
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