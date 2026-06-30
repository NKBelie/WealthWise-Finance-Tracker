# WealthWise Finance Tracker - Complete API Documentation

**Base URL:** `http://localhost:5000`  
**API Version:** 1.0.0  
**Level:** Level 1 - Task 2: Enhanced REST API Implementation  

## 📋 Overview

The WealthWise API provides comprehensive endpoints for personal finance management including user management, income tracking, expense monitoring, budget planning, and categorization systems.

### 🔧 Features

- **Complete CRUD Operations** for all resources
- **Input Validation** with detailed error messages
- **Security Middleware** with CORS and Helmet protection
- **Database Relationships** with proper foreign key constraints
- **Budget Management** with progress tracking and alerts
- **Categorization System** for better organization
- **Error Handling** with consistent response format

### 📊 Response Format

All API responses follow a consistent format:

```json
{
  "status": "success|fail|error",
  "message": "Descriptive message",
  "data": {
    // Response data
  },
  "results": 10 // For list endpoints
}
```

---

## 🏥 Health & Information Endpoints

### Check API Health
```http
GET /api/health
```

**Response:**
```json
{
  "status": "success",
  "service": "wealthwise-api",
  "environment": "development",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "memory": {
    "rss": 50331648,
    "heapTotal": 33554432,
    "heapUsed": 20971520,
    "external": 1048576
  },
  "version": "1.0.0"
}
```

### API Information
```http
GET /api/info
```

**Response:** Detailed API feature information and endpoint overview.

---

## 👥 Users Management

