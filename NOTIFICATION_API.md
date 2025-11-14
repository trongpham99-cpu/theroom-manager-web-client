# Notification API Integration Guide

## 📌 Overview

API để quản lý và gửi thông báo cho khách hàng trong hệ thống The Room Manager.

**Base URL:** `http://localhost:3321/api/v1`

**Note:** ⚠️ Hiện tại API chỉ lưu notification vào database, **chưa tích hợp Zalo** để gửi thông báo thực tế. Tính năng gửi qua Zalo sẽ được bổ sung sau.

---

## 🔗 Endpoints

### 1. List Notifications
### 2. Create & Send Notification

---

## 1️⃣ GET /api/v1/notifications

Lấy danh sách tất cả notifications đã tạo.

### Request

```http
GET /api/v1/notifications HTTP/1.1
Host: localhost:3321
Content-Type: application/json
```

**Headers:** Không cần authentication

**Query Parameters:** Không có

---

### Response Success (200 OK)

```json
{
  "status": "success",
  "message": "Notifications retrieved successfully",
  "data": {
    "rows": [
      {
        "_id": "691624269e64225d632f87e8",
        "title": "Thông báo đóng tiền điện nước",
        "content": "Kính gửi quý khách, vui lòng đóng tiền điện nước trước ngày 15 hàng tháng. Xin cảm ơn!",
        "room_ids": [
          {
            "_id": "673abc123...",
            "code": "A101"
          }
        ],
        "apartment_ids": [
          {
            "_id": "673def456...",
            "code": "Building A"
          }
        ],
        "logs": [],
        "createdAt": "2025-11-13T18:32:06.711Z",
        "updatedAt": "2025-11-13T18:32:06.711Z"
      }
    ],
    "total": 1
  }
}
```

---

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `_id` | String | Notification ID (MongoDB ObjectId) |
| `title` | String | Tiêu đề thông báo |
| `content` | String | Nội dung thông báo |
| `room_ids` | Array | Danh sách phòng được gửi (populated với code) |
| `apartment_ids` | Array | Danh sách tòa nhà được gửi (populated với code) |
| `logs` | Array | Logs gửi thông báo (hiện tại rỗng) |
| `createdAt` | DateTime | Thời gian tạo |
| `updatedAt` | DateTime | Thời gian cập nhật |
| `total` | Number | Tổng số notifications |

---

### Error Responses

#### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

### Example Usage (JavaScript/Fetch)

```javascript
const listNotifications = async () => {
  try {
    const response = await fetch('http://localhost:3321/api/v1/notifications', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('Notifications:', data.data.rows);
      console.log('Total:', data.data.total);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

### Example Usage (Axios)

```javascript
import axios from 'axios';

