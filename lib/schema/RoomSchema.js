import BAPLive from "../BAPLive";

export const roomSchema = {
    name: 'Room',
    properties: {
        id: '_id',
        roomName: 'roomName',
        url: 'url',
        image: 'image',
        status: 'status',
        admin: 'adminId',
        createAt: 'createAt',
        updateAt: 'updateAt',
    }
};

const getSchemaName = () => {
    return BAPLive.config.roomSchema.name;
};

const getIdField = () => {
    return BAPLive.config.roomSchema.properties.id;
};

const getRoomNameField = () => {
    return BAPLive.config.roomSchema.properties.roomName;
};

const getUrlField = () => {
    return BAPLive.config.roomSchema.properties.url;
};

const getImageField = () => {
    return BAPLive.config.roomSchema.properties.image;
};

const getAdminField = () => {
    return BAPLive.config.roomSchema.properties.admin;
};

const getCreateAtField = () => {
    return BAPLive.config.roomSchema.properties.createAt;
};

const getUpdateAtField = () => {
    return BAPLive.config.roomSchema.properties.updateAt;
};

const getStatusField = () => {
    return BAPLive.config.roomSchema.properties.status;
};


export default {
    getSchemaName,
    getIdField,
    getRoomNameField,
    getUrlField,
    getImageField,
    getAdminField,
    getCreateAtField,
    getUpdateAtField,
    getStatusField
}