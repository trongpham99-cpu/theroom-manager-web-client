# The Room Manager - API Documentation

## Base URL
```
http://localhost:3321/api/v1
```

## Authentication
Hầu hết các endpoints yêu cầu JWT Bearer token trong header:
```
Authorization: Bearer <access_token>
```

---

## 📌 Auth APIs

### 1. Register
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "Nguyen Van A",
  "email": "example@gmail.com",
  "password": "Password123"
}
```

**Response:** `201 Created`
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "673...",
      "role": "user",
      "name": "Nguyen Van A",
      "email": "example@gmail.com",
      "isEmailVerified": false,
      "photoURL": "/assets/images/avatars/default-avatar.jpg"
    },
    "tokens": {
      "access": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "expires": "2025-11-13T18:00:00.000Z"
      },
      "refresh": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "expires": "2025-12-13T17:30:00.000Z"
      }
    }
  }
}
```

---

### 2. Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "example@gmail.com",
  "password": "Password123"
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": "673...",
      "role": "user",
      "name": "Nguyen Van A",
      "email": "example@gmail.com",
      "photoURL": "/assets/images/avatars/default-avatar.jpg",
      "isEmailVerified": false,
      "settings": {...},
      "shortcuts": []
    },
    "tokens": {
      "access": {...},
      "refresh": {...}
    }
  }
}
```

---

### 3. Get Current User
**GET** `/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "User profile retrieved successfully",
  "data": {
    "id": "673...",
    "role": "user",
    "name": "Nguyen Van A",
    "email": "example@gmail.com",
    "photoURL": "/assets/images/avatars/default-avatar.jpg",
    "isEmailVerified": false,
    "settings": {...},
    "shortcuts": []
  }
}
```

---

### 4. Logout
**POST** `/auth/logout`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`

---

### 5. Refresh Tokens
**POST** `/auth/refresh-tokens`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Tokens refreshed successfully",
  "data": {
    "tokens": {
      "access": {...},
      "refresh": {...}
    }
  }
}
```

---

## 🏢 Apartment APIs

### 1. List Apartments
**GET** `/apartments`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Apartments retrieved successfully",
  "data": {
    "rows": [
      {
        "_id": "673...",
        "code": "A1",
        "createdAt": "2025-11-13T10:00:00.000Z",
        "updatedAt": "2025-11-13T10:00:00.000Z"
      }
    ],
    "total": 10
  }
}
```

---

## 🚪 Room APIs

### 1. List Rooms
**GET** `/rooms`

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Rooms retrieved successfully",
  "data": {
    "rows": [
      {
        "_id": "673...",
        "code": "A101",
        "apartment_id": "673...",
        "createdAt": "2025-11-13T10:00:00.000Z",
        "updatedAt": "2025-11-13T10:00:00.000Z"
      }
    ],
    "total": 50
  }
}
```

---

### 2. Check Room (Chatbot)
**POST** `/rooms/check`

**Request Body:**
```json
{
  "message": "Phòng A101"
}
```

**Response:** `200 OK`
```json
{
  "version": "chatbot",
  "content": {
    "messages": [
      {
        "type": "text",
        "text": "Xin chào! Mã phòng A101 đã được xác nhận. Bạn cần hỗ trợ gì?"
      }
    ]
  }
}
```

---

### 3. Register Room (Create Customer)
**POST** `/rooms/register`

**Request Body:**
```json
{
  "uuid": "zalo-uuid-123",
  "name": "Nguyen Van B",
  "phone": "0901234567",
  "dob": "1990-01-01",
  "room_id": "673...",
  "apartment_id": "673..."
}
```

**Response:** `200 OK`

---

## 🧾 Invoice APIs

### 1. List Invoices
**GET** `/invoices`

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `month` (number): Filter by month
- `year` (number): Filter by year
- `invoice_status` (1-4): Filter by status

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "rows": [
      {
        "_id": "673...",
        "room_code": "A101",
        "customer_name": "Nguyen Van B",
        "phone": "0901234567",
        "room_price": 3000000,
        "total_amount": 3500000,
        "invoice_status": 1,
        "month": 11,
        "year": 2025
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

---

### 2. Get Invoice by ID
**GET** `/invoices/:id`

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "_id": "673...",
    "room_code": "A101",
    "customer_name": "Nguyen Van B",
    "gender": "Nam",
    "birth_date": "1990-01-01T00:00:00.000Z",
    "phone": "0901234567",
    "contract": {
      "start_date": "2025-01-01T00:00:00.000Z",
      "end_date": "2025-12-31T00:00:00.000Z",
      "duration_months": 12
    },
    "deposit_amount": 3000000,
    "room_price": 3000000,
    "stay_days": 30,
    "actual_room_fee": 3000000,
    "electricity": {
      "old_index": 100,
      "new_index": 150,
      "used_kwh": 50,
      "price": 200000,
      "staff": "Admin"
    },
    "water_usage": 1,
    "water_fee": 100000,
    "management_fee": 200000,
    "old_debt": 0,
    "deduction": 0,
    "total_amount": 3500000,
    "amount_paid": 0,
    "remaining_amount": 3500000,
    "note": "",
    "extra_note": "",
    "invoice_status": 1,
    "month": 11,
    "year": 2025,
    "history": []
  }
}
```

