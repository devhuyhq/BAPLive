import BAPLive from "../BAPLive";

export const userSchema = {
    name: 'User',
    properties: {
        id: '_id',
        email: 'email',
        password: 'password',
        username: 'username',
    }
};

const getSchemaName = () => {
    return BAPLive.config.userSchema.name;
};

export default {
    getSchemaName
}