### Create User
```http
POST /api/users
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Validation Rules:**
- `full_name`: Required, 1-100 characters
- `email`: Required, valid email format, must be unique
- `password`: Required, minimum 8 characters, must contain uppercase, lowercase, number, and special character

**Success Response (201):**
```json
{
  "status": "success",
  "message": "User created successfully",
  "data": {
    "user": {
      "id": 1,
      "full_name": "John Doe",
      "email": "john.doe@example.com",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### Get All Users
```http
GET /api/users
```

**Success Response (200):**
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "users": [
      {
        "id": 1,
        "full_name": "John Doe",
        "email": "john.doe@example.com",
        "created_at": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

### Get User By ID
```http
GET /api/users/:id
```

### Update User
```http
PUT /api/users/:id
Content-Type: application/json

{
  "full_name": "John Smith",
  "email": "john.smith@example.com"
}
```

### Delete User
```http
DELETE /api/users/:id
```

**Success Response (204):** No content

---

## 💰 Income Management

### Create Income
```http
POST /api/income
Content-Type: application/json

{
  "user_id": 1,
  "category_id": 1,
  "source": "Software Developer Salary",
  "amount": 5000.00,
  "income_date": "2024-01-15",
  "description": "Monthly salary payment",
  "is_recurring": true,
  "recurring_type": "MONTHLY"
}
```

**Validation Rules:**
- `user_id`: Required, positive integer
- `source`: Required, 1-100 characters
- `amount`: Required, positive number with max 2 decimal places
- `income_date`: Required, valid ISO date
- `recurring_type`: Optional, one of: DAILY, WEEKLY, MONTHLY, YEARLY

### Get All Income
```http
GET /api/income
GET /api/income?user_id=1
GET /api/income?user_id=1&start_date=2024-01-01&end_date=2024-01-31
```

**Query Parameters:**
- `user_id`: Filter by user
- `start_date`: Filter income from this date
- `end_date`: Filter income until this date
- `category_id`: Filter by category
- `is_recurring`: Filter recurring income (true/false)

### Get Income By ID
```http
GET /api/income/:id
```

### Update Income
```http
PUT /api/income/:id
Content-Type: application/json

{
  "source": "Senior Developer Salary",
  "amount": 6000.00,
  "description": "Updated salary amount"
}
```

### Delete Income
```http
DELETE /api/income/:id
```

---

## 💸 Expense Management

### Create Expense
```http
POST /api/expenses
Content-Type: application/json

{
  "user_id": 1,
  "category_id": 7,
  "category": "Housing",
  "amount": 1200.00,
  "expense_date": "2024-01-15",
  "description": "Monthly rent payment",
  "payment_method": "Bank Transfer",
  "location": "Downtown Apartment Complex",
  "is_recurring": true,
  "recurring_type": "MONTHLY"
}
```

**Validation Rules:**
- `user_id`: Required, positive integer
- `category`: Required, 1-100 characters
- `amount`: Required, positive number
- `expense_date`: Required, valid ISO date
- `payment_method`: Optional, payment method description
- `location`: Optional, expense location

### Get All Expenses
```http
GET /api/expenses
GET /api/expenses?user_id=1
GET /api/expenses?user_id=1&category=Housing
GET /api/expenses?start_date=2024-01-01&end_date=2024-01-31
```

**Query Parameters:**
- `user_id`: Filter by user
- `category`: Filter by category name
- `start_date`: Filter expenses from this date
- `end_date`: Filter expenses until this date
- `payment_method`: Filter by payment method
- `min_amount`: Filter expenses above this amount
- `max_amount`: Filter expenses below this amount

### Get Expense By ID
```http
GET /api/expenses/:id
```

### Update Expense
```http
PUT /api/expenses/:id
Content-Type: application/json

{
  "category": "Utilities",
  "amount": 150.00,
  "description": "Electric and water bill"
}
```

### Delete Expense
```http
DELETE /api/expenses/:id
```

---

## 📊 Budget Management

### Create Budget
```http
POST /api/budgets
Content-Type: application/json

{
  "user_id": 1,
  "category_id": 7,
  "name": "Housing Budget",
  "description": "Monthly housing expenses including rent and utilities",
  "budgeted_amount": 1500.00,
  "period_type": "MONTHLY",
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
  "alert_threshold": 80.0
}
```

**Validation Rules:**
- `user_id`: Required, positive integer
- `name`: Required, 1-100 characters
- `budgeted_amount`: Required, positive number
- `period_type`: Required, one of: WEEKLY, MONTHLY, QUARTERLY, YEARLY
- `start_date`: Required, valid ISO date
- `end_date`: Required, valid ISO date, must be after start_date
- `alert_threshold`: Optional, percentage (0-100), default 80%

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Budget created successfully",
  "data": {
    "budget": {
      "id": 1,
      "user_id": 1,
      "category_id": 7,
      "name": "Housing Budget",
      "budgeted_amount": "1500.00",
      "spent_amount": "0.00",
      "period_type": "MONTHLY",
      "start_date": "2024-01-01",
      "end_date": "2024-01-31",
      "alert_threshold": "80.00",
      "is_active": true,
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### Get All Budgets
```http
GET /api/budgets
GET /api/budgets?user_id=1
GET /api/budgets?user_id=1&is_active=true
GET /api/budgets?period_type=MONTHLY&current_period=true
```

**Query Parameters:**
- `user_id`: Filter by user
- `is_active`: Filter active/inactive budgets (true/false)
- `period_type`: Filter by period type
- `category_id`: Filter by category
- `current_period`: Show only budgets for current period (true/false)

### Get Budget By ID
```http
GET /api/budgets/:id
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "budget": {
      "id": 1,
      "user_id": 1,
      "category_id": 7,
      "name": "Housing Budget",
      "budgeted_amount": "1500.00",
      "spent_amount": "1200.00",
      "period_type": "MONTHLY",
      "start_date": "2024-01-01",
      "end_date": "2024-01-31",
      "category_name": "Housing",
      "category_color": "#DC2626",
      "category_icon": "home"
    }
  }
}
```

### Update Budget
```http
PUT /api/budgets/:id
Content-Type: application/json

{
  "name": "Updated Housing Budget",
  "budgeted_amount": 1600.00,
  "alert_threshold": 85.0
}
```

### Delete Budget
```http
DELETE /api/budgets/:id
```

### Get Budget Progress
```http
GET /api/budgets/:id/progress
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "progress": {
      "id": 1,
      "name": "Housing Budget",
      "budgeted_amount": "1500.00",
      "spent_amount": "1200.00",
      "remaining_amount": "300.00",
      "spent_percentage": "80.00",
      "alert_threshold": "80.00",
      "alert_triggered": true,
      "period_type": "MONTHLY",
      "start_date": "2024-01-01",
      "end_date": "2024-01-31",
      "status": "ACTIVE"
    }
  }
}
```

### Sync Budget with Expenses
```http
POST /api/budgets/:id/sync
```

**Description:** Automatically calculates and updates the spent amount based on actual expenses in the budget period and category.

### Update Budget Spending
```http
PATCH /api/budgets/:id/spending
Content-Type: application/json

{
  "spent_amount": 1350.00
}
```

### Toggle Budget Status
```http
PATCH /api/budgets/:id/toggle
```

**Description:** Toggles the budget between active and inactive status.

### Get User Budget Summary
```http
GET /api/budgets/users/:user_id/summary
GET /api/budgets/users/:user_id/summary?period_type=MONTHLY
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "summary": {
      "total_budgets": "5",
      "total_budgeted": "5000.00",
      "total_spent": "3800.00",
      "total_remaining": "1200.00",
      "avg_spent_percentage": "76.00",
      "budgets_over_threshold": "2"
    }
  }
}
```

### Get Budget Alerts
```http
GET /api/budgets/users/:user_id/alerts
```

**Success Response (200):**
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "alerts": [
      {
        "id": 1,
        "name": "Housing Budget",
        "budgeted_amount": "1500.00",
        "spent_amount": "1350.00",
        "spent_percentage": "90.00",
        "alert_threshold": "80.00"
      }
    ]
  }
}
```

### Create Multiple Budgets
```http
POST /api/budgets/bulk
Content-Type: application/json

{
  "budgets": [
    {
      "user_id": 1,
      "category_id": 7,
      "name": "Housing Budget",
      "budgeted_amount": 1500.00,
      "period_type": "MONTHLY",
      "start_date": "2024-01-01",
      "end_date": "2024-01-31"
    },
    {
      "user_id": 1,
      "category_id": 9,
      "name": "Food Budget", 
      "budgeted_amount": 400.00,
      "period_type": "MONTHLY",
      "start_date": "2024-01-01",
      "end_date": "2024-01-31"
    }
  ]
}
```

### Get Budgets by Category
```http
GET /api/budgets/users/:user_id/categories/:category_id
```

---

## 🏷️ Error Responses

### Validation Error (400)
```json
{
  "status": "fail",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "email must be a valid email"
    },
    {
      "field": "amount",
      "message": "amount must be a positive number"
    }
  ]
}
```

### Not Found (404)
```json
{
  "status": "fail",
  "message": "Resource not found",
  "error": "User with id 999 not found"
}
```

### Conflict (409)
```json
{
  "status": "fail", 
  "message": "Resource conflict",
  "error": "A budget for this category and period already exists"
}
```

### Server Error (500)
```json
{
  "status": "error",
  "message": "Internal server error",
  "error": "Database connection failed"
}
```

---

## 🔒 Security Features

- **Input Validation:** All inputs validated using Joi schemas
- **Password Hashing:** bcrypt with 12 salt rounds
- **SQL Injection Prevention:** Parameterized queries
- **XSS Protection:** Input sanitization and Helmet middleware
- **CORS Configuration:** Configurable origin restrictions
- **Rate Limiting:** Ready for implementation
- **Request ID Tracking:** Every request gets unique identifier

---

## 📈 Database Schema

### Users Table
- Primary key with auto-increment
- Unique email constraint
- Password hashing before storage
- Timestamps for audit trail

### Income Table
- Foreign key relationship to users
- Optional category relationship
- Support for recurring income
- Date-based indexing for performance

### Expenses Table
- Foreign key relationship to users and categories
- Support for receipt URLs
- Payment method tracking
- Location information
- Recurring expense support

### Budgets Table
- Foreign key relationships to users and categories
- Period-based budget management
- Alert threshold configuration
- Spent amount tracking
- Date range validation

### Categories Table
- Dynamic category management
- Type specification (INCOME/EXPENSE/BOTH)
- Color and icon support for UI
- Usage statistics available

---

## 🧪 Testing the API

### Using Postman
1. Import the Postman collection from `/postman/` directory
2. Set base URL to `http://localhost:5000`
3. Test endpoints in order: Users → Income → Expenses → Budgets

### Using curl
```bash
# Health check
curl -X GET http://localhost:5000/api/health

# Create user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123!"
  }'

# Create budget
curl -X POST http://localhost:5000/api/budgets \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "name": "Test Budget",
    "budgeted_amount": 1000.00,
    "period_type": "MONTHLY",
    "start_date": "2024-01-01",
    "end_date": "2024-01-31"
  }'
```

---

## 📊 Implementation Status

### Level 1 - Task 2: REST API ✅ COMPLETED

**Core Features:**
- ✅ Complete CRUD operations for all resources
- ✅ Input validation with comprehensive error handling
- ✅ Database relationships and constraints
- ✅ Security middleware and password hashing
- ✅ Budget management with progress tracking
- ✅ Category system for better organization
- ✅ Query filtering and pagination support
- ✅ Bulk operations and batch processing
- ✅ API documentation with examples

**Architecture Quality:**
- ✅ MVC pattern implementation
- ✅ Modular route organization
- ✅ Reusable middleware components
- ✅ Consistent error handling
- ✅ Database optimization with indexes
- ✅ Environment configuration management
- ✅ Professional code structure

**Next Steps:**
- Level 1, Task 3: Vanilla HTML/CSS/JavaScript Frontend
- Integration with frontend for complete user experience

---

*Last Updated: Current Date*  
*API Version: 1.0.0*  
*Documentation Level: Comprehensive*