import BAPLive from "../BAPLive";

export const userSchema = {
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
        gender: 'gender',
    }
};



const getSchemaName = () => {
    return BAPLive.config.userSchema.name;
};

const getIdField = () => {
    return BAPLive.config.userSchema.id;
};

const getUsernameField = () => {
    return BAPLive.config.userSchema.username;
};

const getEmailField = () => {
    return BAPLive.config.userSchema.email;
};

const getPasswordField = () => {
    return BAPLive.config.userSchema.password;
};



export default {
    getSchemaName
}