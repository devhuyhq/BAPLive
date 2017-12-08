# API Docs

## Models

## Checklist

Emit
---
Emit event | Description
----|--------
**[create-room](./create_room.md#L10)**             |User tạo một Room mới
**[leave-room](./leave-room.md)**               |User rời khỏi Room
**[join-room](./join-room.md)**                 |User tham gia vào Room
**[like-room](like-room.md)**                   |User thích một Room
**[list-room](./list-room.md)**                 |Lấy danh sách tất cả Room
**[change-status](./change-status.md)**         |Thay đổi status của Room
**[get-room-info](./get-room-info.md)**         |Lấy thông tin của một Room
**[send-message](./send-message.md)**           |User gửi tin nhắn trên Room
**[get-message](./get-message.md)**             |Lấy danh sách tin nhắn trên Room
**[send-stamp](./send-stamp.md)**               |User gửi stamp trong Room
**[typing](./typing.md)**                       |User đang nhập tin nhắn

On
---
On event|Description
-------|-----------
**[on-message](./on-message.md)**               |Nhận được tin nhắn mới từ 1 User
**[on-typing](./on-typing.md)**                 |Có User đang nhập tin nhắn
**[on-stamp](./on-stamp.md)**                   |Có User gửi stamp
**[on-room-live](./on-room-live.md)**           |Có thêm 1 Room mới được live
**[on-join-room](./on-join-room.md)**           |Có User tham gia vào Room
**[on-leave-room](./on-leave-room.md)**         |Có User rời khỏi Room
**[on-change-status](./on-change-status.md)**   |Room thay đổi trạng thái (status)
**[on-like-room](./on-like-room.md)**           |Có User like Room

Authentication
---
* `access-token`: Token được gửi lên từ Headers

Format response data
---
* `status`: 0 - success
* `data`: Success result
* `error`: Error result

Example
---
```
{
  "status": 0,
  "data": {
    "_id": "5a1d186a6bebf51df9224934",
    "admin": "5a0d3c24c53c8acb037b39ee",
    "roomName": "xxx",
    "createAt": "2017-11-28T08:03:54.658Z",
    "updateAt": "2017-11-28T08:03:54.658Z",
    "status": 0,
    "url": "rtmp://172.16.1.0:1935/live/5a1d186a6bebf51df9224934"
  }
}
```

