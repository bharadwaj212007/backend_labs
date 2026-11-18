# Backend Development Fundamentals – Lab 04

## Registration, Login and JWT Authentication

### Student Details

- **Name:** DIVITI BHARADWAJ
- **Roll Number:** 252U1R6060
- **Course:** B.Tech – AI & ML
- **Lab:** Lab 04

## 1. Project Description

This project implements user registration and login using Node.js, Express.js, SQLite, bcrypt and JSON Web Tokens (JWT).

Users can register with a username, name and password. Passwords are hashed before being stored in the database. During login, the entered password is compared with the stored hash. If the credentials are correct, the server generates a JWT token.

## 2. Technologies Used

- Node.js
- Express.js
- SQLite
- sqlite3
- bcrypt
- jsonwebtoken
- Postman

## 3. Installation and Execution

Install the dependencies:

```bash
npm install
```

Start the server:

```bash
node app.js
```

The server runs at:

`http://localhost:3000/`

## 4. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register/` | Registers a new user |
| POST | `/login/` | Validates login credentials and generates a JWT |

### Registration Request

```json
{
  "username": "your_username",
  "name": "your_name",
  "password": "your_password"
}
```

### Login Request

```json
{
  "username": "your_username",
  "password": "your_password"
}
```

## 5. Security Features

- Passwords are hashed using bcrypt.
- Duplicate usernames are rejected.
- Login credentials are validated.
- JWT tokens are generated after successful login.
- Only the username is included in the JWT payload.
- Parameterised SQL queries are used.

## 6. Screenshots

All practical screenshots are available in the `screenshots/` folder.

1. Registration Success
2. Duplicate Username
3. Login Success
4. Invalid Password
5. Invalid Username
6. JWT Token Decoding
7. Stored Hashed Password

## 7. Deployment

**Deployed Application URL:** [Add deployed URL]

## 8. GitHub Repository

**GitHub Repository URL:** [Add GitHub repository URL]

## 9. Conclusion

Successfully implemented and tested user registration, password hashing, login authentication and JWT token generation using Node.js, Express.js and SQLite.