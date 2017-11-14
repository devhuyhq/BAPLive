export const messageSchema = {
    name: 'Message',
    properties: {
        id: '_id',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        deletedAt: 'deletedAt',
        createdBy: 'createdBy',
        content: 'content',
        type: 'type',
    }
};