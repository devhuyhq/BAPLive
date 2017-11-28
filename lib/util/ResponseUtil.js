export const serverError = () => {
    console.log({
        status: 500,
        message: 'server_error',
    });
    return {
        status: 500,
        message: 'server_error',
    }
};

export const dataResponse = (data) => {
    console.log({
        status: 0,
        data: data,
    });
    return {
        status: 0,
        data: data,
    }
};

export const errorResponse = (status, message) => {
    console.log({
        status,
        message
    });
    return {
        status,
        message
    }
};

export const sendAck = (ack, data) => {
    if (ack && typeof ack === 'function') ack(data);
};