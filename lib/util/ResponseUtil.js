export const serverError = () => {
    return {
        status: 500,
        message: 'server_error',
    }
};

export const dataResponse = (data) => {
    return {
        status: 0,
        data: data,
    }
};

export const errorResponse = (status, message) => {
    return {
        status,
        message
    }
};