const listNotifications = async () => {
  try {
    const { data } = await axios.get('http://localhost:3321/api/v1/notifications');
    
    console.log('Notifications:', data.data.rows);
    console.log('Total:', data.data.total);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};
```

---

## 2️⃣ POST /api/v1/notifications/send

Tạo và gửi notification mới.

### Request

```http
POST /api/v1/notifications/send HTTP/1.1
Host: localhost:3321
Content-Type: application/json
```

**Headers:** Không cần authentication

**Body Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `templateData` | Object | ✅ Yes | Dữ liệu notification |
| `templateData.notification_title` | String | ✅ Yes | Tiêu đề thông báo |
| `templateData.notification_body` | String | ✅ Yes | Nội dung thông báo |
| `apartmentIds` | Array[String] | ⚪ Optional | Danh sách apartment IDs (ObjectId) |
| `roomIds` | Array[String] | ⚪ Optional | Danh sách room IDs (ObjectId) |

---

### Request Body Example

#### Example 1: Notification chung (không chỉ định phòng/tòa)

```json
{
  "apartmentIds": [],
  "roomIds": [],
  "templateData": {
    "notification_title": "Thông báo bảo trì",
    "notification_body": "Hệ thống điện sẽ bảo trì vào ngày 15/11/2025 từ 8h-12h. Mong quý khách thông cảm!"
  }
}
```

#### Example 2: Gửi cho specific apartments

```json
{
  "apartmentIds": ["673abc123...", "673def456..."],
  "roomIds": [],
  "templateData": {
    "notification_title": "Thông báo đóng tiền",
    "notification_body": "Vui lòng đóng tiền trước ngày 20 hàng tháng"
  }
}
```

#### Example 3: Gửi cho specific rooms

```json
{
  "apartmentIds": [],
  "roomIds": ["673room1...", "673room2..."],
  "templateData": {
    "notification_title": "Nhắc nhở thanh toán",
    "notification_body": "Phòng của bạn còn nợ tiền tháng trước. Vui lòng thanh toán!"
  }
}
```

#### Example 4: Gửi cho cả apartments và rooms

```json
{
  "apartmentIds": ["673abc123..."],
  "roomIds": ["673room1...", "673room2..."],
  "templateData": {
    "notification_title": "Thông báo khẩn",
    "notification_body": "Tạm ngưng cung cấp nước từ 14h-18h hôm nay"
  }
}
```

---

### Response Success (201 Created)

```json
{
  "status": "success",
  "message": "Notification created successfully (Zalo integration pending)",
  "data": {
    "_id": "691624269e64225d632f87e8",
    "title": "Thông báo bảo trì",
    "content": "Hệ thống điện sẽ bảo trì vào ngày 15/11/2025 từ 8h-12h. Mong quý khách thông cảm!",
    "room_ids": [],
    "apartment_ids": [],
    "logs": [],
    "createdAt": "2025-11-13T18:32:06.711Z",
    "updatedAt": "2025-11-13T18:32:06.711Z"
  }
}
```

---

### Error Responses

#### 400 Bad Request - Missing Required Fields
```json
{
  "status": "fail",
  "message": "notification_title and notification_body are required in templateData"
}
```

#### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Internal server error",
  "error": "Detailed error message"
}
```

---

### Example Usage (JavaScript/Fetch)

```javascript
const createNotification = async (title, body, apartmentIds = [], roomIds = []) => {
  try {
    const response = await fetch('http://localhost:3321/api/v1/notifications/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apartmentIds,
        roomIds,
        templateData: {
          notification_title: title,
          notification_body: body,
        },
      }),
    });

    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('Notification created:', data.data);
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Usage
await createNotification(
  'Thông báo đóng tiền',
  'Vui lòng đóng tiền trước ngày 15',
  ['673abc123...'], // apartment IDs
  [] // room IDs
);
```

---

### Example Usage (Axios)

```javascript
import axios from 'axios';

const createNotification = async (title, body, apartmentIds = [], roomIds = []) => {
  try {
    const { data } = await axios.post(
      'http://localhost:3321/api/v1/notifications/send',
      {
        apartmentIds,
        roomIds,
        templateData: {
          notification_title: title,
          notification_body: body,
        },
      }
    );

    console.log('Notification created:', data.data);
    return data.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
};
```

---

### Example Usage (React Hook)

```javascript
import { useState } from 'react';
import axios from 'axios';

const useNotification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendNotification = async (title, body, apartmentIds = [], roomIds = []) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(
        'http://localhost:3321/api/v1/notifications/send',
        {
          apartmentIds,
          roomIds,
          templateData: {
            notification_title: title,
            notification_body: body,
          },
        }
      );

      return data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { sendNotification, loading, error };
};

// Usage in component
function NotificationForm() {
  const { sendNotification, loading, error } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      await sendNotification(
        formData.get('title'),
        formData.get('body'),
        [], // apartmentIds
        []  // roomIds
      );
      alert('Notification sent successfully!');
    } catch (error) {
      alert('Failed to send notification');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" required />
      <textarea name="body" placeholder="Content" required />
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Notification'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

---

## 🎯 Use Cases

### Use Case 1: Thông báo chung cho tất cả
```javascript
await createNotification(
  'Thông báo nghỉ lễ',
  'Văn phòng sẽ nghỉ lễ 30/4 - 2/5',
  [], // Không chọn apartment
  []  // Không chọn room
);
```

### Use Case 2: Thông báo cho một tòa nhà
```javascript
await createNotification(
  'Bảo trì thang máy',
  'Thang máy tòa A sẽ bảo trì ngày mai',
  ['apartmentId_Building_A'], // Chỉ Building A
  []
);
```

### Use Case 3: Thông báo cho nhiều phòng cụ thể
```javascript
const roomsWithDebt = ['room1_id', 'room2_id', 'room3_id'];

await createNotification(
  'Nhắc nợ',
  'Phòng của bạn còn nợ tiền tháng trước',
  [],
  roomsWithDebt
);
```

### Use Case 4: Thông báo hóa đơn đến hạn
```javascript
// Lấy danh sách rooms có hóa đơn chưa thanh toán
const unpaidRooms = await fetchUnpaidInvoiceRooms();

await createNotification(
  'Hóa đơn đến hạn',
  'Hóa đơn tháng 11 sẽ đến hạn vào ngày 15. Vui lòng thanh toán kịp thời!',
  [],
  unpaidRooms.map(r => r._id)
);
```

---

## ⚠️ Important Notes

### 1. Zalo Integration Status
- ⚠️ **Hiện tại:** API chỉ lưu notification vào database, **KHÔNG gửi qua Zalo**
- 🔄 **Tương lai:** Sẽ tích hợp Zalo ZNS (Zalo Notification Service) để gửi thông báo thực
- 📝 Message trong response: `"Notification created successfully (Zalo integration pending)"`

### 2. Validation Rules
- `notification_title` và `notification_body` là **bắt buộc**
- `apartmentIds` và `roomIds` có thể để **rỗng `[]`**
- IDs phải là **MongoDB ObjectId** hợp lệ

### 3. Data Flow
```
Frontend → POST /notifications/send → Backend
                                       ↓
                                   Validate data
                                       ↓
                                  Save to MongoDB
                                       ↓
                                   Return response
                                       ↓
                    [TODO: Send to Zalo in future]
```

### 4. Best Practices

#### ✅ DO:
- Validate title và body trước khi gửi
- Handle errors gracefully
- Show loading state khi đang gửi
- Confirm với user trước khi gửi notification
- Kiểm tra apartment/room IDs có tồn tại không

#### ❌ DON'T:
- Gửi notification quá thường xuyên (spam)
- Gửi notification với nội dung rỗng
- Gửi notification mà không có user confirmation
- Hardcode IDs trong code

---

## 🔧 Error Handling

### Error Handling Template

```javascript
const sendNotificationWithErrorHandling = async (title, body, apartmentIds, roomIds) => {
  try {
    // Validate inputs
    if (!title || !body) {
      throw new Error('Title and body are required');
    }

    if (title.length > 200) {
      throw new Error('Title too long (max 200 characters)');
    }

    if (body.length > 1000) {
      throw new Error('Body too long (max 1000 characters)');
    }

    // Send notification
    const response = await fetch('http://localhost:3321/api/v1/notifications/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apartmentIds,
        roomIds,
        templateData: {
          notification_title: title,
          notification_body: body,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send notification');
    }

    return { success: true, data: data.data };

  } catch (error) {
    console.error('Error sending notification:', error);
    
    // User-friendly error messages
    let userMessage = 'Không thể gửi thông báo. Vui lòng thử lại!';
    
    if (error.message.includes('required')) {
      userMessage = 'Vui lòng điền đầy đủ tiêu đề và nội dung';
    } else if (error.message.includes('network')) {
      userMessage = 'Lỗi kết nối. Vui lòng kiểm tra internet!';
    }

    return { success: false, error: userMessage };
  }
};
```

---

## 📊 Response Status Codes

| Code | Status | Meaning |
|------|--------|---------|
| 200 | OK | GET request thành công |
| 201 | Created | POST tạo notification thành công |
| 400 | Bad Request | Thiếu dữ liệu hoặc dữ liệu không hợp lệ |
| 500 | Internal Server Error | Lỗi server |

---

## 🔮 Future Enhancements

### Sắp có (Zalo Integration):
- ✅ Gửi notification thực qua Zalo ZNS
- ✅ Track delivery status
- ✅ Retry failed notifications
- ✅ Notification templates với variables
- ✅ Schedule notifications (gửi sau)

### Có thể có:
- 📧 Email notifications
- 📱 Push notifications (mobile app)
- 💬 SMS notifications
- 📈 Analytics dashboard
- 🔔 Real-time notifications (WebSocket)

---

## 🆘 Troubleshooting

### Issue 1: Request bị treo
**Symptom:** Request không return response  
**Cause:** Server có thể đang crash hoặc restart  
**Solution:** 
- Kiểm tra server có đang chạy: `lsof -ti:3321`
- Restart server: `npm run dev`
- Check server logs

### Issue 2: 400 Bad Request
**Symptom:** Response trả về lỗi validation  
**Cause:** Thiếu title hoặc body  
**Solution:**
```javascript
// ❌ Wrong
{ templateData: { title: 'Test' } }

// ✅ Correct
{ templateData: { 
  notification_title: 'Test',
  notification_body: 'Content'
}}
```

### Issue 3: Notification không hiển thị
**Symptom:** POST thành công nhưng GET không thấy  
**Cause:** Database connection issue  
**Solution:** Check MongoDB connection

---

## 📞 Support

Nếu có vấn đề hoặc câu hỏi:
1. Check server logs
2. Verify MongoDB đang chạy
3. Test bằng Swagger: `http://localhost:3321/api/v1/docs/`
4. Contact backend team

---

## 📝 Change Log

### Version 1.0 (Current)
- ✅ Basic CRUD operations
- ✅ Database storage
- ⚠️ Zalo integration pending

### Version 2.0 (Planned)
- 🔄 Zalo ZNS integration
- 🔄 Delivery tracking
- 🔄 Scheduled notifications

---

**Last Updated:** November 13, 2025  
**API Version:** 1.0  
**Status:** Production Ready (without Zalo)

