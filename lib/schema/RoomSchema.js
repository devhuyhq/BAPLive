import BAPLive from "../BAPLive";

export const roomSchema = {
    name: 'Room',
    properties: {
        id: '_id',
        name: 'name',
        publishedAt: 'publishedAt',
        publishedBy: 'publishedBy',
    }
};

export const getSchemaName = () => {
    return BAPLive.config.roomSchema.name;
};

export const getIdField = () => {
    return BAPLive.config.roomSchema.properties.id;
};

export const getNameField = () => {
    return BAPLive.config.roomSchema.properties.name;
};

export const getPublishedAtField = () => {
    return BAPLive.config.roomSchema.properties.publishedAt;
};

export const getPublishedByField = () => {
    return BAPLive.config.roomSchema.properties.publishedBy;
};

export default {
    getSchemaName,
    getIdField,
    getNameField,
    getPublishedAtField,
    getPublishedByField
}