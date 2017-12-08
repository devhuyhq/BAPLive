Create room (`create-room`)
---

Description
---
User rời khỏi room. Khi gọi hàm, event`on-leave-room` sẽ được gọi.

Parameters
---
* `room_id`: `(String)` ID của Room đang tham gia.
* `device_id`:`(String)` ID của thiết bị (sử dụng khi user không đăng nhập vẫn vào xem live stream được).

Success Response
---

* `user`: `(Object)` Đối tượng User rời khỏi room, trưởng hợp không đăng nhập `user = null`.
* `room`: `(Object)` Đối tượng Room đang tham gia.
* `device_id`: `(String)` Device đã rời khỏi room, dùng khi user không đăng nhập. 

**Example:**

```
{
  "status": 0,
  "data": {
    "room": {
        "_id": "5a1d186a6bebf51df9224934",
        "admin": "5a0d3c24c53c8acb037b39ee",
        "roomName": "xxx",
        "createAt": "2017-11-28T08:03:54.658Z",
        "updateAt": "2017-11-28T08:03:54.658Z",
        "status": 0,
        "url": "rtmp://172.16.1.0:1935/live/5a1d186a6bebf51df9224934"
    },
    "user":{
         "_id": "5a0d3c24c53c8acb037b39ee",
         "email": "Sonnt@gmail.com"
    },
    "device_id":null
  }
}
```

Error Response
---
* `error`: Message lỗi trả về khi thất bại.

