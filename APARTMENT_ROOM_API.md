# Apartment & Room API Integration Guide

## 📌 Overview

API để quản lý thông tin tòa nhà (Apartments) và phòng (Rooms) trong hệ thống The Room Manager.

**Base URL:** `http://localhost:3321/api/v1`

**Note:** APIs này không yêu cầu authentication, có thể gọi trực tiếp từ frontend.

---

## 📋 Table of Contents

- [Apartment APIs](#-apartment-apis)
  - [1. List Apartments](#1%EF%B8%8F⃣-get-apiv1apartments)
- [Room APIs](#-room-apis)
  - [1. List Rooms](#1%EF%B8%8F⃣-get-apiv1rooms)
  - [2. Check Room (Chatbot)](#2%EF%B8%8F⃣-post-apiv1roomscheck)
  - [3. Register Customer to Room](#3%EF%B8%8F⃣-post-apiv1roomsregister)
- [React Integration Examples](#-react-integration-examples)
- [Use Cases & Best Practices](#-use-cases--scenarios)

---

# 🏢 Apartment APIs

## 1️⃣ GET /api/v1/apartments

Lấy danh sách tất cả tòa nhà (apartments) trong hệ thống.

### Request

```http
GET /api/v1/apartments HTTP/1.1
Host: localhost:3321
Content-Type: application/json
```

**Headers:** Không cần authentication

**Query Parameters:** Không có (hiện tại không support pagination/filter)

---

### Response Success (200 OK)

```json
{
  "status": "success",
  "message": "Apartments retrieved successfully",
  "data": {
    "rows": [
      {
        "_id": "673abc123def456...",
        "code": "Building A",
        "createdAt": "2025-11-10T08:00:00.000Z",
        "updatedAt": "2025-11-10T08:00:00.000Z",
        "__v": 0
      },
      {
        "_id": "673abc123def789...",
        "code": "Building B",
        "createdAt": "2025-11-10T08:05:00.000Z",
        "updatedAt": "2025-11-10T08:05:00.000Z",
        "__v": 0
      }
    ],
    "total": 2
  }
}
```

---

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `_id` | String | Apartment ID (MongoDB ObjectId) |
| `code` | String | Mã tòa nhà (VD: "Building A", "Tòa A") |
| `createdAt` | DateTime | Thời gian tạo |
| `updatedAt` | DateTime | Thời gian cập nhật |
| `total` | Number | Tổng số tòa nhà |

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

### Example Usage (Fetch)

```javascript
const getApartments = async () => {
  try {
    const response = await fetch('http://localhost:3321/api/v1/apartments');
    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('Apartments:', data.data.rows);
      console.log('Total:', data.data.total);
      return data.data.rows;
    }
  } catch (error) {
    console.error('Error fetching apartments:', error);
    throw error;
  }
};

// Usage
const apartments = await getApartments();
```

---

### Example Usage (Axios)

```javascript
import axios from 'axios';

const getApartments = async () => {
  try {
    const { data } = await axios.get('http://localhost:3321/api/v1/apartments');
    
    console.log('Apartments:', data.data.rows);
    return data.data.rows;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
};
```

---

### Example Usage (React Hook)

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

const useApartments = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('http://localhost:3321/api/v1/apartments');
        setApartments(data.data.rows);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  return { apartments, loading, error };
};

// Usage in component
function ApartmentList() {
  const { apartments, loading, error } = useApartments();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Danh sách tòa nhà ({apartments.length})</h2>
      <ul>
        {apartments.map(apt => (
          <li key={apt._id}>
            {apt.code}
            <small> (ID: {apt._id})</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

### Example Usage (Select Dropdown)

```javascript
function ApartmentSelect({ value, onChange }) {
  const { apartments, loading } = useApartments();

  return (
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      disabled={loading}
    >
      <option value="">-- Chọn tòa nhà --</option>
      {apartments.map(apt => (
        <option key={apt._id} value={apt._id}>
          {apt.code}
        </option>
      ))}
    </select>
  );
}

// Usage
function MyForm() {
  const [apartmentId, setApartmentId] = useState('');

  return (
    <form>
      <ApartmentSelect 
        value={apartmentId} 
        onChange={setApartmentId} 
      />
    </form>
  );
}
```

---

# 🚪 Room APIs

## 1️⃣ GET /api/v1/rooms

Lấy danh sách tất cả phòng (rooms) trong hệ thống.

### Request

```http
GET /api/v1/rooms HTTP/1.1
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
  "message": "Rooms retrieved successfully",
  "data": {
    "rows": [
      {
        "_id": "673room001...",
        "code": "A101",
        "apartment_id": "673abc123def456...",
        "createdAt": "2025-11-10T09:00:00.000Z",
        "updatedAt": "2025-11-10T09:00:00.000Z",
        "__v": 0
      },
      {
        "_id": "673room002...",
        "code": "A102",
        "apartment_id": "673abc123def456...",
        "createdAt": "2025-11-10T09:01:00.000Z",
        "updatedAt": "2025-11-10T09:01:00.000Z",
        "__v": 0
      }
    ],
    "total": 50
  }
}
```

---

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `_id` | String | Room ID (MongoDB ObjectId) |
| `code` | String | Mã phòng (VD: "A101", "B203") |
| `apartment_id` | String | ID của tòa nhà (ObjectId) |
| `createdAt` | DateTime | Thời gian tạo |
| `updatedAt` | DateTime | Thời gian cập nhật |
| `total` | Number | Tổng số phòng |

---

### Example Usage (Fetch)

```javascript
const getRooms = async () => {
  try {
    const response = await fetch('http://localhost:3321/api/v1/rooms');
    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('Rooms:', data.data.rows);
      return data.data.rows;
    }
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
};
```

---

### Example Usage (React Hook with Filter)

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

const useRooms = (apartmentId = null) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('http://localhost:3321/api/v1/rooms');
        
        // Filter by apartment if provided
        let filteredRooms = data.data.rows;
        if (apartmentId) {
          filteredRooms = filteredRooms.filter(
            room => room.apartment_id === apartmentId
          );
        }
        
        setRooms(filteredRooms);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [apartmentId]);

  return { rooms, loading, error };
};

// Usage - Get all rooms
const { rooms } = useRooms();

// Usage - Get rooms by apartment
const { rooms: apartmentRooms } = useRooms('673abc123def456...');
```

---

### Example Usage (Room Select with Apartment Filter)

```javascript
function RoomSelect({ apartmentId, value, onChange }) {
  const { rooms, loading } = useRooms(apartmentId);

  return (
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      disabled={loading || !apartmentId}
    >
      <option value="">
        {apartmentId ? '-- Chọn phòng --' : '-- Chọn tòa nhà trước --'}
      </option>
      {rooms.map(room => (
        <option key={room._id} value={room._id}>
          {room.code}
        </option>
      ))}
    </select>
  );
}

// Usage with cascading dropdowns
function RoomSelectionForm() {
  const [apartmentId, setApartmentId] = useState('');
  const [roomId, setRoomId] = useState('');

  const handleApartmentChange = (newApartmentId) => {
    setApartmentId(newApartmentId);
    setRoomId(''); // Reset room when apartment changes
  };

  return (
    <form>
      <ApartmentSelect 
        value={apartmentId} 
        onChange={handleApartmentChange} 
      />
      
      <RoomSelect 
        apartmentId={apartmentId}
        value={roomId}
        onChange={setRoomId}
      />
    </form>
  );
}
```

---

## 2️⃣ POST /api/v1/rooms/check

Kiểm tra mã phòng (sử dụng cho chatbot/voice assistant). API này dùng fuzzy matching để tìm phòng.

### Request

```http
POST /api/v1/rooms/check HTTP/1.1
Host: localhost:3321
Content-Type: application/json
```

**Body Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | String | ✅ Yes | Tin nhắn chứa mã phòng (VD: "Phòng A101", "tôi ở A102") |

---

### Request Body Examples

```json
{
  "message": "Phòng A101"
}
```

```json
{
  "message": "Tôi ở phòng B203"
}
```

```json
{
  "message": "A101"
}
```

---

### Response Success - Room Found (200 OK)

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

### Response - Room Not Found (200 OK)

```json
{
  "version": "chatbot",
  "content": {
    "messages": [
      {
        "type": "text",
        "text": "Không tìm thấy mã phòng hợp lệ trong tin nhắn của bạn. Vui lòng thử lại."
      }
    ]
  }
}
```

---

### Response - Invalid Input (200 OK)

```json
{
  "version": "chatbot",
  "content": {
    "messages": [
      {
        "type": "text",
        "text": "Vui lòng nhập mã phòng để kiểm tra."
      }
    ]
  }
}
```

---

### Example Usage (Chatbot)

```javascript
const checkRoom = async (userMessage) => {
  try {
    const response = await fetch('http://localhost:3321/api/v1/rooms/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage
      }),
    });

    const data = await response.json();
    
    // Get bot response text
    const botReply = data.content.messages[0].text;
    console.log('Bot:', botReply);
    
    return botReply;
  } catch (error) {
    console.error('Error checking room:', error);
    return 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại!';
  }
};

// Usage
const userInput = "Tôi ở phòng A101";
const response = await checkRoom(userInput);
// Output: "Xin chào! Mã phòng A101 đã được xác nhận. Bạn cần hỗ trợ gì?"
```

---

### Example Usage (React Chatbot Component)

```javascript
import { useState } from 'react';

function RoomChatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3321/api/v1/rooms/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const botReply = data.content.messages[0].text;

      // Add bot message
      const botMessage = { role: 'bot', text: botReply };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { 
        role: 'bot', 
        text: 'Xin lỗi, có lỗi xảy ra!' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <strong>{msg.role === 'user' ? 'Bạn:' : 'Bot:'}</strong>
            <p>{msg.text}</p>
          </div>
        ))}
        {loading && <div className="message bot">Bot đang xử lý...</div>}
      </div>

      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập mã phòng của bạn..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          Gửi
        </button>
      </form>
    </div>
  );
}
```

---

### How Fuzzy Matching Works

API sử dụng `normalizeString` function để matching:
- Bỏ dấu tiếng Việt
- Bỏ ký tự đặc biệt
- Uppercase tất cả
- Match partial string

**Examples:**
```javascript
"Phòng A101" → "PHONGA101" → matches "A101"
"tôi ở a101" → "TOIOA101" → matches "A101"
"A 101" → "A101" → matches "A101"
```

---

## 3️⃣ POST /api/v1/rooms/register

Đăng ký khách hàng vào phòng (tạo customer record).

### Request

```http
POST /api/v1/rooms/register HTTP/1.1
Host: localhost:3321
Content-Type: application/json
```

**Body Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `uuid` | String | ✅ Yes | Unique identifier (có thể là Zalo UUID) |
| `name` | String | ✅ Yes | Tên khách hàng |
| `phone` | String | ✅ Yes | Số điện thoại |
| `dob` | String | ✅ Yes | Ngày sinh (ISO format: YYYY-MM-DD) |
| `room_id` | String | ✅ Yes | Room ID (ObjectId) |
| `apartment_id` | String | ✅ Yes | Apartment ID (ObjectId) |

---

### Request Body Example

```json
{
  "uuid": "zalo_user_12345",
  "name": "Nguyễn Văn A",
  "phone": "0901234567",
  "dob": "1990-05-15",
  "room_id": "673room001...",
  "apartment_id": "673abc123def456..."
}
```

---

### Response Success (200 OK)

⚠️ **Note:** API này không return response body khi thành công (bug). Cần sửa sau.

**Current behavior:** HTTP 200 với empty body

**Expected behavior:**
```json
{
  "status": "success",
  "message": "Customer registered successfully",
  "data": {
    "_id": "673customer001...",
    "uuid": "zalo_user_12345",
    "name": "Nguyễn Văn A",
    "phone": "0901234567",
    "dob": "1990-05-15T00:00:00.000Z",
    "room_id": "673room001...",
    "apartment_id": "673abc123def456..."
  }
}
```

---

### Error Responses

#### 400 Bad Request - Missing Fields
```json
{
  "status": "error",
  "message": "Missing required fields"
}
```

#### 400 Bad Request - UUID Already Exists
```json
{
  "status": "error",
  "message": "Customer with this UUID already exists"
}
```

#### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "An error occurred while processing your request.",
  "error": "Error details..."
}
```

---

### Example Usage (Fetch)

```javascript
const registerCustomer = async (customerData) => {
  try {
    const response = await fetch('http://localhost:3321/api/v1/rooms/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    // Note: Response body is empty, check status code only
    return { success: true };
  } catch (error) {
    console.error('Error registering customer:', error);
    throw error;
  }
};

// Usage
await registerCustomer({
  uuid: 'zalo_user_12345',
  name: 'Nguyễn Văn A',
  phone: '0901234567',
  dob: '1990-05-15',
  room_id: '673room001...',
  apartment_id: '673abc123def456...'
});
```

---

### Example Usage (React Form)

```javascript
import { useState } from 'react';

function CustomerRegistrationForm() {
  const [formData, setFormData] = useState({
    uuid: '',
    name: '',
    phone: '',
    dob: '',
    room_id: '',
    apartment_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:3321/api/v1/rooms/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setSuccess(true);
      // Reset form
      setFormData({
        uuid: '',
        name: '',
        phone: '',
        dob: '',
        room_id: '',
        apartment_id: ''
      });

      alert('Đăng ký thành công!');
    } catch (err) {
      setError(err.message);
      alert('Đăng ký thất bại: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Đăng ký khách hàng</h2>
      
      <div>
        <label>UUID:</label>
        <input
          name="uuid"
          value={formData.uuid}
          onChange={handleChange}
          required
          placeholder="zalo_user_12345"
        />
      </div>

      <div>
        <label>Họ tên:</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Nguyễn Văn A"
        />
      </div>

      <div>
        <label>Số điện thoại:</label>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="0901234567"
        />
      </div>

      <div>
        <label>Ngày sinh:</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Tòa nhà:</label>
        <ApartmentSelect
          value={formData.apartment_id}
          onChange={(val) => setFormData(prev => ({ 
            ...prev, 
            apartment_id: val,
            room_id: '' // Reset room when apartment changes
          }))}
        />
      </div>

      <div>
        <label>Phòng:</label>
        <RoomSelect
          apartmentId={formData.apartment_id}
          value={formData.room_id}
          onChange={(val) => setFormData(prev => ({ ...prev, room_id: val }))}
        />
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">Đăng ký thành công!</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Đang xử lý...' : 'Đăng ký'}
      </button>
    </form>
  );
}
```

---

# 🔧 React Integration Examples

## Complete Service Layer

```javascript
// services/apartmentService.js
import axios from 'axios';

const API_BASE = 'http://localhost:3321/api/v1';

export const apartmentService = {
  getAll: async () => {
    const { data } = await axios.get(`${API_BASE}/apartments`);
    return data.data.rows;
  },
};

// services/roomService.js
export const roomService = {
  getAll: async () => {
    const { data } = await axios.get(`${API_BASE}/rooms`);
    return data.data.rows;
  },

  checkRoom: async (message) => {
    const { data } = await axios.post(`${API_BASE}/rooms/check`, { message });
    return data.content.messages[0].text;
  },

  registerCustomer: async (customerData) => {
    await axios.post(`${API_BASE}/rooms/register`, customerData);
    return { success: true };
  },
};
```

---

## Complete React Context

```javascript
// contexts/RoomContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { apartmentService, roomService } from '../services';

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [apartments, setApartments] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [apartmentsData, roomsData] = await Promise.all([
          apartmentService.getAll(),
          roomService.getAll(),
        ]);
        setApartments(apartmentsData);
        setRooms(roomsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRoomsByApartment = (apartmentId) => {
    return rooms.filter(room => room.apartment_id === apartmentId);
  };

  const getApartmentById = (apartmentId) => {
    return apartments.find(apt => apt._id === apartmentId);
  };

  const getRoomById = (roomId) => {
    return rooms.find(room => room._id === roomId);
  };

  return (
    <RoomContext.Provider 
      value={{
        apartments,
        rooms,
        loading,
        error,
        getRoomsByApartment,
        getApartmentById,
        getRoomById,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoomContext must be used within RoomProvider');
  }
  return context;
};

// Usage in App.js
function App() {
  return (
    <RoomProvider>
      <YourApp />
    </RoomProvider>
  );
}

// Usage in components
function MyComponent() {
  const { apartments, rooms, getRoomsByApartment } = useRoomContext();
  // ...
}
```

---

# 🎯 Use Cases & Scenarios

## Use Case 1: Apartment & Room Picker (Cascading Dropdowns)

```javascript
function ApartmentRoomPicker({ onSelect }) {
  const [apartmentId, setApartmentId] = useState('');
  const [roomId, setRoomId] = useState('');
  const { apartments, getRoomsByApartment } = useRoomContext();

  const rooms = apartmentId ? getRoomsByApartment(apartmentId) : [];

  const handleApartmentChange = (newApartmentId) => {
    setApartmentId(newApartmentId);
    setRoomId(''); // Reset room
  };

  const handleRoomChange = (newRoomId) => {
    setRoomId(newRoomId);
    onSelect({ apartmentId, roomId: newRoomId });
  };

  return (
    <div>
      <select value={apartmentId} onChange={(e) => handleApartmentChange(e.target.value)}>
        <option value="">-- Chọn tòa nhà --</option>
        {apartments.map(apt => (
          <option key={apt._id} value={apt._id}>{apt.code}</option>
        ))}
      </select>

      <select 
        value={roomId} 
        onChange={(e) => handleRoomChange(e.target.value)}
        disabled={!apartmentId}
      >
        <option value="">-- Chọn phòng --</option>
        {rooms.map(room => (
          <option key={room._id} value={room._id}>{room.code}</option>
        ))}
      </select>
    </div>
  );
}
```

---

## Use Case 2: Room Directory with Search

```javascript
function RoomDirectory() {
  const { apartments, rooms, loading } = useRoomContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApartment, setSelectedApartment] = useState('all');

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesApartment = selectedApartment === 'all' || room.apartment_id === selectedApartment;
    return matchesSearch && matchesApartment;
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="room-directory">
      <h2>Danh sách phòng</h2>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Tìm kiếm phòng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={selectedApartment} onChange={(e) => setSelectedApartment(e.target.value)}>
          <option value="all">Tất cả tòa nhà</option>
          {apartments.map(apt => (
            <option key={apt._id} value={apt._id}>{apt.code}</option>
          ))}
        </select>
      </div>

      {/* Results */}
      <div className="room-grid">
        {filteredRooms.map(room => {
          const apartment = apartments.find(apt => apt._id === room.apartment_id);
          return (
            <div key={room._id} className="room-card">
              <h3>{room.code}</h3>
              <p>Tòa: {apartment?.code}</p>
            </div>
          );
        })}
      </div>

      <p>Tìm thấy {filteredRooms.length} phòng</p>
    </div>
  );
}
```

---

## Use Case 3: Customer Registration Wizard

```javascript
function RegistrationWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    uuid: `user_${Date.now()}`,
    name: '',
    phone: '',
    dob: '',
    apartment_id: '',
    room_id: ''
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    try {
      await roomService.registerCustomer(formData);
      alert('Đăng ký thành công!');
      // Reset or redirect
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  return (
    <div className="wizard">
      <div className="progress">Bước {step}/3</div>

      {step === 1 && (
        <div>
          <h2>Thông tin cá nhân</h2>
          <input
            placeholder="Họ tên"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          <input
            type="date"
            value={formData.dob}
            onChange={(e) => setFormData({...formData, dob: e.target.value})}
          />
          <button onClick={handleNext}>Tiếp theo</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Chọn phòng</h2>
          <ApartmentRoomPicker
            onSelect={({ apartmentId, roomId }) => 
              setFormData({...formData, apartment_id: apartmentId, room_id: roomId})
            }
          />
          <button onClick={handleBack}>Quay lại</button>
          <button onClick={handleNext} disabled={!formData.room_id}>
            Tiếp theo
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>Xác nhận thông tin</h2>
          <p>Tên: {formData.name}</p>
          <p>SĐT: {formData.phone}</p>
          <p>Ngày sinh: {formData.dob}</p>
          <button onClick={handleBack}>Quay lại</button>
          <button onClick={handleSubmit}>Hoàn tất đăng ký</button>
        </div>
      )}
    </div>
  );
}
```

---

## Use Case 4: Voice/Chatbot Room Verification

```javascript
function VoiceRoomVerification() {
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = async (voiceText) => {
    setTranscript(voiceText);
    
    try {
      const response = await roomService.checkRoom(voiceText);
      setResult({
        success: response.includes('đã được xác nhận'),
        message: response
      });
    } catch (error) {
      setResult({
        success: false,
        message: 'Lỗi xử lý giọng nói'
      });
    }
  };

  return (
    <div className="voice-verification">
      <h2>Xác nhận phòng bằng giọng nói</h2>
      
      <button onClick={() => setIsListening(!isListening)}>
        {isListening ? '🔴 Dừng' : '🎤 Nói mã phòng'}
      </button>

      {transcript && (
        <div className="transcript">
          <strong>Bạn nói:</strong> {transcript}
        </div>
      )}

      {result && (
        <div className={`result ${result.success ? 'success' : 'error'}`}>
          {result.message}
        </div>
      )}

      <div className="hint">
        Ví dụ: "Tôi ở phòng A101" hoặc "Phòng B203"
      </div>
    </div>
  );
}
```

---

# ⚠️ Important Notes

## 1. Current Limitations

### Apartment API:
- ❌ Không có pagination
- ❌ Không có filter/search
- ❌ Không có create/update/delete endpoints
- ✅ Chỉ có list all

### Room API:
- ❌ Không có pagination
- ❌ Không có filter by apartment (phải filter ở client)
- ❌ Không có create/update/delete endpoints
- ❌ `register` endpoint không return data
- ✅ Có chatbot check room
- ✅ Có register customer

## 2. Data Relationships

```
Apartment (1) ------> (N) Room
                         |
                         |
                         v
                    Customer (N)
```

- Một Apartment có nhiều Rooms
- Một Room có nhiều Customers
- Room phải thuộc về một Apartment

## 3. Best Practices

### ✅ DO:
- Cache apartment/room data (ít thay đổi)
- Filter rooms by apartment ở client-side
- Validate customer data trước khi submit
- Use context/state management cho apartment/room data
- Handle empty states

### ❌ DON'T:
- Fetch apartments/rooms mỗi lần render
- Submit registration form nhiều lần
- Hardcode apartment/room IDs
- Skip validation

## 4. Performance Tips

```javascript
// ✅ Good: Fetch once, cache in context
const RoomProvider = () => {
  useEffect(() => {
    fetchApartments();
    fetchRooms();
  }, []); // Only once
};

// ❌ Bad: Fetch every render
function Component() {
  useEffect(() => {
    fetchApartments();
  }); // No deps = every render
}

// ✅ Good: Filter client-side
const filteredRooms = rooms.filter(r => r.apartment_id === selectedApartmentId);

// ❌ Bad: Fetch repeatedly
const fetchRoomsByApartment = (apartmentId) => {
  // Makes API call every time
};
```

---

# 🔧 Error Handling

## Comprehensive Error Handler

```javascript
const handleApiError = (error, context = 'API call') => {
  console.error(`Error in ${context}:`, error);

  let userMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại!';

  if (error.response) {
    // Server responded with error
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        userMessage = data.message || 'Dữ liệu không hợp lệ';
        break;
      case 404:
        userMessage = 'Không tìm thấy dữ liệu';
        break;
      case 500:
        userMessage = 'Lỗi server. Vui lòng liên hệ admin!';
        break;
      default:
        userMessage = data.message || userMessage;
    }
  } else if (error.request) {
    // Request made but no response
    userMessage = 'Không thể kết nối server. Kiểm tra mạng!';
  } else {
    // Error in request setup
    userMessage = error.message;
  }

  return { error: true, message: userMessage };
};

// Usage
try {
  await roomService.registerCustomer(data);
} catch (error) {
  const { message } = handleApiError(error, 'Register customer');
  alert(message);
}
```

---

# 🆘 Troubleshooting

## Issue 1: Apartments/Rooms không load
**Symptoms:** Empty list, no data  
**Possible causes:**
- Server không chạy
- Database rỗng
- Network error

**Solutions:**
1. Check server: `lsof -ti:3321`
2. Check database có data
3. Check network tab trong DevTools
4. Check CORS errors

---

## Issue 2: Room registration không có response
**Symptoms:** HTTP 200 nhưng không có data trả về  
**Cause:** API bug - endpoint không return response  
**Workaround:**
```javascript
// Check HTTP status instead of response body
if (response.ok) {
  // Success
} else {
  // Error
}
```

---

## Issue 3: Cascading dropdown không reset
**Symptoms:** Room không clear khi đổi apartment  
**Solution:**
```javascript
const handleApartmentChange = (newApartmentId) => {
  setApartmentId(newApartmentId);
  setRoomId(''); // ← Remember to reset!
};
```

---

## Issue 4: Chatbot không nhận diện phòng
**Symptoms:** Luôn trả về "không tìm thấy"  
**Possible causes:**
- Message format sai
- Room code không match
- Database không có room

**Solutions:**
- Test với exact room code: "A101"
- Check room có tồn tại: GET /rooms
- Check normalization logic

---

# 📊 Response Status Codes

| Code | Status | Meaning |
|------|--------|---------|
| 200 | OK | Request thành công |
| 400 | Bad Request | Dữ liệu không hợp lệ |
| 404 | Not Found | Không tìm thấy resource |
| 500 | Internal Server Error | Lỗi server |

---

# 🔮 Planned Features

### Coming Soon:
- ✅ Pagination for apartments/rooms
- ✅ Filter/search APIs
- ✅ Create/Update/Delete endpoints
- ✅ Populate apartment info in room response
- ✅ Return data in register endpoint

### Nice to Have:
- 📊 Room statistics
- 🏷️ Room categories/types
- 📍 Floor/building hierarchy
- 🔍 Advanced search
- 📈 Occupancy tracking

---

# 📞 Support

Nếu gặp vấn đề:
1. Check server logs
2. Test bằng Swagger: `http://localhost:3321/api/v1/docs/`
3. Check MongoDB connection
4. Contact backend team

---

# 📝 Related Documentation

- [Notification API Guide](./NOTIFICATION_API.md)
- [Full API Documentation](./API_DOCUMENTATION.md)
- [Swagger Docs](http://localhost:3321/api/v1/docs/)

---

**Last Updated:** November 13, 2025  
**API Version:** 1.0  
**Status:** Production Ready

