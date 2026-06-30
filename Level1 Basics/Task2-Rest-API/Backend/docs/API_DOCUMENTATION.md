# WealthWise API Documentation

Base URL:

```text
http://localhost:5000
```

## Health

`GET /api/health`

Success: `200 OK`

## Users

### Create User

`POST /api/users`

```json
{
  "full_name": "Amina Patel",
  "email": "amina@example.com",
  "password": "Password123"
}
```

Success: `201 Created`

### Get All Users

`GET /api/users`

Success: `200 OK`

### Get User By ID

`GET /api/users/:id`

Success: `200 OK`

### Update User

`PUT /api/users/:id`

```json
{
  "full_name": "Amina Khan"
}
```

Success: `200 OK`

### Delete User

`DELETE /api/users/:id`

Success: `204 No Content`

Deleting a user also deletes their income and expenses because both child tables use `ON DELETE CASCADE`.

## Income

### Create Income

`POST /api/income`

```json
{
  "user_id": 1,
  "source": "Salary",
  "amount": 25000.00,
  "income_date": "2026-06-25"
}
```

Success: `201 Created`

### Get All Income

`GET /api/income`

Success: `200 OK`

Optional user filter:

```text
GET /api/income?user_id=1
```

### Get Income By ID

`GET /api/income/:id`

Success: `200 OK`

### Update Income

`PUT /api/income/:id`

```json
{
  "source": "Freelance Project",
  "amount": 3200.00,
  "income_date": "2026-06-26"
}
```

Success: `200 OK`

### Delete Income

`DELETE /api/income/:id`

Success: `204 No Content`

## Expenses

### Create Expense

`POST /api/expenses`

```json
{
  "user_id": 1,
  "category": "Groceries",
  "amount": 850.50,
  "description": "Weekly grocery shopping",
  "expense_date": "2026-06-25"
}
```

Success: `201 Created`

### Get All Expenses

`GET /api/expenses`

Success: `200 OK`

Optional user filter:

```text
GET /api/expenses?user_id=1
```

### Get Expense By ID

`GET /api/expenses/:id`

Success: `200 OK`

### Update Expense

`PUT /api/expenses/:id`

```json
{
  "category": "Transport",
  "amount": 120.00,
  "description": "Taxi fare",
  "expense_date": "2026-06-26"
}
```

Success: `200 OK`

### Delete Expense

`DELETE /api/expenses/:id`

Success: `204 No Content`

## Common Error Responses

Validation error: `400 Bad Request`

```json
{
  "status": "fail",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "email must be a valid email"
    }
  ]
}
```

Not found: `404 Not Found`

Conflict, such as duplicate email: `409 Conflict`