---

### 3. Create Invoice
**POST** `/invoices`

**Request Body:**
```json
{
  "room_code": "A101",
  "customer_name": "Nguyen Van B",
  "phone": "0901234567",
  "room_price": 3000000,
  "electricity": {
    "old_index": 100,
    "new_index": 150,
    "price": 3500
  },
  "water_fee": 100000,
  "management_fee": 200000,
  "month": 11,
  "year": 2025
}
```

**Response:** `201 Created`

---

### 4. Send Invoice (Single)
**POST** `/invoices/:id/send`

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Invoice sent successfully"
}
```

---

### 5. Send Multiple Invoices
**POST** `/invoices/send-many`

**Request Body:**
```json
{
  "invoice_ids": ["673...", "674..."]
}
```

**Response:** `200 OK`

---

### 6. Get Report
**GET** `/invoices/report`

**Query Parameters:**
- `month` (number): Required
- `year` (number): Required

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "total_invoices": 100,
    "total_amount": 350000000,
    "paid_amount": 300000000,
    "remaining_amount": 50000000,
    "by_status": {
      "pending": 10,
      "sent": 20,
      "paid": 65,
      "failed": 5
    }
  }
}
```

---

### 7. Sync from Google Sheets
**POST** `/invoices/sync-file-sheet`

**Request Body:**
```json
{
  "sheet_url": "https://docs.google.com/spreadsheets/d/..."
}
```

**Response:** `200 OK`

---

## 🔔 Notification APIs

### 1. List Notifications
**GET** `/notifications`

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Notifications retrieved successfully",
  "data": {
    "rows": [
      {
        "_id": "673...",
        "title": "Thông báo đóng tiền điện nước",
        "content": "Vui lòng đóng tiền trước ngày 15 hàng tháng",
        "room_ids": ["673...", "674..."],
        "apartment_ids": ["673..."],
        "logs": [],
        "createdAt": "2025-11-13T10:00:00.000Z"
      }
    ],
    "total": 50
  }
}
```

---

### 2. Create & Send Notification
**POST** `/notifications/send`

**Request Body:**
```json
{
  "title": "Thông báo bảo trì",
  "content": "Hệ thống sẽ bảo trì vào ngày 15/11",
  "room_ids": ["673...", "674..."],
  "apartment_ids": ["673..."]
}
```

**Response:** `201 Created`
```json
{
  "status": "success",
  "message": "Notification sent successfully",
  "data": {
    "notification_id": "673...",
    "sent_count": 50,
    "failed_count": 0
  }
}
```

---

## 👤 User APIs

### 1. List Users (Admin only)
**GET** `/users`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number)
- `limit` (number)
- `role` (string): "user" | "admin"
- `name` (string): Search by name

**Response:** `200 OK`

---

### 2. Get User by ID
**GET** `/users/:userId`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### 3. Update User
**PATCH** `/users/:userId`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "New Name",
  "email": "newemail@gmail.com",
  "photoURL": "https://...",
  "settings": {...},
  "shortcuts": ["dashboard", "invoices"]
}
```

**Note:** ⚠️ Field `role` hiện không được phép update qua API này

**Response:** `200 OK`

---

### 4. Delete User
**DELETE** `/users/:userId`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "status": "fail",
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "status": "fail",
  "message": "Please authenticate"
}
```

### 403 Forbidden
```json
{
  "status": "fail",
  "message": "Forbidden"
}
```

### 404 Not Found
```json
{
  "status": "fail",
  "message": "Not found"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

## 📝 Notes

### Invoice Status
- `1`: Pending (Chưa gửi)
- `2`: Sent (Đã gửi)
- `3`: Paid (Đã thanh toán)
- `4`: Failed (Gửi thất bại)

### Gender Options
- `"Nam"`: Male
- `"Nữ"`: Female
- `"N/A"`: Not specified

### User Roles
- `"user"`: Regular user
- `"admin"`: Administrator

### Password Requirements
- Minimum 8 characters
- At least 1 letter
- At least 1 number

---

## 🚧 APIs Chưa Có (TODO)

### Customer Management
- ❌ `GET /customers` - List customers
- ❌ `GET /customers/:id` - Get customer
- ❌ `POST /customers` - Create customer
- ❌ `PATCH /customers/:id` - Update customer
- ❌ `DELETE /customers/:id` - Delete customer

**Hiện tại:** Customer chỉ có thể tạo qua `POST /rooms/register`

### Apartment CRUD
- ❌ `POST /apartments` - Create apartment
- ❌ `PATCH /apartments/:id` - Update apartment
- ❌ `DELETE /apartments/:id` - Delete apartment

### Room CRUD
- ❌ `GET /rooms/:id` - Get room by ID
- ❌ `POST /rooms` - Create room
- ❌ `PATCH /rooms/:id` - Update room
- ❌ `DELETE /rooms/:id` - Delete room

---

## 🔗 Swagger Documentation

API documentation cũng có sẵn tại:
```
http://localhost:3321/api/v1/docs/
```

---

## 📞 Contact

Nếu có vấn đề hoặc câu hỏi về API, vui lòng liên hệ backend team.

**Last Updated:** November 13, 2025

