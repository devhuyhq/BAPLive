import BAPLive from "../BAPLive";

export const likeSchema = {
    name: 'Like',
    properties: {
        id: '_id',
        userId: 'userId',
        roomId: 'roomId',
        createAt: 'createAt',
        updateAt: 'updateAt',
    }
};


const getSchemaName = () => {
    return BAPLive.config.likeSchema.name;
};

const getIdField = () => {
    return BAPLive.config.likeSchema.properties.id;
};

const getUserIdField = () => {
    return BAPLive.config.likeSchema.properties.userId;
};


const getRoomIdField = () => {
    return BAPLive.config.likeSchema.properties.roomId;
};

const getCreateAtField = () => {
    return BAPLive.config.likeSchema.properties.createAt;
};

const getUpdateAtField = () => {
    return BAPLive.config.likeSchema.properties.updateAt;
};

export default {
    getSchemaName,
    getIdField,
    getCreateAtField,
    getUpdateAtField,
    getRoomIdField,
    getUserIdField
}