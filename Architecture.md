Analyzed Assignment 9-Category_004.md:L1-799
Ran list workspace directory contents
Ran list non-node_modules files
Ran list models folder
Analyzed package.json:L1-27
Ran check parent directory

# System Architecture & Specification: WedPlan Platform

Based on [Assignment 9-Category_004.md](<file:///d:/projects/wed-plan/wed-plan-backend/Assignment%209-Category_004.md>), here is the comprehensive architectural blueprint for the **WedPlan - Wedding Planning Platform**, covering the high-level system architecture, entity relationships, REST API design, role-based access control (RBAC), and core workflow sequences.

---

## 1. High-Level System Architecture

WedPlan is designed as a decoupled multi-tier architecture featuring a **Next.js client** (frontend UI + SSR/SSG), an **Express.js API Gateway & Application Server**, a **MongoDB database cluster**, and external cloud services for authentication, payments, and media storage.

```mermaid
flowchart TD
    subgraph ClientLayer["Frontend Client (Next.js & ShadCN UI)"]
        UI_Public["Public Pages\n- Home\n- Browse Services\n- Sign In / Sign Up"]
        UI_Customer["Customer Dashboard\n- Overview\n- My Bookings\n- Profile"]
        UI_Vendor["Vendor Dashboard\n- Overview\n- Services Management\n- Booking Requests\n- Subscriptions"]
        UI_Admin["Admin Dashboard\n- Overview\n- Manage Users\n- Manage Services\n- Transactions"]
    end

    subgraph ExternalServices["External Cloud Services"]
        BetterAuth["Better Auth / Google OAuth\n(Identity & Session Provider)"]
        Stripe["Stripe Checkout & Webhooks\n(Subscription Billing)"]
        ImgBB["ImgBB API\n(CDN Image Hosting)"]
    end

    subgraph BackendLayer["Backend Server (Express.js on Node.js)"]
        direction TB
        MW_CORS["CORS & Body Parser"]
        MW_Auth["Authentication Middleware\n(verifyJWT)"]
        MW_RBAC["Authorization Middleware\n(verifyRole & checkBlocked)"]
        MW_Owner["Ownership & Policy Guards\n(verifyOwnership & subscriptionLimit)"]

        subgraph Controllers["API Controllers & Business Logic"]
            AuthController["Auth Controller"]
            UserController["User Controller"]
            ServiceController["Service Controller"]
            BookingController["Booking Controller"]
            PaymentController["Payment & Webhook Controller"]
            AdminController["Admin Controller"]
        end
    end

    subgraph DataLayer["Database Layer (MongoDB)"]
        Col_Users[("users")]
        Col_Services[("services")]
        Col_Bookings[("bookings")]
        Col_Transactions[("transactions")]
    end

    %% Client to External
    UI_Public -->|"Upload Image"| ImgBB
    UI_Vendor -->|"Upload Service Images"| ImgBB
    UI_Public -->|"OAuth Login"| BetterAuth

    %% Client to Backend
    ClientLayer -->|"REST API Requests (Bearer JWT)"| MW_CORS
    MW_CORS --> MW_Auth
    MW_Auth --> MW_RBAC
    MW_RBAC --> MW_Owner

    %% Middleware to Controllers
    MW_Owner --> Controllers

    %% Controllers to External
    PaymentController -->|"Create Checkout Session"| Stripe
    Stripe -->|"Webhook (checkout.session.completed)"| PaymentController

    %% Controllers to MongoDB
    AuthController --> Col_Users
    UserController --> Col_Users
    ServiceController --> Col_Services
    BookingController --> Col_Bookings
    PaymentController --> Col_Transactions
    PaymentController --> Col_Users
    AdminController --> Col_Users
    AdminController --> Col_Services
    AdminController --> Col_Transactions
```

---

## 2. Entity-Relationship Diagram (ERD)

The database schema utilizes MongoDB with 4 primary collections: `users`, `services`, `bookings`, and `transactions`.

```mermaid
erDiagram
    USERS ||--o{ SERVICES : "publishes (vendorId)"
    USERS ||--o{ BOOKINGS : "books as customer (customerId)"
    USERS ||--o{ BOOKINGS : "receives as vendor (vendorId)"
    USERS ||--o{ TRANSACTIONS : "pays for subscription (vendorId)"
    SERVICES ||--o{ BOOKINGS : "booked for event (serviceId)"

    USERS {
        ObjectId _id PK
        string name
        string email UK
        string password "Hashed (nullable for OAuth)"
        string image "ImgBB URL"
        string role "customer | vendor | admin"
        boolean isBlocked "default: false"
        string businessName "Optional for vendor"
        string subscriptionPlan "free | premium (default: free)"
        date subscriptionExpiresAt "Nullable"
        date createdAt
        date updatedAt
    }

    SERVICES {
        ObjectId _id PK
        ObjectId vendorId FK "References USERS._id"
        string serviceName
        string category "Photography | Venues | Decoration | Catering | Makeup | Fashion"
        string description
        number price
        string location
        string[] images "Array of ImgBB URLs"
        string status "pending | approved | rejected"
        boolean isActive "default: true"
        date createdAt
        date updatedAt
    }

    BOOKINGS {
        ObjectId _id PK
        ObjectId serviceId FK "References SERVICES._id"
        ObjectId vendorId FK "References USERS._id"
        ObjectId customerId FK "References USERS._id"
        date eventDate
        string eventLocation
        string message "Additional instructions"
        string status "pending | accepted | rejected | cancelled"
        date createdAt
        date updatedAt
    }

    TRANSACTIONS {
        ObjectId _id PK
        ObjectId vendorId FK "References USERS._id"
        string plan "premium"
        number amount
        string currency "usd"
        string stripeSessionId UK
        string stripeSubscriptionId "Nullable"
        string status "pending | succeeded | failed"
        date createdAt
        date updatedAt
    }
```

### Relational Constraints & Business Rules

* **Free Tier Limit:** Vendors with `subscriptionPlan = 'free'` can have at most **3 active/approved services** (`isActive: true`, `status: 'approved'`).
* **Booking Isolation:**
  * Customers cannot book a service where `vendorId == customerId`.
  * Unique constraint on active bookings: `(serviceId, eventDate)` where `status IN ['pending', 'accepted']`.
* **State Immutability:**
  * Once a booking transitions to `accepted`, `rejected`, or `cancelled`, its state is final.
  * Customers can only cancel when status is `pending`.

---

## 3. Role-Based Access Control (RBAC) & Permission Matrix

The application enforces a multi-tier permission model. Server-side middleware verifies tokens, user block status, specific roles, and resource ownership.

| Feature / Action                            |       Public / Guest       | Customer |     Vendor (Free)     |     Vendor (Premium)     | Admin | Server Guards & Conditions                                                     |
| :------------------------------------------ | :------------------------: | :------: | :-------------------: | :----------------------: | :---: | :----------------------------------------------------------------------------- |
| **View Home & Featured Services**     |             ✅             |    ✅    |          ✅          |            ✅            |  ✅  | Public                                                                         |
| **Browse / Search / Filter Services** |             ✅             |    ✅    |          ✅          |            ✅            |  ✅  | Public (`status: 'approved'`, `isActive: true`)                            |
| **View Service Details**              | ❌ *(Redirect to login)* |    ✅    |          ✅          |            ✅            |  ✅  | `verifyJWT`, `checkBlocked`                                                |
| **Submit Booking Request**            |             ❌             |    ✅    |          ❌          |            ❌            |  ❌  | `verifyJWT`, `role: customer`, `customerId != vendorId`                  |
| **View Own Bookings**                 |             ❌             |    ✅    |          ❌          |            ❌            |  ❌  | `verifyJWT`, `role: customer`, filter `customerId = req.user.id`         |
| **Cancel Pending Booking**            |             ❌             |    ✅    |          ❌          |            ❌            |  ❌  | `verifyJWT`, `role: customer`, `status == pending`, ownership check      |
| **Create Service Listing**            |             ❌             |    ❌    | ✅ *(Max 3 active)* |    ✅ *(Unlimited)*    |  ❌  | `verifyJWT`, `role: vendor`, `subscriptionLimitCheck`                    |
| **Update / Delete Own Service**       |             ❌             |    ❌    |          ✅          |            ✅            |  ❌  | `verifyJWT`, `role: vendor`, ownership check (`vendorId == req.user.id`) |
| **View Vendor Booking Requests**      |             ❌             |    ❌    |          ✅          |            ✅            |  ❌  | `verifyJWT`, `role: vendor`, filter `vendorId = req.user.id`             |
| **Accept / Reject Booking**           |             ❌             |    ❌    |          ✅          |            ✅            |  ❌  | `verifyJWT`, `role: vendor`, `status == pending`, ownership check        |
| **Initiate Stripe Subscription**      |             ❌             |    ❌    |          ✅          | ❌ *(Already premium)* |  ❌  | `verifyJWT`, `role: vendor`                                                |
| **Manage Users (Block / Unblock)**    |             ❌             |    ❌    |          ❌          |            ❌            |  ✅  | `verifyJWT`, `role: admin`                                                 |
| **Review Services (Approve/Reject)**  |             ❌             |    ❌    |          ❌          |            ❌            |  ✅  | `verifyJWT`, `role: admin`                                                 |
| **Delete Inappropriate Service**      |             ❌             |    ❌    |          ❌          |            ❌            |  ✅  | `verifyJWT`, `role: admin`                                                 |
| **View Platform Transactions**        |             ❌             |    ❌    |          ❌          |            ❌            |  ✅  | `verifyJWT`, `role: admin`                                                 |
| **Update Own Profile**                |             ❌             |    ✅    |          ✅          |            ✅            |  ✅  | `verifyJWT`, cannot self-modify `role` or `subscriptionPlan`             |
| **Access Other Role's Dashboard**     |             ❌             |    ❌    |          ❌          |            ❌            |  ❌  | Forbidden (Returns HTTP 403)                                                   |
| **Blocked User Access**               |             ❌             |    ❌    |          ❌          |            ❌            |  ❌  | `checkBlocked` middleware rejects with HTTP 403                              |

---

## 4. API Architecture & Endpoint Specification

All protected endpoints require the HTTP header:
`Authorization: Bearer <JWT_TOKEN>`

### 4.1 Authentication & Profile (`/api/auth` & `/api/users`)

| Method    | Endpoint             | Access Role   | Description                                                                  | HTTP Status               |
| :-------- | :------------------- | :------------ | :--------------------------------------------------------------------------- | :------------------------ |
| `POST`  | `/api/auth/signup` | Public        | Register customer or vendor (Admin creation restricted)                      | `201 Created` / `400` |
| `POST`  | `/api/auth/signin` | Public        | Login with credentials; returns JWT token + user profile                     | `200 OK` / `401`      |
| `POST`  | `/api/auth/google` | Public        | Google OAuth token verification and account linking                          | `200 OK` / `400`      |
| `GET`   | `/api/users/me`    | Authenticated | Retrieve current user profile and active subscription details                | `200 OK` / `401`      |
| `PATCH` | `/api/users/me`    | Authenticated | Update profile (`name`, `image`, `businessName`). Role changes blocked | `200 OK` / `400`      |

### 4.2 Services (`/api/services`)

| Method     | Endpoint                      | Access Role    | Description                                                                   | HTTP Status                    |
| :--------- | :---------------------------- | :------------- | :---------------------------------------------------------------------------- | :----------------------------- |
| `GET`    | `/api/services`             | Public         | Search/filter/sort approved active services (pagination supported)            | `200 OK`                     |
| `GET`    | `/api/services/featured`    | Public         | Fetch top 6 featured approved services for homepage                           | `200 OK`                     |
| `GET`    | `/api/services/:id`         | Authenticated  | Get full service details by ID with vendor info                               | `200 OK` / `404`           |
| `POST`   | `/api/services`             | Vendor         | Add new service. Default status: `pending`. Checks 3-service limit for free | `201 Created` / `403`      |
| `GET`    | `/api/services/my-services` | Vendor         | Fetch all services belonging to the authenticated vendor                      | `200 OK`                     |
| `PATCH`  | `/api/services/:id`         | Vendor         | Update vendor's own service (re-verifies ownership)                           | `200 OK` / `403` / `404` |
| `DELETE` | `/api/services/:id`         | Vendor / Admin | Soft delete or remove service (Vendor must own it; Admin has master)          | `200 OK` / `403`           |

### 4.3 Bookings (`/api/bookings`)

| Method    | Endpoint                          | Access Role | Description                                                                          | HTTP Status                    |
| :-------- | :-------------------------------- | :---------- | :----------------------------------------------------------------------------------- | :----------------------------- |
| `POST`  | `/api/bookings`                 | Customer    | Create booking request (`eventDate`, `location`, `message`). Checks duplicates | `201 Created` / `400`      |
| `GET`   | `/api/bookings/my-bookings`     | Customer    | Fetch bookings submitted by current customer                                         | `200 OK`                     |
| `PATCH` | `/api/bookings/:id/cancel`      | Customer    | Cancel pending booking (immutable if accepted/rejected)                              | `200 OK` / `400` / `403` |
| `GET`   | `/api/bookings/vendor-requests` | Vendor      | Fetch booking requests for current vendor's services                                 | `200 OK`                     |
| `PATCH` | `/api/bookings/:id/status`      | Vendor      | Accept or reject pending booking request (`status: 'accepted' \| 'rejected'`)       | `200 OK` / `400` / `403` |

### 4.4 Payments & Subscriptions (`/api/payments`)

| Method   | Endpoint                                  | Access Role     | Description                                                           | HTTP Status          |
| :------- | :---------------------------------------- | :-------------- | :-------------------------------------------------------------------- | :------------------- |
| `POST` | `/api/payments/create-checkout-session` | Vendor          | Initiates Stripe Checkout Session for Premium upgrade                 | `200 OK` / `400` |
| `POST` | `/api/payments/webhook`                 | Public (Stripe) | Stripe webhook endpoint verifying signature & activating subscription | `200 OK` / `400` |

### 4.5 Admin Control (`/api/admin`)

| Method    | Endpoint                           | Access Role | Description                                                         | HTTP Status          |
| :-------- | :--------------------------------- | :---------- | :------------------------------------------------------------------ | :------------------- |
| `GET`   | `/api/admin/overview`            | Admin       | Aggregate dashboard counts (users, vendors, services, transactions) | `200 OK`           |
| `GET`   | `/api/admin/users`               | Admin       | List, search (name/email), and filter registered users by role      | `200 OK`           |
| `PATCH` | `/api/admin/users/:id/block`     | Admin       | Block or unblock a user (`isBlocked: boolean`)                    | `200 OK` / `404` |
| `GET`   | `/api/admin/services`            | Admin       | List all submitted services (pending, approved, rejected)           | `200 OK`           |
| `PATCH` | `/api/admin/services/:id/status` | Admin       | Moderate service status (`approved`, `rejected`, `pending`)   | `200 OK` / `400` |
| `GET`   | `/api/admin/transactions`        | Admin       | View audit log of all Stripe subscription transactions              | `200 OK`           |

---

## 5. Core Process Flow Diagrams

### 5.1 Booking Request & Decision Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer
    actor Vendor as Vendor
    participant API as Express API
    participant DB as MongoDB

    Customer->>API: POST /api/bookings {serviceId, eventDate, eventLocation, message}
    Note over API: Middleware: verifyJWT + verifyRole('customer') + checkBlocked
    API->>DB: Query service & check vendorId != customerId
    API->>DB: Check for duplicate booking (serviceId, eventDate)
    API->>DB: Insert booking (status: "pending")
    DB-->>API: Booking saved
    API-->>Customer: 201 Created (Booking Pending)

    Vendor->>API: GET /api/bookings/vendor-requests
    API->>DB: Query bookings WHERE vendorId == req.user.id
    DB-->>API: List of requests
    API-->>Vendor: 200 OK (Render requests on Vendor Dashboard)

    Vendor->>API: PATCH /api/bookings/:id/status {status: "accepted" | "rejected"}
    Note over API: Middleware: verifyJWT + verifyRole('vendor') + verifyOwnership
    API->>DB: Ensure booking.status == "pending"
    API->>DB: Update booking.status to "accepted" / "rejected"
    DB-->>API: Updated booking
    API-->>Vendor: 200 OK
    API-->>Customer: Status reflected in "My Bookings"
```

### 5.2 Stripe Subscription & Webhook Upgrade Flow

```mermaid
sequenceDiagram
    autonumber
    actor Vendor as Vendor
    participant Client as Next.js Client
    participant API as Express API
    participant Stripe as Stripe Gateway
    participant DB as MongoDB

    Vendor->>Client: Clicks "Upgrade to Premium"
    Client->>API: POST /api/payments/create-checkout-session
    Note over API: verifyJWT + verifyRole('vendor')
    API->>Stripe: stripe.checkout.sessions.create({metadata: {vendorId}})
    Stripe-->>API: session {id, url}
    API-->>Client: {checkoutUrl}
    Client->>Stripe: Redirect vendor to Stripe Checkout
    Vendor->>Stripe: Submits payment info (Test Card)
  
    par Async Webhook Verification
        Stripe->>API: POST /api/payments/webhook [checkout.session.completed]
        Note over API: Validate Stripe Webhook Signature with STRIPE_WEBHOOK_SECRET
        API->>DB: Create Transaction record (status: "succeeded")
        API->>DB: Update User (subscriptionPlan: "premium", subscriptionExpiresAt)
        API-->>Stripe: 200 Received
    and Frontend Redirection
        Stripe-->>Client: Redirect to /payment/success?session_id=...
        Client->>API: GET /api/users/me (Checks updated subscription)
        API-->>Client: Returns updated user profile with "premium" status
        Client-->>Vendor: Display Premium Vendor Badge & Unlimited Service Publishing
    end
```

---

## 6. Backend Implementation Checklist

To align your Express server structure in `wed-plan-backend` with this design:

1. **Middlewares:**
   - `auth.middleware.js`: Validates JWT, extracts `req.user`.
   - `role.middleware.js`: Compares `req.user.role` with allowed roles; checks `req.user.isBlocked`.
   - `subscription.middleware.js`: Counts active services (`status: 'approved'`) for vendors on the `free` plan before allowing `POST /api/services`.
2. **Models:**
   - Define Mongoose schemas for `User.js`, `Service.js`, `Booking.js`, and `Transaction.js` matching the ERD field specifications.
3. **Stripe Webhook:**
   - Ensure the webhook route (`/api/payments/webhook`) uses `express.raw({type: 'application/json'})` so Stripe's HMAC signature validation succeeds.
