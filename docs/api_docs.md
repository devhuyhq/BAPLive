# API Docs

## Checklist

###Emit

Emit event | Description
----|--------
**[create-room](./create_room.md)**             |User tạo một Room mới
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

##On

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
