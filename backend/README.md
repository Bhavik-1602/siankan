# N&A Art of Design API Documentation

This directory contains the Node.js + Express.js MVC backend. It acts as a middle tier interacting with Supabase to provide authentication, product catalogs, customer checkouts, consultation bookings, profile details, and file uploads.

## Server Setup

1. Make sure you run `npm install` to install backend dependencies.
2. Ensure you have configured `backend/.env` with your Supabase credentials:
   ```env
   PORT=5000
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-optional-service-role-key
   ```
3. To seed products into the database, run:
   ```bash
   npm run seed
   ```
4. Start the server in development mode:
   ```bash
   npm run dev
   ```

---

## API Endpoints Reference

### 1. Authentication
All authentication runs via Supabase Auth.

#### Register a New User
* **Endpoint**: `POST /api/auth/signup`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123",
    "fullName": "Jane Doe"
  }
  ```
* **Validation**: `email` must be valid, `password` min 6 chars, `fullName` min 2 chars.
* **Success Response (201)**:
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "user": { ... },
    "session": { "access_token": "...", ... }
  }
  ```

#### Login User
* **Endpoint**: `POST /api/auth/login`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
* **Success Response (200)**:
  ```json
  {
    "success": true,
    "user": { ... },
    "session": { "access_token": "...", ... }
  }
  ```

#### Logout User
* **Endpoint**: `POST /api/auth/logout`
* **Success Response (200)**: `{ "success": true, "message": "Logged out successfully" }`

---

### 2. User Profiles

#### Fetch Profile
* **Endpoint**: `GET /api/users/profile/:userId`
* **Headers**: `Authorization: Bearer <access_token>`
* **Success Response (200)**:
  ```json
  {
    "id": "uuid",
    "full_name": "Jane Doe",
    "phone": "1234567890",
    "avatar_url": "https://..."
  }
  ```

#### Update Profile
* **Endpoint**: `PUT /api/users/profile/:userId`
* **Headers**: `Authorization: Bearer <access_token>`, `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "full_name": "Jane Doe",
    "phone": "9876543210",
    "avatar_url": "https://..."
  }
  ```
* **Success Response (200)**: `{ "success": true, "profile": { ... } }`

---

### 3. Products Catalog

#### List Products
* **Endpoint**: `GET /api/products`
* **Query Parameters**:
  - `category`: Filters by product category (`pastel`, `festive`, `garba`, `indo-western`, `bridesmaid`).
  - `search`: Case-insensitive text search matching name and description.
  - `fabric`: Filters by fabric type (e.g. `Raw Silk`).
  - `embroidery`: Filters by embroidery styling (e.g. `Zardosi`).
  - `priceMin` / `priceMax`: Numeric range limits.
  - `sortBy`: Field to sort (`price`, `created_at`). Default: `created_at`.
  - `sortOrder`: `asc` or `desc`. Default: `desc`.
  - `page` / `limit`: Pagination parameters.
* **Success Response (200)**: Returns raw array of products `[ { ... }, { ... } ]`.

#### Retrieve Unique Categories, Fabrics, and Embroideries list
* **Endpoint**: `GET /api/products/meta`
* **Success Response (200)**:
  ```json
  {
    "categories": ["pastel", "festive", ...],
    "fabrics": ["Raw Silk", "Mulberry Silk", ...],
    "embroideries": ["Zardosi", "Aari", ...]
  }
  ```

#### Fetch Single Product Details
* **Endpoint**: `GET /api/products/:id`
* **Success Response (200)**: `{ "id": "...", "name": "...", "price": 115000, ... }`

#### Create Product (Admin Only)
* **Endpoint**: `POST /api/products`
* **Headers**: `Authorization: Bearer <access_token>`, `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "name": "Emerald Lehenga",
    "description": "Mint green organza lehenga...",
    "price": 95000,
    "category": "pastel",
    "fabric": "Organza",
    "colors": ["Mint Green"],
    "embroidery": "Aari",
    "image_url": "https://..."
  }
  ```

---

### 4. Orders Checkout

#### Place Order (Permits Guests or Logged In Users)
* **Endpoint**: `POST /api/orders`
* **Headers**: `Authorization: Bearer <optional_access_token>`, `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "customer_name": "Jane Doe",
    "email": "jane@example.com",
    "shipping_address": "123 Main St",
    "city": "Mumbai",
    "postal_code": "400001",
    "phone": "9876543210",
    "total_amount": 153000,
    "payment_method": "UPI",
    "items": [
      {
        "product_id": "product-uuid",
        "quantity": 1,
        "price": 115000,
        "customization_notes": { "bust": "34", "waist": "28" }
      }
    ]
  }
  ```
* **Success Response (201)**: `{ "success": true, "orderId": "order-uuid" }`

#### Fetch User's Orders
* **Endpoint**: `GET /api/orders/user/:userId`
* **Headers**: `Authorization: Bearer <access_token>`
* **Success Response (200)**: Array of orders with order items and product relations.

---

### 5. Consulting Styling Inquiries

#### Submit Styling Inquiry
* **Endpoint**: `POST /api/inquiries`
* **Headers**: `Authorization: Bearer <optional_access_token>`, `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "customer_name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "9876543210",
    "category": "pastel",
    "inquiry_type": "consultation",
    "details": "Interested in custom lehenga measurements",
    "proposed_date": "2026-07-15"
  }
  ```
* **Success Response (201)**: `{ "success": true, "inquiryId": "inquiry-uuid" }`

#### Fetch User's Inquiries
* **Endpoint**: `GET /api/inquiries/user/:userId`
* **Headers**: `Authorization: Bearer <access_token>`
* **Success Response (200)**: Array of styling inquiry rows.

---

### 6. Image Uploads

#### Upload Single File to Storage
* **Endpoint**: `POST /api/upload`
* **Headers**: `Authorization: Bearer <access_token>`, `Content-Type: multipart/form-data`
* **Body (Multipart)**: `image` (file field containing raw image binary)
* **Success Response (200)**: `{ "success": true, "message": "File uploaded successfully", "url": "https://..." }`
