# Lab 03: RESTful API Development and Validation

## Student Details

- **Name:** [Enter Your Name]
- **Register Number:** [Enter Your Register Number]
- **Section:** [Enter Your Section]
- **Course:** Backend Development Fundamentals

## 1. Objective

The objective of this lab is to develop RESTful APIs using Node.js, Express.js, and SQLite.

This lab covers CRUD operations, query parameters, sorting, pagination, price filtering, input validation, HTTP status codes, and debugging common errors.

## 2. Technologies Used

- Node.js
- Express.js
- SQLite
- JavaScript
- Postman
- Visual Studio Code

## 3. Project Structure

```text
lab-03/
│
├── screenshots/
├── index.js
├── debug-import.js
├── debug-table.js
├── debug-await.js
├── goodreads.db
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## 4. Installation and Execution

### Step 1: Install Dependencies

Open the project folder in the terminal and execute:

```bash
npm install
```

### Step 2: Start the Server

```bash
node index.js
```

### Step 3: Access the API

The server runs at:

```text
http://localhost:3000
```

Use Postman to test the API endpoints.

## 5. API Endpoints

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/books` | Retrieve all books |
| GET | `/books/:bookId` | Retrieve a book using its ID |
| POST | `/books` | Add a new book |
| PUT | `/books/:bookId` | Update an existing book |
| DELETE | `/books/:bookId` | Delete a book |
| GET | `/authors/:authorId/books` | Retrieve books by author ID |

## 6. Query Parameters

The GET `/books` endpoint supports the following query parameters:

| Parameter | Description |
|---|---|
| `search_q` | Search books by title or author |
| `order_by` | Select the column for sorting |
| `order` | Sorting order: ASC or DESC |
| `limit` | Maximum number of records |
| `offset` | Number of records to skip |
| `min_price` | Minimum price filter |
| `max_price` | Maximum price filter |

### Example Requests

**Search books:**

```text
GET /books?search_q=Harry
```

**Sort by price in ascending order:**

```text
GET /books?order_by=price&order=ASC
```

**Sort by price in descending order:**

```text
GET /books?order_by=price&order=DESC
```

**Pagination:**

```text
GET /books?limit=5&offset=0
```

**Filter by price:**

```text
GET /books?min_price=100&max_price=1000
```

**Combined query parameters:**

```text
GET /books?search_q=Harry&order_by=price&order=ASC&limit=5&offset=0&min_price=100&max_price=1000
```

## 7. Input Validation and HTTP Status Codes

The API validates user inputs and returns appropriate HTTP status codes.

| Status Code | Description |
|---|---|
| 200 OK | Request completed successfully |
| 201 Created | New book created successfully |
| 400 Bad Request | Invalid or missing input |
| 404 Not Found | Requested book does not exist |

Validation includes:
- Checking required book fields.
- Checking that the price is numeric.
- Validating book IDs.
- Validating sorting columns and sorting order.
- Validating pagination values.
- Validating minimum and maximum price filters.

## 8. Debugging Exercises

The following debugging exercises were practised:

1. **Wrong Import Path:** Corrected an incorrect module name in the `require()` statement.
2. **Wrong Table Name:** Corrected the SQL query to use the existing database table name.
3. **Missing Await:** Used `await` to wait for the database query to complete before accessing its result.
4. **EADDRINUSE:** Server port conflict debugging exercise — [Update this section after completing the exercise].

## 9. Screenshots

Screenshots of API testing, query parameters, sorting, pagination, update, delete, and debugging exercises are available in the `screenshots/` folder.

### Important Screenshots

- `screenshots/query-search.png`
- `screenshots/query-sort-ascending.png`
- `screenshots/query-sort-descending.png`
- `screenshots/query-pagination.png`
- `screenshots/query-price-filter.png`
- `screenshots/update-success.png`
- `screenshots/delete-success.png`

Additional screenshots are included in the same folder.

## 10. Database

The project uses SQLite as its database.

The database file is:

```text
goodreads.db
```

The book records are stored in the `book` table. SQL queries use parameterized values for database operations.

## 11. Conclusion

In this lab, I developed RESTful APIs using Node.js, Express.js, and SQLite. I implemented CRUD operations, query parameter handling, searching, sorting, pagination, price filtering, and input validation.

I also tested the APIs using Postman and practised debugging common errors related to module imports, SQL table names, asynchronous database operations, and server execution.

This lab helped me understand how RESTful APIs communicate with databases and handle client requests and errors.

## 12. Deployment Information

- **GitHub Repository:** [Add your GitHub repository URL]
- **Live Deployment URL:** [Add your deployed API URL or write Not Deployed]
