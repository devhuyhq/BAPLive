#Create room (`create-room`)

Description
---
User tạo 1 Room mới

Parameters
---
* `room_name`: Tên room muốn tạo

Sussess Response
---
* `room`: `Object` Đối tượng Room vừa được tạo

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
    }
  }
}
```

Error Response
---
* `error`: Message lỗi trả về khi tạo Room thất bại.

